"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  AlertTriangle,
  Shield,
  Navigation,
  Settings,
  Activity,
  Clock,
  Brain,
  Target,
  Rocket,
} from "lucide-react"

interface SimulationHazard {
  id: string
  type: "solar-flare" | "debris" | "radiation" | "gravitational-anomaly"
  severity: "low" | "medium" | "high"
  position: { x: number; y: number }
  timeRemaining: number
  active: boolean
}

interface SimulationLog {
  id: string
  timestamp: string
  event: string
  aiResponse: string
  impact: string
}

export function SimulationControls() {
  const [isRunning, setIsRunning] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState([1])
  const [currentHazards, setCurrentHazards] = useState<SimulationHazard[]>([])
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([])
  const [missionProgress, setMissionProgress] = useState(34)
  const [fuelLevel, setFuelLevel] = useState(87)
  const [crewSafety, setCrewSafety] = useState(98)
  const [systemStatus, setSystemStatus] = useState<"nominal" | "alert" | "critical">("nominal")

  const hazardTypes = [
    {
      type: "solar-flare" as const,
      name: "Solar Flare",
      icon: Zap,
      color: "text-yellow-500",
      description: "High-energy solar radiation burst",
    },
    {
      type: "debris" as const,
      name: "Space Debris",
      icon: AlertTriangle,
      color: "text-destructive",
      description: "Collision risk from space objects",
    },
    {
      type: "radiation" as const,
      name: "Radiation Zone",
      icon: Shield,
      color: "text-secondary",
      description: "Elevated radiation exposure area",
    },
    {
      type: "gravitational-anomaly" as const,
      name: "Gravitational Anomaly",
      icon: Navigation,
      color: "text-primary",
      description: "Unexpected gravitational disturbance",
    },
  ]

  const aiResponses = {
    "solar-flare": [
      "Executing emergency course correction to avoid radiation zone",
      "Activating enhanced electromagnetic shielding protocols",
      "Calculating optimal trajectory to minimize exposure time",
    ],
    debris: [
      "Performing precision navigation through debris field",
      "Initiating emergency stop and debris analysis",
      "Adjusting trajectory to avoid collision risk",
    ],
    radiation: [
      "Enhancing radiation shielding and monitoring crew exposure",
      "Calculating alternative route with reduced radiation",
      "Maintaining course with increased protective measures",
    ],
    "gravitational-anomaly": [
      "Recalculating trajectory with updated gravitational model",
      "Compensating for gravitational perturbation effects",
      "Adjusting propulsion to counteract anomalous forces",
    ],
  }

  const generateRandomHazard = (): SimulationHazard => {
    const hazardType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)]
    const severities: ("low" | "medium" | "high")[] = ["low", "medium", "high"]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    return {
      id: `hazard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: hazardType.type,
      severity,
      position: {
        x: Math.random() * 80 + 10, // 10-90% of trajectory
        y: Math.random() * 60 + 20, // 20-80% of height
      },
      timeRemaining: Math.random() * 30 + 10, // 10-40 seconds
      active: true,
    }
  }

  const simulateHazard = (hazardType?: SimulationHazard["type"]) => {
    const hazard = generateRandomHazard()
    if (hazardType) {
      hazard.type = hazardType
    }

    setCurrentHazards((prev) => [...prev, hazard])

    // Generate AI response
    const responses = aiResponses[hazard.type]
    const aiResponse = responses[Math.floor(Math.random() * responses.length)]

    const newLog: SimulationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      event: `${hazard.severity.toUpperCase()} ${hazard.type.replace("-", " ").toUpperCase()} detected`,
      aiResponse,
      impact: generateImpactDescription(hazard),
    }

    setSimulationLogs((prev) => [newLog, ...prev.slice(0, 9)]) // Keep last 10 logs

    // Update system metrics based on hazard
    updateSystemMetrics(hazard)

    // Set system status
    if (hazard.severity === "high") {
      setSystemStatus("critical")
    } else if (hazard.severity === "medium") {
      setSystemStatus("alert")
    }

    // Auto-resolve hazard after time
    setTimeout(() => {
      setCurrentHazards((prev) => prev.filter((h) => h.id !== hazard.id))
      if (currentHazards.length <= 1) {
        setSystemStatus("nominal")
      }
    }, hazard.timeRemaining * 1000)
  }

  const generateImpactDescription = (hazard: SimulationHazard): string => {
    const impacts = {
      "solar-flare": ["+8% fuel, +2.1h mission time", "+12% fuel, +4.2h mission time", "+15% fuel, +6.8h mission time"],
      debris: ["+2% fuel, +0.5h mission time", "+5% fuel, +1.2h mission time", "+8% fuel, +2.8h mission time"],
      radiation: ["Enhanced shielding active", "+3% fuel, enhanced protection", "+6% fuel, maximum shielding"],
      "gravitational-anomaly": [
        "+1% fuel, minor adjustment",
        "+4% fuel, trajectory recalc",
        "+7% fuel, major correction",
      ],
    }

    const severityIndex = hazard.severity === "low" ? 0 : hazard.severity === "medium" ? 1 : 2
    return impacts[hazard.type][severityIndex]
  }

  const updateSystemMetrics = (hazard: SimulationHazard) => {
    const fuelImpact = hazard.severity === "low" ? 2 : hazard.severity === "medium" ? 5 : 8
    const safetyImpact = hazard.severity === "low" ? 1 : hazard.severity === "medium" ? 3 : 5

    setFuelLevel((prev) => Math.max(0, prev - fuelImpact))
    setCrewSafety((prev) => Math.max(0, prev - safetyImpact))
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentHazards([])
    setSimulationLogs([])
    setMissionProgress(34)
    setFuelLevel(87)
    setCrewSafety(98)
    setSystemStatus("nominal")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nominal":
        return "text-chart-4"
      case "alert":
        return "text-yellow-500"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nominal":
        return "bg-chart-4 text-white"
      case "alert":
        return "bg-yellow-500 text-white"
      case "critical":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Auto-progress simulation when running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setMissionProgress((prev) => {
        const newProgress = prev + 0.1 * simulationSpeed[0]
        return newProgress >= 100 ? 0 : newProgress
      })

      // Random hazard generation during simulation
      if (Math.random() < 0.02 * simulationSpeed[0]) {
        // 2% chance per tick
        simulateHazard()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, simulationSpeed])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Simulation Controls</h2>
          <p className="text-muted-foreground">Test AI responses to various mission scenarios</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusBadge(systemStatus)}>
            <Activity className="h-4 w-4 mr-1" />
            {systemStatus.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            <Target className="h-4 w-4 mr-1" />
            {currentHazards.length} Active Hazards
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Play/Pause Controls */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 ${isRunning ? "glow" : ""}`}
                variant={isRunning ? "default" : "outline"}
              >
                {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isRunning ? "Pause" : "Start"} Simulation
              </Button>
              <Button onClick={resetSimulation} variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Simulation Speed</span>
                <span className="text-foreground">{simulationSpeed[0]}x</span>
              </div>
              <Slider
                value={simulationSpeed}
                onValueChange={setSimulationSpeed}
                max={5}
                min={0.5}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Manual Hazard Triggers */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Manual Hazard Simulation</h4>
              <div className="grid grid-cols-2 gap-2">
                {hazardTypes.map((hazard) => {
                  const Icon = hazard.icon
                  return (
                    <Button
                      key={hazard.type}
                      onClick={() => simulateHazard(hazard.type)}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Icon className={`h-4 w-4 mr-2 ${hazard.color}`} />
                      {hazard.name}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Mission Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Mission Progress</span>
                <span className="text-foreground">{missionProgress.toFixed(1)}%</span>
              </div>
              <Progress value={missionProgress} className="h-3" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded p-3 text-center">
                <div className="text-xs text-muted-foreground">Fuel Level</div>
                <div
                  className={`text-lg font-bold ${fuelLevel > 70 ? "text-chart-4" : fuelLevel > 40 ? "text-yellow-500" : "text-destructive"}`}
                >
                  {fuelLevel}%
                </div>
              </div>
              <div className="bg-muted/50 rounded p-3 text-center">
                <div className="text-xs text-muted-foreground">Crew Safety</div>
                <div
                  className={`text-lg font-bold ${crewSafety > 90 ? "text-chart-4" : crewSafety > 70 ? "text-yellow-500" : "text-destructive"}`}
                >
                  {crewSafety}%
                </div>
              </div>
            </div>

            {/* Active Hazards */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Active Hazards</h4>
              {currentHazards.length === 0 ? (
                <p className="text-xs text-muted-foreground">No active hazards detected</p>
              ) : (
                <div className="space-y-2">
                  {currentHazards.slice(0, 3).map((hazard) => {
                    const hazardInfo = hazardTypes.find((h) => h.type === hazard.type)
                    const Icon = hazardInfo?.icon || AlertTriangle
                    return (
                      <div key={hazard.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-3 w-3 ${hazardInfo?.color}`} />
                          <span className="text-foreground">
                            {hazard.severity.toUpperCase()} {hazardInfo?.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{Math.ceil(hazard.timeRemaining)}s</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live AI Response Log */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Live AI Response Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {simulationLogs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No simulation events yet. Start the simulation or trigger a hazard to see AI responses.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {simulationLogs.map((log) => (
                <div key={log.id} className="bg-muted/30 rounded-lg p-3 border-l-4 border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                    <Badge variant="outline" className="text-xs">
                      AI Response
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{log.event}</p>
                    <p className="text-sm text-primary">{log.aiResponse}</p>
                    <p className="text-xs text-muted-foreground">Impact: {log.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
