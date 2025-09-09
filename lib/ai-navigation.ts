export interface HazardOption {
  id: string
  title: string
  description: string
  fuelCost: number
  timeDelay: number
  riskReduction: number
  confidence: number
  path: { x: number; y: number }[]
}

export interface HazardAnalysis {
  hazardType: string
  severity: string
  immediateRisk: number
  options: HazardOption[]
  recommendation: string
}

export interface MissionDecision {
  timestamp: string
  hazardType: string
  actionTaken: string
  fuelUsed: number
  timeImpact: number
  riskReduction: number
  outcome: string
}

export interface MissionAnalysis {
  totalFuelUsed: number
  totalTimeDelay: number
  hazardsEncountered: number
  decisionsCorrect: number
  overallRiskReduction: number
  missionGrade: string
  keyInsights: string[]
  riskMatrix: {
    category: string
    initialRisk: number
    finalRisk: number
    mitigation: string
  }[]
  recommendations: string[]
}

export interface TripProgress {
  isComplete: boolean
  progress: number
  startTime: number
  completionTime?: number
}

export function generateHazardResponse(
  hazardType: string,
  severity: string,
  currentPosition: number,
  missionProgress: number,
): HazardAnalysis {
  const hazardTemplates = {
    "solar-flare": {
      low: {
        immediateRisk: 35,
        options: [
          {
            id: "shield-enhancement",
            title: "Enhanced Shielding",
            description: "Activate electromagnetic shielding to deflect solar particles",
            fuelCost: 2,
            timeDelay: 0,
            riskReduction: 45,
            confidence: 90,
          },
          {
            id: "minor-course-adjust",
            title: "Minor Course Adjustment",
            description: "Slight trajectory modification to reduce exposure time",
            fuelCost: 5,
            timeDelay: 0.3,
            riskReduction: 60,
            confidence: 85,
          },
          {
            id: "continue-monitor",
            title: "Continue & Monitor",
            description: "Maintain course with enhanced radiation monitoring",
            fuelCost: 0,
            timeDelay: 0,
            riskReduction: 20,
            confidence: 75,
          },
        ],
        recommendation: "Enhanced Shielding provides optimal protection with minimal resource cost.",
      },
      medium: {
        immediateRisk: 65,
        options: [
          {
            id: "course-correction",
            title: "Course Correction",
            description: "Moderate trajectory adjustment to avoid peak radiation zone",
            fuelCost: 8,
            timeDelay: 1.2,
            riskReduction: 70,
            confidence: 88,
          },
          {
            id: "emergency-shield",
            title: "Emergency Shielding",
            description: "Maximum electromagnetic shielding with crew shelter protocol",
            fuelCost: 3,
            timeDelay: 0.5,
            riskReduction: 55,
            confidence: 82,
          },
          {
            id: "acceleration",
            title: "Accelerate Through",
            description: "Increase velocity to minimize exposure time",
            fuelCost: 12,
            timeDelay: -0.8,
            riskReduction: 45,
            confidence: 70,
          },
        ],
        recommendation: "Course Correction offers the best balance of safety and efficiency.",
      },
      high: {
        immediateRisk: 85,
        options: [
          {
            id: "emergency-avoidance",
            title: "Emergency Avoidance",
            description: "Major trajectory change to completely avoid radiation zone",
            fuelCost: 18,
            timeDelay: 3.5,
            riskReduction: 90,
            confidence: 95,
          },
          {
            id: "shelter-protocol",
            title: "Shelter Protocol",
            description: "Full crew shelter with maximum shielding activation",
            fuelCost: 5,
            timeDelay: 2.0,
            riskReduction: 65,
            confidence: 85,
          },
          {
            id: "emergency-burn",
            title: "Emergency Burn",
            description: "High-thrust maneuver to escape radiation field quickly",
            fuelCost: 25,
            timeDelay: -1.5,
            riskReduction: 75,
            confidence: 80,
          },
        ],
        recommendation: "Emergency Avoidance is critical for crew safety despite high fuel cost.",
      },
    },
    debris: {
      low: {
        immediateRisk: 25,
        options: [
          {
            id: "micro-adjustment",
            title: "Micro Adjustment",
            description: "Minimal trajectory correction to avoid debris cluster",
            fuelCost: 3,
            timeDelay: 0.1,
            riskReduction: 50,
            confidence: 85,
          },
          {
            id: "enhanced-tracking",
            title: "Enhanced Tracking",
            description: "Activate advanced debris tracking with minor corrections",
            fuelCost: 1,
            timeDelay: 0,
            riskReduction: 35,
            confidence: 80,
          },
          {
            id: "maintain-course",
            title: "Maintain Course",
            description: "Continue on current trajectory with standard monitoring",
            fuelCost: 0,
            timeDelay: 0,
            riskReduction: 15,
            confidence: 70,
          },
        ],
        recommendation: "Micro Adjustment provides good safety margin with minimal cost.",
      },
      medium: {
        immediateRisk: 55,
        options: [
          {
            id: "debris-avoidance",
            title: "Debris Avoidance",
            description: "Calculate safe corridor through debris field",
            fuelCost: 10,
            timeDelay: 1.5,
            riskReduction: 75,
            confidence: 90,
          },
          {
            id: "velocity-change",
            title: "Velocity Adjustment",
            description: "Alter speed to pass through debris field safely",
            fuelCost: 7,
            timeDelay: 0.8,
            riskReduction: 60,
            confidence: 85,
          },
          {
            id: "defensive-posture",
            title: "Defensive Posture",
            description: "Orient spacecraft for maximum protection while continuing",
            fuelCost: 2,
            timeDelay: 0.3,
            riskReduction: 40,
            confidence: 75,
          },
        ],
        recommendation: "Debris Avoidance ensures safe passage through the field.",
      },
      high: {
        immediateRisk: 80,
        options: [
          {
            id: "emergency-stop",
            title: "Emergency Stop",
            description: "Full stop to analyze debris field and plan safe route",
            fuelCost: 15,
            timeDelay: 4.0,
            riskReduction: 85,
            confidence: 95,
          },
          {
            id: "major-reroute",
            title: "Major Reroute",
            description: "Significant course change to completely avoid debris zone",
            fuelCost: 22,
            timeDelay: 5.2,
            riskReduction: 95,
            confidence: 92,
          },
          {
            id: "precision-navigation",
            title: "Precision Navigation",
            description: "Thread through debris using maximum maneuvering capability",
            fuelCost: 20,
            timeDelay: 2.5,
            riskReduction: 70,
            confidence: 75,
          },
        ],
        recommendation: "Major Reroute is safest option for high-density debris field.",
      },
    },
    radiation: {
      low: {
        immediateRisk: 30,
        options: [
          {
            id: "standard-shielding",
            title: "Standard Shielding",
            description: "Activate standard radiation protection protocols",
            fuelCost: 1,
            timeDelay: 0,
            riskReduction: 40,
            confidence: 85,
          },
          {
            id: "route-optimization",
            title: "Route Optimization",
            description: "Minor course adjustment to minimize radiation exposure",
            fuelCost: 4,
            timeDelay: 0.5,
            riskReduction: 55,
            confidence: 80,
          },
          {
            id: "continue-standard",
            title: "Continue Standard",
            description: "Maintain course with standard radiation monitoring",
            fuelCost: 0,
            timeDelay: 0,
            riskReduction: 25,
            confidence: 75,
          },
        ],
        recommendation: "Standard Shielding provides adequate protection for low radiation levels.",
      },
      medium: {
        immediateRisk: 60,
        options: [
          {
            id: "enhanced-protection",
            title: "Enhanced Protection",
            description: "Activate enhanced radiation shielding and crew protocols",
            fuelCost: 6,
            timeDelay: 1.0,
            riskReduction: 65,
            confidence: 88,
          },
          {
            id: "trajectory-modification",
            title: "Trajectory Modification",
            description: "Adjust course to reduce time in radiation zone",
            fuelCost: 9,
            timeDelay: 1.8,
            riskReduction: 70,
            confidence: 85,
          },
          {
            id: "speed-increase",
            title: "Speed Increase",
            description: "Accelerate to minimize radiation exposure time",
            fuelCost: 11,
            timeDelay: -0.5,
            riskReduction: 50,
            confidence: 78,
          },
        ],
        recommendation: "Trajectory Modification offers best long-term radiation reduction.",
      },
      high: {
        immediateRisk: 85,
        options: [
          {
            id: "maximum-shielding",
            title: "Maximum Shielding",
            description: "Full radiation protection with crew shelter procedures",
            fuelCost: 8,
            timeDelay: 2.5,
            riskReduction: 80,
            confidence: 92,
          },
          {
            id: "emergency-reroute",
            title: "Emergency Reroute",
            description: "Major course change to avoid high radiation zone entirely",
            fuelCost: 20,
            timeDelay: 4.0,
            riskReduction: 95,
            confidence: 95,
          },
          {
            id: "high-speed-transit",
            title: "High-Speed Transit",
            description: "Maximum acceleration through radiation zone",
            fuelCost: 18,
            timeDelay: -1.2,
            riskReduction: 60,
            confidence: 80,
          },
        ],
        recommendation: "Emergency Reroute is essential for crew safety in high radiation.",
      },
    },
    "gravitational-anomaly": {
      low: {
        immediateRisk: 20,
        options: [
          {
            id: "compensation-burn",
            title: "Compensation Burn",
            description: "Minor thrust adjustment to compensate for gravitational pull",
            fuelCost: 5,
            timeDelay: 0.2,
            riskReduction: 60,
            confidence: 90,
          },
          {
            id: "trajectory-recalc",
            title: "Trajectory Recalculation",
            description: "Recalculate optimal path accounting for anomaly",
            fuelCost: 2,
            timeDelay: 0.5,
            riskReduction: 45,
            confidence: 85,
          },
          {
            id: "monitor-adjust",
            title: "Monitor & Adjust",
            description: "Continue with enhanced gravitational monitoring",
            fuelCost: 0,
            timeDelay: 0,
            riskReduction: 25,
            confidence: 75,
          },
        ],
        recommendation: "Compensation Burn provides precise correction for the anomaly.",
      },
      medium: {
        immediateRisk: 50,
        options: [
          {
            id: "orbital-adjustment",
            title: "Orbital Adjustment",
            description: "Modify orbital parameters to account for gravitational influence",
            fuelCost: 12,
            timeDelay: 2.0,
            riskReduction: 75,
            confidence: 88,
          },
          {
            id: "gravitational-assist",
            title: "Gravitational Assist",
            description: "Use anomaly for gravitational slingshot maneuver",
            fuelCost: -5,
            timeDelay: -1.0,
            riskReduction: 40,
            confidence: 70,
          },
          {
            id: "stabilization-burn",
            title: "Stabilization Burn",
            description: "Continuous thrust to maintain stable trajectory",
            fuelCost: 15,
            timeDelay: 1.5,
            riskReduction: 65,
            confidence: 82,
          },
        ],
        recommendation: "Orbital Adjustment ensures stable trajectory through the anomaly.",
      },
      high: {
        immediateRisk: 75,
        options: [
          {
            id: "emergency-escape",
            title: "Emergency Escape",
            description: "High-thrust maneuver to escape gravitational influence",
            fuelCost: 25,
            timeDelay: 3.0,
            riskReduction: 90,
            confidence: 95,
          },
          {
            id: "complex-maneuver",
            title: "Complex Maneuver",
            description: "Multi-stage burn sequence to navigate around anomaly",
            fuelCost: 30,
            timeDelay: 4.5,
            riskReduction: 85,
            confidence: 85,
          },
          {
            id: "powered-transit",
            title: "Powered Transit",
            description: "Continuous thrust to overpower gravitational effects",
            fuelCost: 35,
            timeDelay: 2.0,
            riskReduction: 70,
            confidence: 80,
          },
        ],
        recommendation: "Emergency Escape is critical to avoid trajectory disruption.",
      },
    },
  }

  const template =
    hazardTemplates[hazardType as keyof typeof hazardTemplates]?.[
      severity as keyof (typeof hazardTemplates)[keyof typeof hazardTemplates]
    ]

  if (!template) {
    // Fallback for unknown hazard types
    return {
      hazardType,
      severity,
      immediateRisk: 50,
      options: [
        {
          id: "emergency-stop",
          title: "Emergency Stop",
          description: "Halt all forward momentum and reassess situation",
          fuelCost: 10,
          timeDelay: 2,
          riskReduction: 60,
          confidence: 85,
          path: generatePathCoordinates(currentPosition, 0),
        },
        {
          id: "course-correction",
          title: "Course Correction",
          description: "Standard trajectory adjustment to avoid hazard",
          fuelCost: 8,
          timeDelay: 1,
          riskReduction: 50,
          confidence: 80,
          path: generatePathCoordinates(currentPosition, 1),
        },
        {
          id: "continue-monitor",
          title: "Continue & Monitor",
          description: "Maintain course with enhanced monitoring",
          fuelCost: 0,
          timeDelay: 0,
          riskReduction: 20,
          confidence: 70,
          path: generatePathCoordinates(currentPosition, 2),
        },
      ],
      recommendation: "Course Correction recommended for unknown hazard type.",
    }
  }

  return {
    hazardType,
    severity,
    immediateRisk: template.immediateRisk,
    options: template.options.map((option, index) => ({
      ...option,
      path: generatePathCoordinates(currentPosition, index),
    })),
    recommendation: template.recommendation,
  }
}

export function generateMissionAnalysis(
  decisions: MissionDecision[],
  missionDuration: number,
  finalFuelLevel: number,
): MissionAnalysis {
  // Calculate metrics from decisions
  const totalFuelUsed = 100 - finalFuelLevel
  const totalTimeDelay = decisions.reduce((sum, d) => sum + d.timeImpact, 0)
  const avgRiskReduction =
    decisions.length > 0 ? decisions.reduce((sum, d) => sum + d.riskReduction, 0) / decisions.length : 0

  // Grade calculation based on multiple factors
  let gradeScore = 100

  // Fuel efficiency (30% of grade)
  if (totalFuelUsed > 50) gradeScore -= 30
  else if (totalFuelUsed > 30) gradeScore -= 20
  else if (totalFuelUsed > 15) gradeScore -= 10

  // Time efficiency (25% of grade)
  if (totalTimeDelay > 10) gradeScore -= 25
  else if (totalTimeDelay > 5) gradeScore -= 15
  else if (totalTimeDelay > 2) gradeScore -= 8
  else if (totalTimeDelay < 0) gradeScore += 5 // Bonus for time saved

  // Risk management (35% of grade)
  if (avgRiskReduction < 30) gradeScore -= 35
  else if (avgRiskReduction < 50) gradeScore -= 20
  else if (avgRiskReduction < 70) gradeScore -= 10
  else if (avgRiskReduction > 80) gradeScore += 5

  // Decision count penalty (10% of grade) - too many decisions indicate poor planning
  if (decisions.length > 8) gradeScore -= 10
  else if (decisions.length > 5) gradeScore -= 5

  // Convert score to letter grade
  let missionGrade: string
  if (gradeScore >= 97) missionGrade = "A+"
  else if (gradeScore >= 93) missionGrade = "A"
  else if (gradeScore >= 90) missionGrade = "A-"
  else if (gradeScore >= 87) missionGrade = "B+"
  else if (gradeScore >= 83) missionGrade = "B"
  else if (gradeScore >= 80) missionGrade = "B-"
  else if (gradeScore >= 77) missionGrade = "C+"
  else if (gradeScore >= 73) missionGrade = "C"
  else if (gradeScore >= 70) missionGrade = "C-"
  else if (gradeScore >= 60) missionGrade = "D"
  else missionGrade = "F"

  // Generate insights based on performance
  const keyInsights: string[] = []
  if (totalFuelUsed < 20) {
    keyInsights.push("Excellent fuel conservation throughout the mission")
  } else if (totalFuelUsed > 40) {
    keyInsights.push("High fuel consumption indicates room for efficiency improvements")
  }

  if (avgRiskReduction > 70) {
    keyInsights.push("Outstanding risk management with consistently safe decisions")
  } else if (avgRiskReduction < 40) {
    keyInsights.push("Risk management could be improved with more decisive actions")
  }

  if (totalTimeDelay < 1) {
    keyInsights.push("Mission timeline maintained effectively with minimal delays")
  } else if (totalTimeDelay > 5) {
    keyInsights.push("Significant time delays suggest need for faster decision-making")
  }

  if (decisions.length <= 3) {
    keyInsights.push("Efficient navigation with minimal course corrections required")
  }

  // Generate recommendations
  const recommendations: string[] = []
  if (totalFuelUsed > 30) {
    recommendations.push("Consider more fuel-efficient maneuvers for future missions")
  }
  if (avgRiskReduction < 60) {
    recommendations.push("Implement more aggressive hazard avoidance strategies")
  }
  if (totalTimeDelay > 3) {
    recommendations.push("Develop faster hazard response protocols")
  }
  if (decisions.length > 6) {
    recommendations.push("Improve pre-mission planning to reduce in-flight corrections")
  }

  // Default recommendations if performance is good
  if (recommendations.length === 0) {
    recommendations.push("Maintain current high standards of navigation excellence")
    recommendations.push("Consider sharing successful strategies with other missions")
  }

  return {
    totalFuelUsed,
    totalTimeDelay,
    hazardsEncountered: decisions.length,
    decisionsCorrect: Math.min(95, Math.max(60, gradeScore)),
    overallRiskReduction: Math.round(avgRiskReduction),
    missionGrade,
    keyInsights,
    riskMatrix: [
      {
        category: "Solar Radiation",
        initialRisk: 75,
        finalRisk: Math.max(10, 75 - avgRiskReduction),
        mitigation:
          avgRiskReduction > 60
            ? "Effective shielding and avoidance maneuvers"
            : "Standard protection protocols applied",
      },
      {
        category: "Debris Collision",
        initialRisk: 60,
        finalRisk: Math.max(5, 60 - avgRiskReduction),
        mitigation: avgRiskReduction > 50 ? "Proactive debris field navigation" : "Basic collision avoidance measures",
      },
      {
        category: "Fuel Depletion",
        initialRisk: Math.min(80, totalFuelUsed + 20),
        finalRisk: Math.max(5, totalFuelUsed),
        mitigation: totalFuelUsed < 25 ? "Excellent fuel conservation practices" : "Standard fuel management protocols",
      },
      {
        category: "Navigation Error",
        initialRisk: 40,
        finalRisk: Math.max(5, 40 - decisions.length * 5),
        mitigation:
          decisions.length > 4
            ? "Multiple course corrections maintained accuracy"
            : "Precise initial navigation planning",
      },
    ],
    recommendations,
  }
}

function generatePathCoordinates(currentPos: number, optionIndex: number): { x: number; y: number }[] {
  const baseY = 50
  const variations = [
    { yOffset: 15, curve: 0.8 }, // Emergency - higher arc
    { yOffset: 8, curve: 0.5 }, // Correction - moderate arc
    { yOffset: 0, curve: 0.1 }, // Continue - minimal change
  ]

  const variation = variations[optionIndex] || variations[1]
  const points = []

  for (let i = 0; i <= 10; i++) {
    const progress = i / 10
    const x = currentPos + (100 - currentPos) * progress
    const y = baseY + variation.yOffset * Math.sin(progress * Math.PI) * variation.curve
    points.push({ x: Math.min(x, 95), y: Math.max(Math.min(y, 85), 15) })
  }

  return points
}
