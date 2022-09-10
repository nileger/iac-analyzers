package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

/**
Gets the Options From the SICAs
*/
// Options godoc
// @Summary     Returns all supported options
// @Description Returns all supported options, e.g., all the supported IaC tools
// @Tags        sicas
// @Produce     json
// @Success     200 {object} main.SICA "Options"
// @Router      /sicas/options [get]
func GetOptions(c *gin.Context) {
	var sica SICA

	// Maps with all values
	var toolSupport [][]string
	var fileSupport [][]string
	var categories [][]string
	var ides [][]string
	var ci [][]string
	var vc [][]string
	var installation [][]string
	var output [][]string
	var ruleImplementation [][]string

	// Assign the SICA values to the maps
	for _, s := range sicas {
		toolSupport = append(toolSupport, s.ToolSupport)
		fileSupport = append(fileSupport, s.FileSupport)
		categories = append(categories, s.Categories)
		ides = append(ides, s.DevelopmentSupport.IDE)
		ci = append(ci, s.DevelopmentSupport.CI)
		vc = append(vc, s.DevelopmentSupport.VC)
		installation = append(installation, s.Usage.Installation)
		output = append(output, s.Usage.Output)
		ruleImplementation = append(ruleImplementation, s.Implementation.RuleImplementation)
	}

	// Remove duplicates
	sica.ToolSupport = removeDuplicates(toolSupport...)
	sica.FileSupport = removeDuplicates(fileSupport...)
	sica.Categories = removeDuplicates(categories...)
	sica.DevelopmentSupport.IDE = removeDuplicates(ides...)
	sica.DevelopmentSupport.CI = removeDuplicates(ci...)
	sica.DevelopmentSupport.VC = removeDuplicates(vc...)
	sica.Usage.Installation = removeDuplicates(installation...)
	sica.Usage.Output = removeDuplicates(output...)
	sica.Implementation.RuleImplementation = removeDuplicates(ruleImplementation...)

	c.JSON(http.StatusOK, sica)

}

/**
Merge multiple string arrays and remove duplicates
Source: https://www.code-paste.com/golang-merge-slices-unique-remove-duplicates/
*/
func removeDuplicates(stringSlices ...[]string) []string {
	uniqueMap := map[string]bool{}

	for _, stringSlice := range stringSlices {
		for _, str := range stringSlice {
			uniqueMap[str] = true
		}
	}

	// Create a slice with the capacity of unique items
	// This capacity make appending flow much more efficient
	result := make([]string, 0, len(uniqueMap))

	for key := range uniqueMap {
		result = append(result, key)
	}

	return result
}
