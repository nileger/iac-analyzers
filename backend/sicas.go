package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"

	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /api

/** Representation of the characteristics of a SICA and the requirements a user may have towards such a SICA */
type SICA struct {
	Name               string   `yaml:"name" json:"name"`
	ToolSupport        []string `yaml:"toolSupport" json:"toolSupport"`
	FileSupport        []string `yaml:"fileSupport" json:"fileSupport"`
	BuiltIn            bool     `yaml:"builtIn" json:"builtIn"`
	IncludedTools      []string `yaml:"includedTools" json:"includedTools"`
	Categories         []string `yaml:"categories" json:"categories"`
	DevelopmentSupport struct {
		IDE []string `yaml:"ide" json:"ide"`
		CI  []string `yaml:"ci" json:"ci"`
		VC  []string `yaml:"vc" json:"vc"`
	} `yaml:"developmentSupport" json:"developmentSupport"`
	Repository struct {
		Url          string `yaml:"url" json:"url"`
		Stars        int64  `yaml:"stars" json:"stars"`
		Contributors int64  `yaml:"contributors" json:"contributors"`
		License      string `yaml:"license" json:"license"`
		Backers      string `yaml:"backers" json:"backers"`
	} `yaml:"repository" json:"repository"`
	Release struct {
		FirstRelease string `yaml:"firstRelease" json:"firstRelease"`
		LastRelease  string `yaml:"lastRelease" json:"lastRelease"`
	} `yaml:"release" json:"release"`
	Rules struct {
		BuiltInChecks   bool `yaml:"builtInChecks" json:"builtInChecks"`
		CustomChecks    bool `yaml:"customChecks" json:"customChecks"`
		BlacklistChecks bool `yaml:"blacklistChecks" json:"blacklistChecks"`
		IgnoreFindings  bool `yaml:"ignoreFindings" json:"ignoreFindings"`
		WhitelistChecks bool `yaml:"whitelistChecks" json:"whitelistChecks"`
	} `yaml:"rules" json:"rules"`
	// Must be based on experiment with author and link
	Experiments []struct {
		Name             string   `yaml:"name" json:"name"`
		ExecutedBy       []string `yaml:"executedBy" json:"executedBy"`
		DateOfExperiment string   `yaml:"dateOfExperiment" json:"dateOfExperiment"`
		TruePositives    int8     `yaml:"truePositives" json:"truePositives"`
		FalsePositives   int8     `yaml:"falsePositives" json:"falsePositives"`
		Speed            int8     `yaml:"speed" json:"speed"`
		FixRate          int8     `yaml:"fixRate" json:"fixRate"`
	} `yaml:"experiments" json:"experiments"`
	Usage struct {
		Documentation struct {
			Quality string `yaml:"quality" json:"quality"`
			Link    string `yaml:"link" json:"link"`
		} `yaml:"documentation"`
		WebApplication string   `yaml:"webApplication" json:"webApplication"`
		Installation   []string `yaml:"installation" json:"installation"`
		AutoFix        bool     `yaml:"autoFix" json:"autoFix"`
		Output         []string `yaml:"output" json:"output"`
	} `yaml:"usage" json:"usage"`
	Implementation struct {
		Languages          []string `yaml:"languages" json:"languages"`
		RuleImplementation []string `yaml:"ruleImplementation" json:"ruleImplementation"`
	} `yaml:"implementation" json:"implementation"`
	/** This field is not read from the YAML files but assigned during the filtering process */
	Score float64
}

// SICAs godoc
// @Summary Filter the SICAs
// @Schemes
// @Description Filter the SICAs according the provided requirements
// @Tags        sicas
// @Produce     json
// @Accept      json
// @Param       message body    SICA      true "The requirements"
// @Success     200     {array} main.SICA "IaC Analyzers"
// @Router      /sicas [post]
func FilterSicas(c *gin.Context) {
	// Copy the global SICAs variable to be able to manipulate it
	var sic []SICA
	requirement := SICA{}

	if err := c.BindJSON(&requirement); err != nil {
		// If Body is empty return all SICAs
		if err == io.EOF {
			c.JSON(http.StatusOK, sicas)
		} else {
			c.AbortWithError(http.StatusBadRequest, err)
		}
		return
	}

	// Filter SICAs according the provided requirements
	for _, s := range sicas {
		if !supportsValues(s.ToolSupport, requirement.ToolSupport) {
			continue
		}
		if !supportsValues(s.FileSupport, requirement.FileSupport) {
			continue
		}
		if !supportsValues(s.Categories, requirement.Categories) {
			continue
		}
		if !supportsValues(s.Usage.Output, requirement.Usage.Output) {
			continue
		}
		if !supportsValues(s.Usage.Installation, requirement.Usage.Installation) {
			continue
		}
		if !supportsFeature(s.Rules.BlacklistChecks, requirement.Rules.BlacklistChecks) {
			continue
		}
		if !supportsFeature(s.Rules.BuiltInChecks, requirement.Rules.BuiltInChecks) {
			continue
		}
		if !supportsFeature(s.Rules.CustomChecks, requirement.Rules.CustomChecks) {
			continue
		}
		if !supportsFeature(s.Rules.IgnoreFindings, requirement.Rules.IgnoreFindings) {
			continue
		}
		if !supportsFeature(s.Rules.WhitelistChecks, requirement.Rules.WhitelistChecks) {
			continue
		}
		if !supportsValues(s.Implementation.RuleImplementation, requirement.Implementation.RuleImplementation) {
			continue
		}
		sic = append(sic, s)
	}

	c.JSON(http.StatusOK, sic)

}

/**
Retrieve the SICAs defined in the YAML files
*/
func retrieveSICAs() []SICA {
	var sicas []SICA
	err := filepath.Walk("./../data/sicas",
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return err
			}
			sicas = append(sicas, unmarshalSICA(path))
			return nil
		})
	if err != nil {
		log.Println(err)
	}
	return sicas
}

/**
Unmarshals the YAML representation of a SICA into the struct SICA
*/
func unmarshalSICA(path string) SICA {
	yamlFile, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Printf("Error reading YAML file: %s\n", err)
		// return
	}
	var sica SICA
	err = yaml.Unmarshal(yamlFile, &sica)
	if err != nil {
		fmt.Printf("Error parsing YAML file: %s\n", err)
	}
	return sica
}

/**
Check whether two booleans are equal.
If the second parameter is false, return true.
*/
func supportsFeature(b1 bool, b2 bool) bool {
	if !b2 {
		return true
	}
	return b1 == b2
}

/**
Check whether all values of one slica are in another slice
*/
func supportsValues(list1 []string, list2 []string) bool {
	if len(list2) == 0 {
		return true
	}
	for _, s := range list2 {
		if !stringInSlice(s, list1) {
			return false
		}
	}
	return true
}

/**
Check whether a string is in a slice
*/
func stringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}
