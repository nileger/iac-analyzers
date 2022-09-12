package main

import (
	"time"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/go-co-op/gocron"

	docs "iac-analyzers/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

/** Global Variables*/
var sicas []SICA

// @title         IaC Analyzers Guide
// @version       1.0
// @description   The API for the IaC Analyzers Guide
// @host          iac-analyzers.dev
// @BasePath      /api/
// @contact.name  Nils Leger
// @contact.url   https://twitter.com/NilsLeger
// @contact.email nils.leger@iubh.de
// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html
// @schemes       http https
func main() {
	// Init SICAs
	sicas = retrieveSICAs()

	r := gin.Default()
	// Serve Frontend
	r.Use(static.Serve("/", static.LocalFile("./../frontend", true)))
	// OpenAPI Configuration
	docs.SwaggerInfo.BasePath = "/api"
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// API
	api := r.Group("/api")
	{
		api.GET("/health", Health)
		api.POST("/sicas", FilterSicas)
		api.GET("/sicas/options", GetOptions)
		api.GET("/sicas/stats", GetStats)
	}

	// Run a cron job every night to update the GitHub stats
	s := gocron.NewScheduler(time.UTC)
	s.Every(1).Day().At("00:00").Do(UpdateStats)
	s.StartAsync()

	r.Run(":8080") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
