"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Clock,
  Fuel,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Rocket,
  RefreshCw,
} from "lucide-react"

interface MissionPlan {
  id: string
  name: string
  type: "nominal" | "alternative-a" | "alternative-b"
  description: string
  metrics: {
    travelTime: number // hours
    fuelUsage: number // percentage
    crewSafety: number // score out of 100
    radiationExposure: number // percentage of safe limit
    successProbability: number // percentage
    riskScore: number // out of 100, lower is better
  }
  advantages: string[]
  disadvantages: string[]
  aiRecommendation: "recommended" | "acceptable" | "not-recommended"
  lastUpdated: string
}

export function MissionComparisonDashboard() {
  const [selectedPlan, setSelectedPlan] = useState<string>("nominal")
  const [comparisonMode, setComparisonMode] = useState<"overview" | "detailed">("overview")

  const missionPlans: MissionPlan[] = [
    {
      id: "nominal",
      name: "Nominal Plan",
      type: "nominal",
      description: "Original mission trajectory with standard safety protocols and fuel efficiency optimization.",
      metrics: {
        travelTime: 72.5,
        fuelUsage: 87.2,
        crewSafety: 85,
        radiationExposure: 45,
        successProbability: 92,
        riskScore: 35,
      },
      advantages: [
        "Well-tested trajectory",
        "Balanced fuel consumption",
        "Predictable timeline",
        "Standard safety protocols",
      ],
      disadvantages: ["Higher radiation exposure", "Limited hazard avoidance", "No real-time optimization"],
      aiRecommendation: "acceptable",
      lastUpdated: "2024-03-15T14:20:00Z",
    },
    {
      id: "alternative-a",
      name: "Alternative A",
      type: "alternative-a",
      description: "Safety-optimized route with enhanced hazard avoidance and reduced radiation exposure.",
      metrics: {
        travelTime: 76.8,
        fuelUsage: 94.1,
        crewSafety: 98,
        radiationExposure: 18,
        successProbability: 96,
        riskScore: 15,
      },
      advantages: [
        "Maximum crew safety",
        "Minimal radiation exposure",
        "Advanced hazard avoidance",
        "High success probability",
      ],
      disadvantages: ["Increased fuel consumption", "Longer mission duration", "Complex trajectory adjustments"],
      aiRecommendation: "recommended",
      lastUpdated: "2024-03-15T14:23:15Z",
    },
    {
      id: "alternative-b",
      name: "Alternative B",
      type: "alternative-b",
      description: "Fast-track route prioritizing speed and fuel efficiency with acceptable risk levels.",
      metrics: {
        travelTime: 68.2,
        fuelUsage: 79.5,
        crewSafety: 78,
        radiationExposure: 62,
        successProbability: 88,
        riskScore: 55,
      },
      advantages: [
        "Shortest mission duration",
        "Lowest fuel consumption",
        "Direct trajectory path",
        "Quick lunar arrival",
      ],
      disadvantages: [
        "Higher radiation exposure",
        "Reduced safety margins",
        "Limited hazard response time",
        "Increased crew risk",
      ],
      aiRecommendation: "not-recommended",
      lastUpdated: "2024-03-15T14:18:42Z",
    },
  ]

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "recommended":
        return "text-chart-4"
      case "acceptable":
        return "text-yellow-500"
      case "not-recommended":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "recommended":
        return "bg-chart-4 text-white"
      case "acceptable":
        return "bg-yellow-500 text-white"
      case "not-recommended":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getMetricColor = (value: number, type: "higher-better" | "lower-better") => {
    if (type === "higher-better") {
      return value >= 90 ? "text-chart-4" : value >= 70 ? "text-yellow-500" : "text-destructive"
    } else {
      return value <= 30 ? "text-chart-4" : value <= 60 ? "text-yellow-500" : "text-destructive"
    }
  }

  const getBestPlan = () => {
    // Simple scoring algorithm - can be made more sophisticated
    return missionPlans.reduce((best, current) => {
      const bestScore =
        best.metrics.crewSafety * 0.4 +
        best.metrics.successProbability * 0.3 +
        (100 - best.metrics.riskScore) * 0.2 +
        (100 - best.metrics.fuelUsage) * 0.1

      const currentScore =
        current.metrics.crewSafety * 0.4 +
        current.metrics.successProbability * 0.3 +
        (100 - current.metrics.riskScore) * 0.2 +
        (100 - current.metrics.fuelUsage) * 0.1

      return currentScore > bestScore ? current : best
    })
  }

  const bestPlan = getBestPlan()

  const formatTime = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = Math.floor(hours % 24)
    const minutes = Math.floor((hours % 1) * 60)
    return `${days}d ${remainingHours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Mission Comparison</h2>
          <p className="text-muted-foreground">Analyze and compare mission trajectory options</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getRecommendationBadge(bestPlan.aiRecommendation)} variant="secondary">
            <Target className="h-4 w-4 mr-1" />
            Best: {bestPlan.name}
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">View Mode:</span>
            <div className="flex gap-2">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "detailed", label: "Detailed Analysis", icon: TrendingUp },
              ].map((mode) => {
                const Icon = mode.icon
                return (
                  <Button
                    key={mode.id}
                    variant={comparisonMode === mode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setComparisonMode(mode.id as "overview" | "detailed")}
                    className={comparisonMode === mode.id ? "glow" : ""}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {mode.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Plans Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {missionPlans.map((plan) => {
          const isBest = plan.id === bestPlan.id
          const isSelected = selectedPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`bg-card border-2 cursor-pointer transition-all duration-300 ${
                isBest
                  ? "border-chart-4 glow ring-2 ring-chart-4/50"
                  : isSelected
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {isBest && <CheckCircle className="h-5 w-5 text-chart-4" />}
                    <Badge className={getRecommendationBadge(plan.aiRecommendation)}>
                      {plan.aiRecommendation.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded p-3 text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">Travel Time</div>
                    <div className="text-sm font-bold text-foreground">{formatTime(plan.metrics.travelTime)}</div>
                  </div>

                  <div className="bg-muted/50 rounded p-3 text-center">
                    <Fuel className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                    <div className="text-xs text-muted-foreground">Fuel Usage</div>
                    <div className="text-sm font-bold text-yellow-500">{plan.metrics.fuelUsage.toFixed(1)}%</div>
                  </div>

                  <div className="bg-muted/50 rounded p-3 text-center">
                    <Shield className="h-4 w-4 mx-auto mb-1 text-chart-4" />
                    <div className="text-xs text-muted-foreground">Crew Safety</div>
                    <div className={`text-sm font-bold ${getMetricColor(plan.metrics.crewSafety, "higher-better")}`}>
                      {plan.metrics.crewSafety}/100
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded p-3 text-center">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-secondary" />
                    <div className="text-xs text-muted-foreground">Radiation</div>
                    <div
                      className={`text-sm font-bold ${getMetricColor(plan.metrics.radiationExposure, "lower-better")}`}
                    >
                      {plan.metrics.radiationExposure}%
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Success Probability</span>
                      <span className={getMetricColor(plan.metrics.successProbability, "higher-better")}>
                        {plan.metrics.successProbability}%
                      </span>
                    </div>
                    <Progress value={plan.metrics.successProbability} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className={getMetricColor(plan.metrics.riskScore, "lower-better")}>
                        {plan.metrics.riskScore}/100
                      </span>
                    </div>
                    <Progress value={100 - plan.metrics.riskScore} className="h-2" />
                  </div>
                </div>

                {/* Detailed Analysis (if selected and in detailed mode) */}
                {isSelected && comparisonMode === "detailed" && (
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div>
                      <h4 className="text-sm font-medium text-chart-4 mb-2">Advantages</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {plan.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-chart-4 mt-0.5 flex-shrink-0" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-destructive mb-2">Disadvantages</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {plan.disadvantages.map((disadvantage, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                            {disadvantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className={`w-full ${isBest ? "glow" : ""}`}
                  variant={isBest ? "default" : "outline"}
                  disabled={plan.aiRecommendation === "not-recommended"}
                >
                  <Rocket className="h-4 w-4 mr-1" />
                  {isBest ? "Execute Best Plan" : "Select This Plan"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Comparison Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Fastest Route</div>
              <div className="text-lg font-bold text-primary">
                {
                  missionPlans.reduce((fastest, plan) =>
                    plan.metrics.travelTime < fastest.metrics.travelTime ? plan : fastest,
                  ).name
                }
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTime(Math.min(...missionPlans.map((p) => p.metrics.travelTime)))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Most Fuel Efficient</div>
              <div className="text-lg font-bold text-yellow-500">
                {
                  missionPlans.reduce((efficient, plan) =>
                    plan.metrics.fuelUsage < efficient.metrics.fuelUsage ? plan : efficient,
                  ).name
                }
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.min(...missionPlans.map((p) => p.metrics.fuelUsage)).toFixed(1)}% fuel
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Safest Option</div>
              <div className="text-lg font-bold text-chart-4">
                {
                  missionPlans.reduce((safest, plan) =>
                    plan.metrics.crewSafety > safest.metrics.crewSafety ? plan : safest,
                  ).name
                }
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.max(...missionPlans.map((p) => p.metrics.crewSafety))}/100 safety
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">AI Recommended</div>
              <div className="text-lg font-bold text-chart-4">{bestPlan.name}</div>
              <div className="text-xs text-muted-foreground">Optimal balance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
