"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  TrendingUp,
  AlertTriangle,
  Fuel,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Target,
  BarChart3,
} from "lucide-react"
import { generateMissionAnalysis, type MissionDecision, type MissionAnalysis } from "@/lib/ai-navigation"

interface MissionAnalysisProps {
  decisions: MissionDecision[]
  missionDuration: number
  finalFuelLevel: number
  onClose: () => void
}

export function MissionAnalysisComponent({
  decisions,
  missionDuration,
  finalFuelLevel,
  onClose,
}: MissionAnalysisProps) {
  const [analysis, setAnalysis] = useState<MissionAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const analyzeMission = async () => {
      try {
        const result = await generateMissionAnalysis(decisions, missionDuration, finalFuelLevel)
        setAnalysis(result)
      } catch (error) {
        console.error("[v0] Analysis generation failed:", error)
      } finally {
        setLoading(false)
      }
    }

    analyzeMission()
  }, [decisions, missionDuration, finalFuelLevel])

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-400 glow-green"
    if (grade.startsWith("B")) return "text-blue-400 glow"
    if (grade.startsWith("C")) return "text-yellow-400 glow-yellow"
    return "text-red-400 glow-red"
  }

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return "bg-green-500"
    if (risk <= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-96 bg-card border-border animate-pulse">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing mission performance...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="bg-card border-border animate-mission-complete">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
              <div>
                <CardTitle className="text-3xl font-bold">Mission Complete!</CardTitle>
                <p className="text-muted-foreground">Earth to Moon Navigation Analysis</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Badge className={`text-2xl px-6 py-2 ${getGradeColor(analysis.missionGrade)}`}>
                Grade: {analysis.missionGrade}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Mission Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-muted/20 border-border">
                <CardContent className="p-4 text-center">
                  <Fuel className="h-8 w-8 text-chart-4 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                  <p className="text-2xl font-bold text-chart-4">{100 - analysis.totalFuelUsed}%</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/20 border-border">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Time Impact</p>
                  <p
                    className={`text-2xl font-bold ${analysis.totalTimeDelay > 0 ? "text-red-400" : "text-green-400"}`}
                  >
                    {analysis.totalTimeDelay > 0 ? "+" : ""}
                    {analysis.totalTimeDelay}h
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/20 border-border">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Risk Reduction</p>
                  <p className="text-2xl font-bold text-secondary">{analysis.overallRiskReduction}%</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/20 border-border">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-chart-4 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Decision Accuracy</p>
                  <p className="text-2xl font-bold text-chart-4">{analysis.decisionsCorrect}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Risk Matrix */}
            <Card className="bg-muted/10 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Risk Assessment Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.riskMatrix.map((risk, index) => (
                    <div key={index} className="risk-matrix-cell p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-foreground">{risk.category}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {risk.initialRisk}% → {risk.finalRisk}%
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Initial Risk</span>
                          <span className="text-red-400">{risk.initialRisk}%</span>
                        </div>
                        <Progress value={risk.initialRisk} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Final Risk</span>
                          <span className="text-green-400">{risk.finalRisk}%</span>
                        </div>
                        <Progress value={risk.finalRisk} className="h-2" />

                        <p className="text-xs text-muted-foreground mt-2">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-muted/10 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-muted/10 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Decision Timeline */}
            <Card className="bg-muted/10 border-border">
              <CardHeader>
                <CardTitle>Mission Decision Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {decisions.map((decision, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="flex-shrink-0">
                        {decision.riskReduction > 50 ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">{decision.actionTaken}</p>
                            <p className="text-sm text-muted-foreground">
                              {decision.hazardType} • {decision.timestamp}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">
                              Fuel: {decision.fuelUsed}% • Time: {decision.timeImpact}h
                            </p>
                            <p className="text-green-400">Risk ↓{decision.riskReduction}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button onClick={onClose} className="btn-glow glow px-8 py-3">
                Continue Mission Operations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
