"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EarthMoonVisualization } from "@/components/earth-moon-visualization"
import { TrajectoryView } from "@/components/trajectory-view"
import { HazardDetectionPanel } from "@/components/hazard-detection-panel"
import { AIDecisionLogs } from "@/components/ai-decision-logs"
import { MissionComparisonDashboard } from "@/components/mission-comparison-dashboard"
import { SimulationControls } from "@/components/simulation-controls"
import { MissionAnalysisComponent } from "@/components/mission-analysis"
import type { MissionDecision } from "@/lib/ai-navigation"
import { Trophy } from "lucide-react"
import {
  Rocket,
  Globe,
  AlertTriangle,
  Activity,
  Settings,
  FileText,
  Zap,
  Shield,
  Fuel,
  Clock,
  Users,
} from "lucide-react"
import { WelcomeScreen } from "@/components/welcome-screen"

type ViewType = "dashboard" | "trajectory" | "hazards" | "logs" | "comparison" | "simulation"

export default function OdinDashboard() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [showMissionAnalysis, setShowMissionAnalysis] = useState(false)
  const [tripCompleted, setTripCompleted] = useState(false)
  const [missionProgress, setMissionProgress] = useState(0)

  const [missionMetrics, setMissionMetrics] = useState({
    fuelRemaining: 87,
    travelTime: { days: 2, hours: 14 },
    crewSafety: 98,
    radiationLevel: "Low",
  })

  const [crewStatus, setCrewStatus] = useState([
    { name: "Commander", status: "Healthy" as "Healthy" | "Stressed" | "Critical" },
    { name: "Pilot", status: "Healthy" as "Healthy" | "Stressed" | "Critical" },
    { name: "Engineer", status: "Healthy" as "Healthy" | "Stressed" | "Critical" },
  ])

  const [recentAlerts, setRecentAlerts] = useState([
    { time: "12:34", message: "Mission initialized", type: "info" as "info" | "warning" | "danger" },
    { time: "12:35", message: "All systems nominal", type: "info" as "info" | "warning" | "danger" },
  ])

  const [missionDecisions, setMissionDecisions] = useState<MissionDecision[]>([])

  const handleMissionComplete = () => {
    setTripCompleted(true)
    setMissionProgress(100)
  }

  const updateMissionMetrics = (decision: MissionDecision) => {
    setMissionMetrics((prev) => {
      const newMetrics = { ...prev }

      // Update fuel based on decision
      newMetrics.fuelRemaining = Math.max(0, prev.fuelRemaining - decision.fuelUsed)

      let timeImpactHours = decision.timeImpact
      if (decision.hazardType === "Debris Field" && decision.actionTaken.includes("Emergency")) {
        timeImpactHours += 1.5 // Emergency maneuvers take longer
      } else if (decision.hazardType === "Solar Flare" && decision.actionTaken.includes("Shield")) {
        timeImpactHours += 0.5 // Shielding procedures add time
      }

      const totalHours = prev.travelTime.days * 24 + prev.travelTime.hours + timeImpactHours
      newMetrics.travelTime = {
        days: Math.floor(totalHours / 24),
        hours: Math.floor(totalHours % 24),
      }

      let safetyChange = 0
      if (decision.riskReduction > 80) {
        safetyChange = 3 // Excellent decisions boost morale
      } else if (decision.riskReduction > 60) {
        safetyChange = 1 // Good decisions maintain safety
      } else if (decision.riskReduction > 30) {
        safetyChange = -2 // Poor decisions stress crew
      } else {
        safetyChange = -5 // Very poor decisions endanger crew
      }

      // Additional safety impacts based on hazard type
      if (decision.hazardType === "Solar Flare" && decision.riskReduction < 50) {
        safetyChange -= 3 // Radiation exposure is serious
      } else if (decision.hazardType === "Gravitational Anomaly" && decision.riskReduction < 40) {
        safetyChange -= 4 // Gravitational stress is dangerous
      }

      newMetrics.crewSafety = Math.min(100, Math.max(0, prev.crewSafety + safetyChange))

      if (decision.hazardType === "Solar Flare") {
        if (decision.riskReduction > 75) {
          newMetrics.radiationLevel = "Low"
        } else if (decision.riskReduction > 45) {
          newMetrics.radiationLevel = "Medium"
        } else {
          newMetrics.radiationLevel = "High"
        }
      } else if (decision.hazardType === "Radiation Zone") {
        newMetrics.radiationLevel = decision.riskReduction > 60 ? "Medium" : "High"
      } else if (decision.hazardType === "Debris Field" && decision.riskReduction < 30) {
        newMetrics.radiationLevel = "Medium" // Debris can damage shielding
      }

      return newMetrics
    })

    setCrewStatus((prev) => {
      return prev.map((crew) => {
        let newStatus = crew.status

        if (missionMetrics.crewSafety < 60) {
          newStatus = "Critical"
        } else if (missionMetrics.crewSafety < 80) {
          newStatus = "Stressed"
        } else {
          newStatus = "Healthy"
        }

        // Specific crew member impacts based on hazard type
        if (decision.hazardType === "Solar Flare" && crew.name === "Engineer" && decision.riskReduction < 50) {
          newStatus = "Stressed" // Engineer handles radiation shielding
        } else if (decision.hazardType === "Debris Field" && crew.name === "Pilot" && decision.riskReduction < 40) {
          newStatus = "Stressed" // Pilot handles navigation stress
        } else if (
          decision.hazardType === "Gravitational Anomaly" &&
          crew.name === "Commander" &&
          decision.riskReduction < 30
        ) {
          newStatus = "Critical" // Commander makes critical decisions
        }

        return { ...crew, status: newStatus }
      })
    })

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })

    let alertMessage = ""
    let alertType: "info" | "warning" | "danger" = "info"

    if (decision.riskReduction > 80) {
      alertMessage = `Excellent ${decision.actionTaken} - Risk minimized`
      alertType = "info"
    } else if (decision.riskReduction > 60) {
      alertMessage = `${decision.actionTaken} successful - Moderate risk reduction`
      alertType = "info"
    } else if (decision.riskReduction > 30) {
      alertMessage = `${decision.actionTaken} partially effective - Elevated risk`
      alertType = "warning"
    } else {
      alertMessage = `${decision.actionTaken} insufficient - High risk remains`
      alertType = "danger"
    }

    // Add fuel and time impact alerts
    if (decision.fuelUsed > 15) {
      setRecentAlerts((prev) => [
        { time: currentTime, message: `High fuel consumption: ${decision.fuelUsed}% used`, type: "warning" },
        ...prev.slice(0, 4),
      ])
    }

    if (decision.timeImpact > 2) {
      setRecentAlerts((prev) => [
        { time: currentTime, message: `Significant delay: +${decision.timeImpact}h`, type: "warning" },
        ...prev.slice(0, 4),
      ])
    }

    setRecentAlerts((prev) => [{ time: currentTime, message: alertMessage, type: alertType }, ...prev.slice(0, 4)])
  }

  const addMissionDecision = (decision: MissionDecision) => {
    setMissionDecisions((prev) => [...prev, decision])
    updateMissionMetrics(decision)
  }

  const navigationItems = [
    { id: "dashboard", label: "Mission Overview", icon: Rocket },
    { id: "trajectory", label: "Trajectory View", icon: Globe },
    { id: "hazards", label: "Hazard Detection", icon: AlertTriangle },
    { id: "logs", label: "AI Decision Logs", icon: FileText },
    { id: "comparison", label: "Mission Comparison", icon: Activity },
    { id: "simulation", label: "Simulation Controls", icon: Settings },
  ]

  const missionStats = [
    {
      label: "Fuel Remaining",
      value: `${missionMetrics.fuelRemaining}%`,
      icon: Fuel,
      color:
        missionMetrics.fuelRemaining > 70
          ? "text-chart-4"
          : missionMetrics.fuelRemaining > 40
            ? "text-yellow-500"
            : "text-destructive",
    },
    {
      label: "Travel Time",
      value: `${missionMetrics.travelTime.days}d ${missionMetrics.travelTime.hours}h`,
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Crew Safety",
      value: `${missionMetrics.crewSafety}%`,
      icon: Shield,
      color:
        missionMetrics.crewSafety > 90
          ? "text-chart-4"
          : missionMetrics.crewSafety > 70
            ? "text-yellow-500"
            : "text-destructive",
    },
    {
      label: "Radiation Level",
      value: missionMetrics.radiationLevel,
      icon: Zap,
      color:
        missionMetrics.radiationLevel === "Low"
          ? "text-chart-4"
          : missionMetrics.radiationLevel === "Medium"
            ? "text-yellow-500"
            : "text-destructive",
    },
  ]

  const getCrewStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "text-chart-4"
      case "Stressed":
        return "text-yellow-500"
      case "Critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-primary"
      case "warning":
        return "text-yellow-500"
      case "danger":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const handleLaunchComplete = () => {
    setShowWelcome(false)
  }

  if (showWelcome) {
    return <WelcomeScreen onLaunchComplete={handleLaunchComplete} />
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border p-4 galaxy-card">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary glow" />
            ODIN
          </h1>
          <p className="text-sm text-muted-foreground">Space Navigation AI</p>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                className={`w-full justify-start gap-3 btn-glow ${currentView === item.id ? "glow" : ""}`}
                onClick={() => setCurrentView(item.id as ViewType)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-sidebar-border">
          <Button
            onClick={() => setShowMissionAnalysis(true)}
            className="w-full btn-glow glow-green"
            variant="outline"
            disabled={!tripCompleted}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Mission Analysis
          </Button>
          {!tripCompleted && (
            <p className="text-xs text-muted-foreground mt-2 text-center">Complete Earth-to-Moon trip to unlock</p>
          )}

          {!tripCompleted && (
            <Button onClick={handleMissionComplete} className="w-full mt-2 btn-glow" variant="secondary" size="sm">
              Simulate Trip Complete
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Mission Overview</h2>
                <p className="text-muted-foreground">Earth to Moon Navigation Status</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="glow-purple">
                  <Activity className="h-4 w-4 mr-1" />
                  AI Active
                </Badge>
                {tripCompleted && (
                  <Badge variant="default" className="glow-green">
                    <Trophy className="h-4 w-4 mr-1" />
                    Trip Complete
                  </Badge>
                )}
              </div>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {missionStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="galaxy-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Earth-Moon Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EarthMoonVisualization onMissionComplete={handleMissionComplete} onDecisionMade={addMissionDecision} />
              </div>

              {/* Live Mission Stats */}
              <Card className="galaxy-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Crew Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {crewStatus.map((crew, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">{crew.name}</span>
                        <Badge
                          variant={
                            crew.status === "Healthy"
                              ? "secondary"
                              : crew.status === "Stressed"
                                ? "outline"
                                : "destructive"
                          }
                          className={`text-xs ${getCrewStatusColor(crew.status)}`}
                        >
                          {crew.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-2">Recent Alerts</h4>
                    <div className="space-y-2">
                      {recentAlerts.map((alert, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          <span className={getAlertColor(alert.type)}>{alert.time}</span> - {alert.message}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* All View Implementations */}
        {currentView === "trajectory" && <TrajectoryView />}
        {currentView === "hazards" && <HazardDetectionPanel />}
        {currentView === "logs" && <AIDecisionLogs />}
        {currentView === "comparison" && <MissionComparisonDashboard />}
        {currentView === "simulation" && <SimulationControls />}
      </div>

      {showMissionAnalysis && (
        <MissionAnalysisComponent
          decisions={missionDecisions}
          missionDuration={missionMetrics.travelTime.days * 24 + missionMetrics.travelTime.hours}
          finalFuelLevel={missionMetrics.fuelRemaining}
          onClose={() => setShowMissionAnalysis(false)}
        />
      )}
    </div>
  )
}
