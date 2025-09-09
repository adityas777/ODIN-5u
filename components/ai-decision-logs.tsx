"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Zap,
  Navigation,
  Fuel,
  Shield,
} from "lucide-react"

interface DecisionLog {
  id: string
  timestamp: string
  hazardType: "solar-flare" | "debris" | "radiation" | "gravitational-anomaly"
  hazardSeverity: "low" | "medium" | "high"
  actionTaken: string
  result: "success" | "partial" | "failed"
  explanation: string
  metrics: {
    fuelUsed: number
    timeDelay: number
    riskReduction: number
    confidence: number
  }
  aiReasoning: string
}

export function AIDecisionLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterResult, setFilterResult] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

  const decisionLogs: DecisionLog[] = [
    {
      id: "1",
      timestamp: "2024-03-15T14:23:15Z",
      hazardType: "solar-flare",
      hazardSeverity: "high",
      actionTaken: "Emergency course correction executed",
      result: "success",
      explanation:
        "Detected X-class solar flare with 85% risk level. AI calculated optimal avoidance trajectory to minimize radiation exposure while conserving fuel.",
      metrics: {
        fuelUsed: 12.3,
        timeDelay: 4.2,
        riskReduction: 78,
        confidence: 94,
      },
      aiReasoning:
        "High-priority threat required immediate action. Alternative paths analyzed: direct avoidance (chosen), shield enhancement (insufficient protection), acceleration through zone (crew safety risk). Selected path optimizes crew safety with acceptable fuel cost.",
    },
    {
      id: "2",
      timestamp: "2024-03-15T14:18:42Z",
      hazardType: "debris",
      hazardSeverity: "medium",
      actionTaken: "Minor trajectory adjustment applied",
      result: "success",
      explanation:
        "Debris field detected with 47 trackable objects. AI performed micro-corrections to thread through safe corridor between debris clusters.",
      metrics: {
        fuelUsed: 3.1,
        timeDelay: 0.8,
        riskReduction: 65,
        confidence: 87,
      },
      aiReasoning:
        "Medium-risk debris field allowed for precision navigation rather than major course change. Calculated safe passage corridor with 87% confidence. Minimal fuel expenditure justified by maintaining mission timeline.",
    },
    {
      id: "3",
      timestamp: "2024-03-15T14:15:08Z",
      hazardType: "radiation",
      hazardSeverity: "low",
      actionTaken: "Enhanced shielding protocol activated",
      result: "success",
      explanation:
        "Low-level radiation zone detected near lunar approach. AI activated enhanced electromagnetic shielding instead of course correction to maintain optimal landing trajectory.",
      metrics: {
        fuelUsed: 0.0,
        timeDelay: 0.0,
        riskReduction: 45,
        confidence: 76,
      },
      aiReasoning:
        "Low-risk radiation within acceptable crew exposure limits. Course correction would compromise lunar approach angle. Enhanced shielding provides adequate protection while preserving mission parameters.",
    },
    {
      id: "4",
      timestamp: "2024-03-15T14:12:33Z",
      hazardType: "gravitational-anomaly",
      hazardSeverity: "medium",
      actionTaken: "Trajectory recalculation with gravitational compensation",
      result: "partial",
      explanation:
        "Unexpected gravitational perturbation from uncharted asteroid required real-time trajectory adjustment. AI compensated for gravitational influence but with reduced precision.",
      metrics: {
        fuelUsed: 1.2,
        timeDelay: 0.3,
        riskReduction: 52,
        confidence: 82,
      },
      aiReasoning:
        "Gravitational anomaly detected outside mission parameters. Insufficient data for perfect compensation, but calculated adjustment prevents trajectory drift. Monitoring for additional corrections needed.",
    },
    {
      id: "5",
      timestamp: "2024-03-15T14:08:17Z",
      hazardType: "debris",
      hazardSeverity: "high",
      actionTaken: "Emergency stop and debris analysis",
      result: "failed",
      explanation:
        "Large debris field initially detected as high-risk. AI initiated emergency stop protocol, but subsequent analysis revealed debris was non-threatening space dust.",
      metrics: {
        fuelUsed: 8.7,
        timeDelay: 2.1,
        riskReduction: -15,
        confidence: 45,
      },
      aiReasoning:
        "Initial sensor data indicated high-density debris field. Low confidence reading triggered conservative emergency protocol. Post-analysis revealed sensor calibration error. Learning algorithm updated to prevent similar false positives.",
    },
  ]

  const getResultColor = (result: string) => {
    switch (result) {
      case "success":
        return "text-chart-4"
      case "partial":
        return "text-yellow-500"
      case "failed":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success":
        return CheckCircle
      case "partial":
        return AlertTriangle
      case "failed":
        return XCircle
      default:
        return Clock
    }
  }

  const getHazardIcon = (type: string) => {
    switch (type) {
      case "solar-flare":
        return Zap
      case "debris":
        return AlertTriangle
      case "radiation":
        return Shield
      case "gravitational-anomaly":
        return Navigation
      default:
        return AlertTriangle
    }
  }

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      time: date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    }
  }

  const filteredLogs = decisionLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.actionTaken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hazardType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterResult === "all" || log.result === filterResult

    return matchesSearch && matchesFilter
  })

  const successRate = Math.round(
    (decisionLogs.filter((log) => log.result === "success").length / decisionLogs.length) * 100,
  )
  const totalFuelUsed = decisionLogs.reduce((sum, log) => sum + log.metrics.fuelUsed, 0)
  const avgConfidence = Math.round(
    decisionLogs.reduce((sum, log) => sum + log.metrics.confidence, 0) / decisionLogs.length,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">AI Decision Logs</h2>
          <p className="text-muted-foreground">Autonomous decision history and reasoning analysis</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="glow-purple">
            <Brain className="h-4 w-4 mr-1" />
            {successRate}% Success Rate
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by action, hazard type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {["all", "success", "partial", "failed"].map((result) => (
                  <Button
                    key={result}
                    variant={filterResult === result ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterResult(result)}
                    className={filterResult === result ? "glow" : ""}
                  >
                    {result === "all" ? "All" : result.charAt(0).toUpperCase() + result.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-chart-4" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-chart-4">{successRate}%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Fuel className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Total Fuel Used</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{totalFuelUsed.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-primary">{avgConfidence}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Decision Logs */}
      <div className="space-y-4">
        {filteredLogs.map((log) => {
          const { date, time } = formatTimestamp(log.timestamp)
          const ResultIcon = getResultIcon(log.result)
          const HazardIcon = getHazardIcon(log.hazardType)
          const isSelected = selectedLog === log.id

          return (
            <Card
              key={log.id}
              className={`bg-card border-border cursor-pointer transition-all duration-300 ${
                isSelected ? "ring-2 ring-primary glow" : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedLog(isSelected ? null : log.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Timestamp */}
                  <div className="flex flex-col items-center text-center min-w-[80px]">
                    <div className="text-xs text-muted-foreground font-mono">{date}</div>
                    <div className="text-sm font-mono text-primary glow">{time}</div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HazardIcon className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{log.actionTaken}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getSeverityColor(log.hazardSeverity)}>
                              {log.hazardSeverity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {log.hazardType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ResultIcon className={`h-5 w-5 ${getResultColor(log.result)}`} />
                        <span className={`text-sm font-medium ${getResultColor(log.result)}`}>
                          {log.result.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{log.explanation}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <div className="text-muted-foreground">Fuel Used</div>
                        <div className="font-bold text-yellow-500">{log.metrics.fuelUsed}%</div>
                      </div>
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <div className="text-muted-foreground">Time Delay</div>
                        <div className="font-bold text-primary">{log.metrics.timeDelay}h</div>
                      </div>
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <div className="text-muted-foreground">Risk Reduction</div>
                        <div
                          className={`font-bold ${log.metrics.riskReduction > 0 ? "text-chart-4" : "text-destructive"}`}
                        >
                          {log.metrics.riskReduction > 0 ? "+" : ""}
                          {log.metrics.riskReduction}%
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded p-2 text-center">
                        <div className="text-muted-foreground">Confidence</div>
                        <div className="font-bold text-secondary">{log.metrics.confidence}%</div>
                      </div>
                    </div>

                    {/* AI Reasoning (expanded view) */}
                    {isSelected && (
                      <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">AI Reasoning Process</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{log.aiReasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No logs found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
