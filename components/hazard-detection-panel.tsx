"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap, Satellite, Shield, Clock, TrendingUp, Navigation, Fuel } from "lucide-react"

interface Hazard {
  id: string
  type: "solar-flare" | "debris" | "radiation" | "gravitational-anomaly"
  severity: "low" | "medium" | "high"
  riskLevel: number
  detectedAt: string
  location: string
  description: string
  aiRecommendation: {
    action: string
    impact: string
    confidence: number
  }
  status: "active" | "monitoring" | "resolved"
}

export function HazardDetectionPanel() {
  const [selectedHazard, setSelectedHazard] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const hazards: Hazard[] = [
    {
      id: "1",
      type: "solar-flare",
      severity: "high",
      riskLevel: 85,
      detectedAt: "2024-03-15T14:23:15Z",
      location: "30% trajectory point",
      description:
        "Major X-class solar flare detected with high radiation output. Peak intensity expected in 2.3 hours.",
      aiRecommendation: {
        action: "Execute emergency course correction to avoid radiation zone",
        impact: "+12% fuel consumption, +4.2h mission time",
        confidence: 94,
      },
      status: "active",
    },
    {
      id: "2",
      type: "debris",
      severity: "medium",
      riskLevel: 60,
      detectedAt: "2024-03-15T14:18:42Z",
      location: "55% trajectory point",
      description: "Debris field from recent satellite collision. 47 trackable objects detected in flight path.",
      aiRecommendation: {
        action: "Minor trajectory adjustment to avoid debris cluster",
        impact: "+3% fuel consumption, +0.8h mission time",
        confidence: 87,
      },
      status: "monitoring",
    },
    {
      id: "3",
      type: "radiation",
      severity: "low",
      riskLevel: 25,
      detectedAt: "2024-03-15T14:15:08Z",
      location: "75% trajectory point",
      description: "Elevated radiation levels detected near lunar approach. Within acceptable crew exposure limits.",
      aiRecommendation: {
        action: "Continue on current trajectory with enhanced shielding",
        impact: "No fuel impact, monitor crew exposure",
        confidence: 76,
      },
      status: "monitoring",
    },
    {
      id: "4",
      type: "gravitational-anomaly",
      severity: "medium",
      riskLevel: 45,
      detectedAt: "2024-03-15T14:12:33Z",
      location: "40% trajectory point",
      description: "Unexpected gravitational perturbation detected. Likely caused by uncharted asteroid.",
      aiRecommendation: {
        action: "Recalculate trajectory with updated gravitational model",
        impact: "+1% fuel consumption, precise timing required",
        confidence: 82,
      },
      status: "resolved",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-destructive"
      case "medium":
        return "border-yellow-500"
      case "low":
        return "border-blue-500"
      default:
        return "border-gray-500"
    }
  }

  const getHazardIcon = (type: string) => {
    switch (type) {
      case "solar-flare":
        return Zap
      case "debris":
        return Satellite
      case "radiation":
        return Shield
      case "gravitational-anomaly":
        return TrendingUp
      default:
        return AlertTriangle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-destructive"
      case "monitoring":
        return "text-yellow-500"
      case "resolved":
        return "text-chart-4"
      default:
        return "text-muted-foreground"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const filteredHazards = filterSeverity === "all" ? hazards : hazards.filter((h) => h.severity === filterSeverity)

  const activeHazards = hazards.filter((h) => h.status === "active").length
  const monitoringHazards = hazards.filter((h) => h.status === "monitoring").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Hazard Detection</h2>
          <p className="text-muted-foreground">Real-time threat analysis and AI recommendations</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="glow">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {activeHazards} Active Threats
          </Badge>
          <Badge variant="secondary">
            <Clock className="h-4 w-4 mr-1" />
            {monitoringHazards} Monitoring
          </Badge>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Filter by Severity:</span>
            <div className="flex gap-2">
              {["all", "high", "medium", "low"].map((severity) => (
                <Button
                  key={severity}
                  variant={filterSeverity === severity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterSeverity(severity)}
                  className={filterSeverity === severity ? "glow" : ""}
                >
                  {severity === "all" ? "All" : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hazard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHazards.map((hazard) => {
          const HazardIcon = getHazardIcon(hazard.type)
          const isSelected = selectedHazard === hazard.id

          return (
            <Card
              key={hazard.id}
              className={`bg-card border-2 cursor-pointer transition-all duration-300 ${getSeverityBorderColor(
                hazard.severity,
              )} ${isSelected ? "ring-2 ring-primary glow" : "hover:border-primary/50"}`}
              onClick={() => setSelectedHazard(isSelected ? null : hazard.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HazardIcon className="h-5 w-5 text-primary" />
                    {hazard.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(hazard.severity)}>{hazard.severity.toUpperCase()}</Badge>
                    <Badge variant="outline" className={getStatusColor(hazard.status)}>
                      {hazard.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Hazard Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span
                      className={`font-bold ${
                        hazard.riskLevel > 70
                          ? "text-destructive"
                          : hazard.riskLevel > 40
                            ? "text-yellow-500"
                            : "text-chart-4"
                      }`}
                    >
                      {hazard.riskLevel}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Detected:</span>
                    <span className="text-foreground font-mono">{formatTime(hazard.detectedAt)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{hazard.location}</span>
                  </div>
                </div>

                {/* Risk Level Bar */}
                <div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        hazard.riskLevel > 70
                          ? "bg-destructive"
                          : hazard.riskLevel > 40
                            ? "bg-yellow-500"
                            : "bg-chart-4"
                      }`}
                      style={{ width: `${hazard.riskLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{hazard.description}</p>

                {/* AI Recommendation */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">AI Recommendation</span>
                    <Badge variant="outline" className="text-xs">
                      {hazard.aiRecommendation.confidence}% confidence
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground font-medium">{hazard.aiRecommendation.action}</p>

                  <p className="text-xs text-muted-foreground">Impact: {hazard.aiRecommendation.impact}</p>
                </div>

                {/* Action Buttons */}
                {hazard.status === "active" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 glow">
                      <Navigation className="h-4 w-4 mr-1" />
                      Execute Recommendation
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Clock className="h-4 w-4 mr-1" />
                      Monitor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">Total Threats</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{hazards.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Fuel className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Fuel Impact</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">+16%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Time Delay</span>
            </div>
            <p className="text-2xl font-bold text-primary">+5.0h</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
