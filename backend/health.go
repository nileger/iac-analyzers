package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @BasePath /api

// HealthCheck godoc
// @Summary     Return the health status of the application
// @Description Health Endpoint
// @Tags        health
// @Produce     json
// @Success     200 {} jsonresult.JSONResult{status=string} "status"
// @Router      /health [get]
func Health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"status": "UP",
	})
}
