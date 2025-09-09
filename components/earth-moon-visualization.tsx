"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Moon, Rocket, Zap, AlertTriangle, Navigation, Clock, Fuel, Shield } from "lucide-react"
import { generateHazardResponse, type HazardAnalysis, type HazardOption } from "@/lib/ai-navigation"

interface Hazard {
  id: string
  type: "solar-flare" | "debris" | "radiation"
  position: { x: number; y: number }
  severity: "low" | "medium" | "high"
  active: boolean
}

interface EarthMoonVisualizationProps {
  onMissionComplete?: () => void
  onDecisionMade?: (decision: any) => void
}

export function EarthMoonVisualization({ onMissionComplete, onDecisionMade }: EarthMoonVisualizationProps) {
  const [missionProgress, setMissionProgress] = useState(34)
  const [spaceshipPosition, setSpaceshipPosition] = useState(34)
  const [isMoving, setIsMoving] = useState(true)
  const [hazardAnalysis, setHazardAnalysis] = useState<HazardAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedOption, setSelectedOption] = useState<HazardOption | null>(null)
  const [alternativePaths, setAlternativePaths] = useState<{ x: number; y: number }[][]>([])

  const [hazards, setHazards] = useState<Hazard[]>([
    {
      id: "1",
      type: "solar-flare",
      position: { x: 45, y: 25 },
      severity: "high",
      active: true,
    },
    {
      id: "2",
      type: "debris",
      position: { x: 70, y: 60 },
      severity: "medium",
      active: true,
    },
  ])

  useEffect(() => {
    if (!isMoving) return

    const interval = setInterval(() => {
      setSpaceshipPosition((prev) => {
        const newPos = prev + 0.15

        // Check for hazard proximity
        const nearbyHazard = hazards.find((hazard) => {
          const hazardPos = 20 + (hazard.position.x / 100) * 60
          return Math.abs(newPos - hazardPos) < 3 && hazard.active
        })

        if (nearbyHazard && !hazardAnalysis && !isAnalyzing) {
          handleHazardDetection(nearbyHazard, newPos)
        }

        if (newPos >= 95) {
          setIsMoving(false)
          return 95
        }
        return newPos
      })

      setMissionProgress((prev) => {
        const newProgress = prev + 0.15
        if (newProgress >= 100) return 100
        return newProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [isMoving, hazards, hazardAnalysis, isAnalyzing])

  const handleHazardDetection = async (hazard: Hazard, currentPos: number) => {
    setIsAnalyzing(true)
    setIsMoving(false)

    try {
      console.log("[v0] Generating AI response for hazard:", hazard.type, hazard.severity)
      const analysis = await generateHazardResponse(hazard.type, hazard.severity, currentPos, missionProgress)

      setHazardAnalysis(analysis)
      setAlternativePaths(analysis.options.map((option) => option.path))
      console.log("[v0] AI analysis complete:", analysis)
    } catch (error) {
      console.error("[v0] Failed to generate hazard response:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOptionSelect = (option: HazardOption) => {
    setSelectedOption(option)
    setHazardAnalysis(null)

    if (onDecisionMade && hazardAnalysis) {
      const decision = {
        timestamp: new Date().toLocaleTimeString(),
        hazardType: hazardAnalysis.hazardType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        actionTaken: option.title,
        fuelUsed: Math.abs(option.fuelCost),
        timeImpact: option.timeDelay,
        riskReduction: option.riskReduction,
        outcome: option.description,
      }
      onDecisionMade(decision)
    }

    // Simulate path execution
    setTimeout(() => {
      setIsMoving(true)
      setSelectedOption(null)
      setAlternativePaths([])

      // Remove the hazard that was handled
      setHazards((prev) => prev.filter((h) => h.id !== hazards[0]?.id))

      if (hazards.length <= 1 && missionProgress >= 95 && onMissionComplete) {
        onMissionComplete()
      }
    }, 2000)
  }

  const getHazardColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-400"
      default:
        return "bg-gray-400"
    }
  }

  const getHazardIcon = (type: string) => {
    switch (type) {
      case "solar-flare":
        return Zap
      case "debris":
        return AlertTriangle
      case "radiation":
        return Zap
      default:
        return AlertTriangle
    }
  }

  const createPathString = (points: { x: number; y: number }[]) => {
    return points.reduce((path, point, index) => {
      const x = 20 + (point.x / 100) * 60
      const y = point.y
      return index === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`
    }, "")
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Mission Trajectory - Live View
          {isAnalyzing && (
            <Badge variant="secondary" className="glow-purple animate-pulse">
              <Navigation className="h-3 w-3 mr-1" />
              AI Analyzing...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 rounded-lg overflow-hidden">
          {/* Enhanced starfield background */}
          <div className="absolute inset-0 starfield opacity-40"></div>

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {alternativePaths.map((path, index) => (
              <path
                key={`alt-path-${index}`}
                d={createPathString(path)}
                fill="none"
                strokeWidth="0.5"
                className={`${
                  index === 0 ? "stroke-red-400" : index === 1 ? "stroke-yellow-400" : "stroke-green-400"
                } opacity-70 animate-pulse`}
                strokeDasharray="3,3"
              />
            ))}
          </svg>

          {/* Earth */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full glow shadow-lg flex items-center justify-center">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-pulse"></div>
              <p className="text-xs text-center mt-3 text-foreground font-medium">Earth</p>
            </div>
          </div>

          {/* Moon */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2" title="Moon">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-lg flex items-center justify-center">
                <Moon className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gray-300/20 rounded-full"></div>
            </div>
          </div>

          {/* Enhanced trajectory path */}
          <div className="absolute left-20 right-20 top-1/2 transform -translate-y-1/2">
            <div className="relative h-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary h-0.5 glow"></div>
              <div
                className="absolute top-0 left-0 h-0.5 bg-chart-4 glow transition-all duration-150"
                style={{ width: `${missionProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Enhanced spaceship with status indicators */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150"
            style={{ left: `${20 + spaceshipPosition * 0.6}%` }}
          >
            <div className="relative">
              <Rocket
                className={`h-8 w-8 text-primary glow rotate-45 ${isMoving ? "animate-pulse" : "animate-bounce"}`}
              />
              <div
                className={`absolute -inset-2 bg-primary/30 rounded-full ${isMoving ? "animate-ping" : "animate-pulse"}`}
              ></div>
              {selectedOption && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded whitespace-nowrap">
                  Executing: {selectedOption.title}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced hazards with danger zones */}
          {hazards.map((hazard) => {
            const HazardIcon = getHazardIcon(hazard.type)
            return (
              <div
                key={hazard.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${hazard.position.x}%`,
                  top: `${hazard.position.y}%`,
                }}
              >
                {/* Danger zone */}
                <div
                  className={`w-16 h-16 ${getHazardColor(hazard.severity)} rounded-full opacity-20 animate-pulse`}
                ></div>

                {/* Hazard center */}
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 ${getHazardColor(hazard.severity)} rounded-full glow`}
                >
                  <HazardIcon className="h-4 w-4 text-white m-1" />
                </div>
              </div>
            )
          })}

          {/* Mission status overlay */}
          <div className="absolute top-4 left-4 space-y-2">
            <Badge variant="secondary" className="glow-purple">
              <Rocket className="h-3 w-3 mr-1" />
              {isMoving ? "Mission Active" : "Hazard Response"}
            </Badge>
            <div className="text-xs text-foreground bg-card/80 rounded px-2 py-1">
              Distance: {(384400 * (missionProgress / 100)).toFixed(0)} km
            </div>
          </div>

          <div className="absolute top-4 right-4 text-xs text-foreground bg-card/80 rounded px-2 py-1">
            Velocity: {isMoving ? "11.2 km/s" : "0 km/s"}
          </div>
        </div>

        {hazardAnalysis && (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">
                {hazardAnalysis.severity.toUpperCase()} {hazardAnalysis.hazardType.replace("-", " ").toUpperCase()}{" "}
                DETECTED
              </h3>
              <Badge variant="destructive">Risk: {hazardAnalysis.immediateRisk}%</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              <strong>AI Recommendation:</strong> {hazardAnalysis.recommendation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hazardAnalysis.options.map((option, index) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    index === 0
                      ? "border-red-400 bg-red-950/20"
                      : index === 1
                        ? "border-yellow-400 bg-yellow-950/20"
                        : "border-green-400 bg-green-950/20"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {index === 0 ? (
                        <Shield className="h-4 w-4 text-red-400" />
                      ) : index === 1 ? (
                        <Navigation className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <Rocket className="h-4 w-4 text-green-400" />
                      )}
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{option.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        <span>
                          {option.fuelCost > 0 ? "+" : ""}
                          {option.fuelCost}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {option.timeDelay > 0 ? "+" : ""}
                          {option.timeDelay}h
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Risk Reduction</span>
                        <span className="text-green-400">{option.riskReduction}%</span>
                      </div>
                      <Progress value={option.riskReduction} className="h-1" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>AI Confidence</span>
                        <span>{option.confidence}%</span>
                      </div>
                      <Progress value={option.confidence} className="h-1" />
                    </div>

                    <Button
                      size="sm"
                      className={`w-full ${
                        index === 0
                          ? "bg-red-600 hover:bg-red-700"
                          : index === 1
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Execute Maneuver
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Mission Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Mission Progress</span>
            <span>{missionProgress.toFixed(1)}%</span>
          </div>
          <Progress value={missionProgress} className="h-3" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">ETA</p>
            <p className="text-sm font-bold text-primary">2d 14h</p>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">Hazards</p>
            <p className="text-sm font-bold text-secondary">{hazards.length} Active</p>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">Course</p>
            <p className="text-sm font-bold text-chart-4">{selectedOption ? "Adjusting" : "Nominal"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
