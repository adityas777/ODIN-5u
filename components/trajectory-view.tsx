"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Moon, Rocket, AlertTriangle, Navigation, Route, TrendingUp, Square } from "lucide-react"

interface TrajectoryHazard {
  id: string
  type: "solar-flare" | "debris" | "radiation" | "meteor" | "asteroid" | "plasma-storm"
  position: { x: number; y: number }
  severity: "low" | "medium" | "high"
  riskLevel: number
  description: string
  timeDetected: string
  animationPhase: number
  velocity?: { x: number; y: number }
  size?: number
}

interface AlternativePath {
  id: string
  type: "safe" | "risky" | "nominal"
  points: { x: number; y: number }[]
  fuelCost: number
  timeDelay: number
  riskScore: number
}

interface SpaceshipState {
  position: { x: number; y: number }
  rotation: number
  pathProgress: number
  isMoving: boolean
  emergencyStop: boolean
}

export function TrajectoryView() {
  const [selectedPath, setSelectedPath] = useState<string>("nominal")
  const [hoveredHazard, setHoveredHazard] = useState<string | null>(null)
  const [spaceship, setSpaceship] = useState<SpaceshipState>({
    position: { x: 10, y: 50 },
    rotation: 45,
    pathProgress: 0,
    isMoving: true,
    emergencyStop: false,
  })
  const [hazards, setHazards] = useState<TrajectoryHazard[]>([
    {
      id: "1",
      type: "solar-flare",
      position: { x: 30, y: 25 },
      severity: "high",
      riskLevel: 85,
      description: "Major solar flare with high radiation levels",
      timeDetected: "14:23:15",
      animationPhase: 0,
    },
    {
      id: "2",
      type: "debris",
      position: { x: 55, y: 45 },
      severity: "medium",
      riskLevel: 60,
      description: "Debris field from satellite collision",
      timeDetected: "14:18:42",
      animationPhase: 0,
    },
  ])
  const [showEmergencyMessage, setShowEmergencyMessage] = useState(false)
  const animationRef = useRef<number>()

  const alternativePaths: AlternativePath[] = [
    {
      id: "nominal",
      type: "nominal",
      points: [
        { x: 10, y: 50 },
        { x: 25, y: 48 },
        { x: 40, y: 45 },
        { x: 55, y: 47 },
        { x: 70, y: 49 },
        { x: 85, y: 50 },
        { x: 90, y: 50 },
      ],
      fuelCost: 100,
      timeDelay: 0,
      riskScore: 75,
    },
    {
      id: "safe",
      type: "safe",
      points: [
        { x: 10, y: 50 },
        { x: 20, y: 60 },
        { x: 35, y: 65 },
        { x: 50, y: 68 },
        { x: 65, y: 65 },
        { x: 80, y: 58 },
        { x: 90, y: 50 },
      ],
      fuelCost: 115,
      timeDelay: 4.2,
      riskScore: 25,
    },
    {
      id: "risky",
      type: "risky",
      points: [
        { x: 10, y: 50 },
        { x: 25, y: 35 },
        { x: 40, y: 28 },
        { x: 55, y: 25 },
        { x: 70, y: 30 },
        { x: 85, y: 45 },
        { x: 90, y: 50 },
      ],
      fuelCost: 85,
      timeDelay: -2.1,
      riskScore: 95,
    },
  ]

  useEffect(() => {
    const animate = () => {
      if (spaceship.isMoving && !spaceship.emergencyStop) {
        setSpaceship((prev) => {
          const currentPath = alternativePaths.find((p) => p.id === selectedPath)
          if (!currentPath) return prev

          let newProgress = prev.pathProgress + 0.003

          if (newProgress >= 1) newProgress = 0

          const totalSegments = currentPath.points.length - 1
          const segmentIndex = Math.floor(newProgress * totalSegments)
          const segmentProgress = (newProgress * totalSegments) % 1

          const t = segmentProgress
          const t2 = t * t
          const t3 = t2 * t

          const currentPoint = currentPath.points[segmentIndex]
          const nextPoint = currentPath.points[Math.min(segmentIndex + 1, currentPath.points.length - 1)]
          const prevPoint = currentPath.points[Math.max(segmentIndex - 1, 0)]
          const afterNextPoint = currentPath.points[Math.min(segmentIndex + 2, currentPath.points.length - 1)]

          const newPosition = {
            x:
              0.5 *
              (2 * currentPoint.x +
                (-prevPoint.x + nextPoint.x) * t +
                (2 * prevPoint.x - 5 * currentPoint.x + 4 * nextPoint.x - afterNextPoint.x) * t2 +
                (-prevPoint.x + 3 * currentPoint.x - 3 * nextPoint.x + afterNextPoint.x) * t3),
            y:
              0.5 *
              (2 * currentPoint.y +
                (-prevPoint.y + nextPoint.y) * t +
                (2 * prevPoint.y - 5 * currentPoint.y + 4 * nextPoint.y - afterNextPoint.y) * t2 +
                (-prevPoint.y + 3 * currentPoint.y - 3 * nextPoint.y + afterNextPoint.y) * t3),
          }

          const rotation = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * (180 / Math.PI)

          return {
            ...prev,
            position: newPosition,
            rotation: rotation + 90,
            pathProgress: newProgress,
          }
        })
      }

      setHazards(
        (prev) =>
          prev
            .map((hazard) => {
              let newPosition = hazard.position

              if ((hazard.type === "meteor" || hazard.type === "asteroid") && hazard.velocity) {
                newPosition = {
                  x: hazard.position.x + hazard.velocity.x,
                  y: hazard.position.y + hazard.velocity.y,
                }

                if (newPosition.x < -10 || newPosition.x > 110 || newPosition.y < -10 || newPosition.y > 110) {
                  return null
                }
              }

              return {
                ...hazard,
                position: newPosition,
                animationPhase: (hazard.animationPhase + 0.1) % (Math.PI * 4),
              }
            })
            .filter(Boolean) as TrajectoryHazard[],
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [selectedPath, spaceship.isMoving, spaceship.emergencyStop])

  useEffect(() => {
    const generateRandomHazard = () => {
      const hazardTypes: TrajectoryHazard["type"][] = [
        "meteor",
        "solar-flare",
        "debris",
        "radiation",
        "asteroid",
        "plasma-storm",
      ]
      const severities: TrajectoryHazard["severity"][] = ["low", "medium", "high"]

      const hazardType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)]

      let position = { x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 }
      let velocity = undefined
      const size = Math.random() * 3 + 2

      if (hazardType === "meteor" || hazardType === "asteroid") {
        const side = Math.floor(Math.random() * 4)
        switch (side) {
          case 0: // Top
            position = { x: Math.random() * 100, y: -5 }
            velocity = { x: (Math.random() - 0.5) * 0.5, y: Math.random() * 0.3 + 0.2 }
            break
          case 1: // Right
            position = { x: 105, y: Math.random() * 100 }
            velocity = { x: -(Math.random() * 0.3 + 0.2), y: (Math.random() - 0.5) * 0.5 }
            break
          case 2: // Bottom
            position = { x: Math.random() * 100, y: 105 }
            velocity = { x: (Math.random() - 0.5) * 0.5, y: -(Math.random() * 0.3 + 0.2) }
            break
          case 3: // Left
            position = { x: -5, y: Math.random() * 100 }
            velocity = { x: Math.random() * 0.3 + 0.2, y: (Math.random() - 0.5) * 0.5 }
            break
        }
      }

      const newHazard: TrajectoryHazard = {
        id: Date.now().toString() + Math.random(),
        type: hazardType,
        position,
        velocity,
        size,
        severity: severities[Math.floor(Math.random() * severities.length)],
        riskLevel: Math.floor(Math.random() * 100),
        description: `${hazardType.replace("-", " ")} detected in trajectory path`,
        timeDetected: new Date().toLocaleTimeString(),
        animationPhase: 0,
      }

      setHazards((prev) => [...prev, newHazard])

      const cleanupTime = hazardType === "meteor" || hazardType === "asteroid" ? 15000 : 12000
      setTimeout(() => {
        setHazards((prev) => prev.filter((h) => h.id !== newHazard.id))
      }, cleanupTime)
    }

    const interval = setInterval(generateRandomHazard, 5000)
    return () => clearInterval(interval)
  }, [])

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

  const getPathColor = (type: string) => {
    switch (type) {
      case "nominal":
        return "stroke-green-400"
      case "safe":
        return "stroke-blue-400"
      case "risky":
        return "stroke-red-400"
      default:
        return "stroke-gray-400"
    }
  }

  const createPathString = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return ""

    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]

      if (next) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.5
        const cp1y = prev.y + (curr.y - prev.y) * 0.5
        const cp2x = curr.x - (next.x - curr.x) * 0.3
        const cp2y = curr.y - (next.y - curr.y) * 0.3
        path += ` Q ${cp1x} ${cp1y} ${curr.x} ${curr.y}`
      } else {
        path += ` L ${curr.x} ${curr.y}`
      }
    }
    return path
  }

  const renderHazardAnimation = (hazard: TrajectoryHazard) => {
    const baseStyle = {
      left: `${hazard.position.x}%`,
      top: `${hazard.position.y}%`,
    }

    switch (hazard.type) {
      case "meteor":
        return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={baseStyle}>
            <div className="relative">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-gradient-to-r from-orange-500 via-red-500 to-transparent rounded-full opacity-70"
                  style={{
                    width: `${20 - i * 2}px`,
                    height: `${2 - i * 0.2}px`,
                    transform: `rotate(${(hazard.velocity?.x || 0) > 0 ? 45 : -45}deg) translateX(-${10 + i * 3}px)`,
                    animation: `meteor-trail ${0.3 + i * 0.1}s infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
              <div
                className="relative w-4 h-4 bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-lg"
                style={{
                  animation: "meteor-glow 0.5s infinite alternate",
                  boxShadow: "0 0 20px rgba(255, 165, 0, 0.8)",
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                      transform: `rotate(${hazard.animationPhase * 50 + i * 60}deg) translateX(${8 + Math.sin(hazard.animationPhase + i) * 3}px)`,
                      opacity: Math.sin(hazard.animationPhase + i) * 0.5 + 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case "asteroid":
        return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={baseStyle}>
            <div className="relative">
              <div
                className="w-6 h-6 bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 rounded-full shadow-lg"
                style={{
                  transform: `rotate(${hazard.animationPhase * 30}deg)`,
                  clipPath: "polygon(20% 0%, 80% 10%, 100% 60%, 75% 100%, 25% 90%, 0% 40%)",
                }}
              />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-500 rounded-full opacity-60"
                  style={{
                    transform: `rotate(${(hazard.velocity?.x || 0) > 0 ? 45 : -45}deg) translateX(-${15 + i * 5}px)`,
                    animation: `debris-float ${1 + i * 0.2}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        )

      case "solar-flare":
        return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={baseStyle}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gradient-radial from-yellow-300 via-orange-500 to-transparent rounded-full opacity-40"
                style={{
                  width: `${30 + Math.sin(hazard.animationPhase + i) * 20 + i * 10}px`,
                  height: `${30 + Math.sin(hazard.animationPhase + i) * 20 + i * 10}px`,
                  transform: "translate(-50%, -50%)",
                  animation: `solar-pulse ${2 + i * 0.5}s infinite ease-in-out`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
            <div className="relative w-6 h-6 bg-gradient-to-br from-white via-yellow-300 to-orange-500 rounded-full shadow-lg">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"
                  style={{
                    transform: `rotate(${i * 45 + hazard.animationPhase * 20}deg) translateX(10px)`,
                    opacity: Math.sin(hazard.animationPhase + i) * 0.3 + 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )

      case "plasma-storm":
        return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={baseStyle}>
            <div className="relative">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-gradient-to-r from-purple-400 via-pink-500 to-transparent rounded-full opacity-60"
                  style={{
                    width: `${15 + Math.sin(hazard.animationPhase + i * 0.5) * 8}px`,
                    height: `2px`,
                    transform: `rotate(${i * 30 + hazard.animationPhase * 40}deg) translateX(${8 + i}px)`,
                    animation: `plasma-arc ${0.8 + i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
              <div className="w-4 h-4 bg-gradient-to-br from-purple-300 via-pink-400 to-purple-600 rounded-full animate-pulse" />
            </div>
          </div>
        )

      case "debris":
        return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={baseStyle}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gray-400 rounded-full opacity-70"
                style={{
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  transform: `rotate(${hazard.animationPhase * 60 + i * 45}deg) translateX(${6 + i * 2}px)`,
                  animation: `debris-spin ${1.5 + i * 0.3}s infinite linear`,
                }}
              />
            ))}
            <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full" />
          </div>
        )

      default:
        return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={baseStyle}>
            <div className={`w-8 h-8 ${getHazardColor(hazard.severity)} rounded-full opacity-60 animate-pulse`} />
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 ${getHazardColor(hazard.severity)} rounded-full`}
            >
              <AlertTriangle className="h-2 w-2 text-white m-0.5" />
            </div>
          </div>
        )
    }
  }

  const handleEmergencyStop = () => {
    setSpaceship((prev) => ({ ...prev, emergencyStop: true, isMoving: false }))
    setShowEmergencyMessage(true)

    setTimeout(() => {
      setShowEmergencyMessage(false)
      setSpaceship((prev) => ({ ...prev, emergencyStop: false, isMoving: true }))
    }, 3000)
  }

  const handlePathSelection = (pathId: string) => {
    setSelectedPath(pathId)
    setSpaceship((prev) => ({ ...prev, pathProgress: prev.pathProgress }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Trajectory Analysis</h2>
          <p className="text-muted-foreground">Real-time path optimization and hazard mapping</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="glow-purple">
            <Navigation className="h-4 w-4 mr-1" />
            AI Navigation Active
          </Badge>
          <Badge variant="outline">
            <TrendingUp className="h-4 w-4 mr-1" />
            {hazards.length} Hazards Detected
          </Badge>
          <Button variant="destructive" size="sm" onClick={handleEmergencyStop} disabled={spaceship.emergencyStop}>
            <Square className="h-4 w-4 mr-1" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {showEmergencyMessage && (
        <Card className="bg-red-950 border-red-500 animate-pulse">
          <CardContent className="p-4">
            <p className="text-red-200 text-center font-bold">
              🚨 EMERGENCY STOP ACTIVATED - Hazard cleared – resuming journey...
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Mission Trajectory Map - Live View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-indigo-950 via-purple-950 to-black rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              {[...Array(150)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-twinkle"
                  style={{
                    width: `${Math.random() * 2 + 0.5}px`,
                    height: `${Math.random() * 2 + 0.5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    opacity: Math.random() * 0.8 + 0.2,
                  }}
                />
              ))}
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {alternativePaths.map((path) => (
                <g key={path.id}>
                  <path
                    d={createPathString(path.points)}
                    fill="none"
                    strokeWidth={selectedPath === path.id ? "1.2" : "0.6"}
                    className={`${getPathColor(path.type)} transition-all duration-500`}
                    style={{
                      strokeDasharray: path.type === "nominal" ? "none" : "3,3",
                      filter: selectedPath === path.id ? "url(#glow)" : "none",
                      opacity: selectedPath === path.id ? 1 : 0.4,
                    }}
                  />
                </g>
              ))}
            </svg>

            <div className="absolute left-4 top-1/2 transform -translate-y-1/2" title="Earth">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full glow shadow-lg flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2" title="Moon">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-lg flex items-center justify-center">
                <Moon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                left: `${spaceship.position.x}%`,
                top: `${spaceship.position.y}%`,
                transform: `translate(-50%, -50%) rotate(${spaceship.rotation}deg)`,
              }}
            >
              {spaceship.isMoving && !spaceship.emergencyStop && (
                <>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-6 bg-gradient-to-t from-blue-400 via-cyan-300 to-transparent rounded-full animate-pulse" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div
                      className="w-1 h-4 bg-gradient-to-t from-white via-blue-200 to-transparent rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </>
              )}

              {spaceship.emergencyStop && (
                <>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-red-500 rounded-full animate-pulse -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute inset-0 w-8 h-8 border-2 border-yellow-400 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2" />
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-4 bg-red-400 rounded-full"
                      style={{
                        transform: `rotate(${i * 60}deg) translateY(-20px)`,
                        animation: "emergency-flash 0.5s infinite alternate",
                      }}
                    />
                  ))}
                </>
              )}

              <Rocket className={`h-6 w-6 text-primary relative z-10 ${spaceship.isMoving ? "animate-pulse" : ""}`} />
            </div>

            {hazards.map((hazard) => (
              <div key={hazard.id}>
                {renderHazardAnimation(hazard)}

                {hoveredHazard === hazard.id && (
                  <div
                    className="absolute bg-card border border-border rounded-lg p-3 text-xs whitespace-nowrap z-10 shadow-lg"
                    style={{
                      left: `${hazard.position.x}%`,
                      top: `${hazard.position.y - 15}%`,
                      transform: "translateX(-50%)",
                    }}
                    onMouseEnter={() => setHoveredHazard(hazard.id)}
                    onMouseLeave={() => setHoveredHazard(null)}
                  >
                    <p className="font-medium capitalize text-foreground">{hazard.type.replace("-", " ")}</p>
                    <p className="text-muted-foreground">{hazard.description}</p>
                    <p className="text-destructive">Risk Level: {hazard.riskLevel}%</p>
                    <p className="text-muted-foreground">Detected: {hazard.timeDetected}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {alternativePaths.map((path) => (
          <Card
            key={path.id}
            className={`bg-card border-border cursor-pointer transition-all duration-300 ${
              selectedPath === path.id ? "ring-2 ring-primary shadow-lg shadow-primary/20" : "hover:border-primary/50"
            }`}
            onClick={() => handlePathSelection(path.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Route className={`h-4 w-4 ${getPathColor(path.type).replace("stroke-", "text-")}`} />
                {path.type === "nominal" ? "Nominal Path" : path.type === "safe" ? "Safe Alternative" : "Fast Route"}
                {selectedPath === path.id && (
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Fuel Cost</p>
                  <p className="font-bold">{path.fuelCost}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Δ</p>
                  <p
                    className={`font-bold ${path.timeDelay > 0 ? "text-destructive" : path.timeDelay < 0 ? "text-green-400" : "text-foreground"}`}
                  >
                    {path.timeDelay > 0 ? "+" : ""}
                    {path.timeDelay}h
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span
                    className={`font-bold ${
                      path.riskScore > 70
                        ? "text-destructive"
                        : path.riskScore > 40
                          ? "text-yellow-500"
                          : "text-green-400"
                    }`}
                  >
                    {path.riskScore}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      path.riskScore > 70 ? "bg-destructive" : path.riskScore > 40 ? "bg-yellow-500" : "bg-green-400"
                    }`}
                    style={{ width: `${path.riskScore}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
