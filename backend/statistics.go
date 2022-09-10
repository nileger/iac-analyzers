package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

/** Statistics about all SICAs */
type Stats struct {
	ToolNumbers struct {
		TotalNumberOfSicas      int
		NumberOfThirdPartyTools int
		NumberOfMetaTools       int
		NumberOfBuiltInTools    int
	}
	General struct {
		License         map[string]int8
		WebApplications map[string]string
		Autofix         int8
	}
	ThirdPartyTools struct {
		ToolSupport        map[string]int8
		FileSupport        map[string]int8
		DevelopmentSupport struct {
			IDE map[string]int8
			CI  map[string]int8
			VC  map[string]int8
		}
		Rules struct {
			BuiltInChecks   int8
			CustomChecks    int8
			BlacklistChecks int8
			IgnoreFindings  int8
			WhitelistChecks int8
		}
		Implementation struct {
			ProgrammingLanguages map[string]int8
			RuleLanguages        map[string]int8
		}
		InstallationMethods map[string]int8
		Output              map[string]int8
		CommunityBacked     int8
		Stars               int64
		AverageStars        float32
		Categories          map[string]int8
	}
	MetaTools struct {
		IncludedTools map[string]int8
	}
	BuiltInTools struct {
		ToolSupport map[string]int8
	}
}

/**
Calculate Statistics about the SICAs
*/
// Statistics godoc
// @Summary Returns statistics about the SICAs
// @Schemes
// @Description Returns statistics about the SICAs, e.g., the number of tools that support Terraform
// @Tags        statistics
// @Produce     json
// @Success     200 {object} main.Stats "Statistics"
// @Router      /sicas/stats [get]
func GetStats(c *gin.Context) {
	var stats Stats

	// Initialize Maps
	stats.ThirdPartyTools.Implementation.ProgrammingLanguages = make(map[string]int8)
	stats.ThirdPartyTools.InstallationMethods = make(map[string]int8)
	stats.ThirdPartyTools.Implementation.RuleLanguages = make(map[string]int8)
	stats.ThirdPartyTools.ToolSupport = make(map[string]int8)
	stats.ThirdPartyTools.FileSupport = make(map[string]int8)
	stats.ThirdPartyTools.Output = make(map[string]int8)
	stats.ThirdPartyTools.Categories = make(map[string]int8)
	stats.ThirdPartyTools.DevelopmentSupport.IDE = make(map[string]int8)
	stats.ThirdPartyTools.DevelopmentSupport.CI = make(map[string]int8)
	stats.ThirdPartyTools.DevelopmentSupport.VC = make(map[string]int8)
	stats.General.License = make(map[string]int8)
	stats.General.WebApplications = make(map[string]string)
	stats.MetaTools.IncludedTools = make(map[string]int8)
	stats.BuiltInTools.ToolSupport = make(map[string]int8)

	// Total number of tools
	stats.ToolNumbers.TotalNumberOfSicas = len(sicas)

	for _, s := range sicas {
		// General
		if s.Repository.License != "" {
			if _, exists := stats.General.License[s.Repository.License]; exists {
				stats.General.License[s.Repository.License] = stats.General.License[s.Repository.License] + 1
			} else {
				stats.General.License[s.Repository.License] = 1
			}
		}

		if s.Usage.WebApplication != "" {
			stats.General.WebApplications[s.Name] = s.Usage.WebApplication
		}

		// Meta Tool
		if len(s.IncludedTools) > 0 {
			stats.ToolNumbers.NumberOfMetaTools++
			// Implementation Languages
			for _, i := range s.IncludedTools {
				if _, exists := stats.MetaTools.IncludedTools[i]; exists {
					stats.MetaTools.IncludedTools[i] = stats.MetaTools.IncludedTools[i] + 1
				} else {
					stats.MetaTools.IncludedTools[i] = 1
				}
			}
			continue
		}
		// Built-In
		if s.BuiltIn {
			stats.ToolNumbers.NumberOfBuiltInTools++
			// Tool Support
			for _, i := range s.ToolSupport {
				if _, exists := stats.BuiltInTools.ToolSupport[i]; exists {
					stats.BuiltInTools.ToolSupport[i] = stats.BuiltInTools.ToolSupport[i] + 1
				} else {
					stats.BuiltInTools.ToolSupport[i] = 1
				}
			}
			continue
		}

		// Number of tools
		stats.ToolNumbers.NumberOfThirdPartyTools++

		// Implementation Languages
		for _, l := range s.Implementation.Languages {
			if _, exists := stats.ThirdPartyTools.Implementation.ProgrammingLanguages[l]; exists {
				stats.ThirdPartyTools.Implementation.ProgrammingLanguages[l] = stats.ThirdPartyTools.Implementation.ProgrammingLanguages[l] + 1
			} else {
				stats.ThirdPartyTools.Implementation.ProgrammingLanguages[l] = 1
			}
		}
		// Installation Methods
		for _, i := range s.Usage.Installation {
			if _, exists := stats.ThirdPartyTools.InstallationMethods[i]; exists {
				stats.ThirdPartyTools.InstallationMethods[i] = stats.ThirdPartyTools.InstallationMethods[i] + 1
			} else {
				stats.ThirdPartyTools.InstallationMethods[i] = 1
			}
		}
		// Rule Languages
		for _, r := range s.Implementation.RuleImplementation {
			if _, exists := stats.ThirdPartyTools.Implementation.RuleLanguages[r]; exists {
				stats.ThirdPartyTools.Implementation.RuleLanguages[r] = stats.ThirdPartyTools.Implementation.RuleLanguages[r] + 1
			} else {
				stats.ThirdPartyTools.Implementation.RuleLanguages[r] = 1
			}
		}
		// Tool Support
		for _, t := range s.ToolSupport {
			if _, exists := stats.ThirdPartyTools.ToolSupport[t]; exists {
				stats.ThirdPartyTools.ToolSupport[t] = stats.ThirdPartyTools.ToolSupport[t] + 1
			} else {
				stats.ThirdPartyTools.ToolSupport[t] = 1
			}
		}
		// File Support
		for _, f := range s.FileSupport {
			if _, exists := stats.ThirdPartyTools.FileSupport[f]; exists {
				stats.ThirdPartyTools.FileSupport[f] = stats.ThirdPartyTools.FileSupport[f] + 1
			} else {
				stats.ThirdPartyTools.FileSupport[f] = 1
			}
		}
		// AutoFix
		if s.Usage.AutoFix {
			stats.General.Autofix++
		}
		// Rules
		if s.Rules.BuiltInChecks {
			stats.ThirdPartyTools.Rules.BuiltInChecks++
		}
		if s.Rules.CustomChecks {
			stats.ThirdPartyTools.Rules.CustomChecks++
		}
		if s.Rules.BlacklistChecks {
			stats.ThirdPartyTools.Rules.BlacklistChecks++
		}
		if s.Rules.IgnoreFindings {
			stats.ThirdPartyTools.Rules.IgnoreFindings++
		}
		if s.Rules.WhitelistChecks {
			stats.ThirdPartyTools.Rules.WhitelistChecks++
		}
		// Output
		for _, o := range s.Usage.Output {
			if _, exists := stats.ThirdPartyTools.Output[o]; exists {
				stats.ThirdPartyTools.Output[o] = stats.ThirdPartyTools.Output[o] + 1
			} else {
				stats.ThirdPartyTools.Output[o] = 1
			}
		}
		// Community Backed
		if s.Repository.Backers == "community" {
			stats.ThirdPartyTools.CommunityBacked++
		}
		// Stars
		stats.ThirdPartyTools.Stars = stats.ThirdPartyTools.Stars + s.Repository.Stars
		// Categories
		for _, c := range s.Categories {
			if _, exists := stats.ThirdPartyTools.Categories[c]; exists {
				stats.ThirdPartyTools.Categories[c] = stats.ThirdPartyTools.Categories[c] + 1
			} else {
				stats.ThirdPartyTools.Categories[c] = 1
			}
		}
		// Development Support
		for _, c := range s.DevelopmentSupport.CI {
			if _, exists := stats.ThirdPartyTools.DevelopmentSupport.CI[c]; exists {
				stats.ThirdPartyTools.DevelopmentSupport.CI[c] = stats.ThirdPartyTools.DevelopmentSupport.CI[c] + 1
			} else {
				stats.ThirdPartyTools.DevelopmentSupport.CI[c] = 1
			}
		}
		for _, c := range s.DevelopmentSupport.IDE {
			if _, exists := stats.ThirdPartyTools.DevelopmentSupport.IDE[c]; exists {
				stats.ThirdPartyTools.DevelopmentSupport.IDE[c] = stats.ThirdPartyTools.DevelopmentSupport.IDE[c] + 1
			} else {
				stats.ThirdPartyTools.DevelopmentSupport.IDE[c] = 1
			}
		}
		for _, c := range s.DevelopmentSupport.VC {
			if _, exists := stats.ThirdPartyTools.DevelopmentSupport.VC[c]; exists {
				stats.ThirdPartyTools.DevelopmentSupport.VC[c] = stats.ThirdPartyTools.DevelopmentSupport.VC[c] + 1
			} else {
				stats.ThirdPartyTools.DevelopmentSupport.VC[c] = 1
			}
		}
	}
	stats.ThirdPartyTools.AverageStars = float32(stats.ThirdPartyTools.Stars) / float32(stats.ToolNumbers.NumberOfThirdPartyTools)
	c.JSON(http.StatusOK,
		stats,
	)
}
