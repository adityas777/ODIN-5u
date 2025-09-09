"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

interface WelcomeScreenProps {
  onLaunchComplete: () => void
}

export function WelcomeScreen({ onLaunchComplete }: WelcomeScreenProps) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showRocket, setShowRocket] = useState(false)
  const [rocketPosition, setRocketPosition] = useState(0) // Start from bottom (0) instead of 100
  const [showSmoke, setShowSmoke] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  const [fullScreenSmoke, setFullScreenSmoke] = useState(false)

  const handleLaunch = () => {
    setIsLaunching(true)
    setCountdown(3)
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isLaunching) {
      setShowRocket(true)
      setShowSmoke(true)
      setScreenShake(true)

      const launchTimer = setInterval(() => {
        setRocketPosition((prev) => {
          if (prev >= 150) {
            // Changed condition to >= 150 for upward movement
            clearInterval(launchTimer)
            // Trigger full screen smoke before transitioning
            setFullScreenSmoke(true)
            setTimeout(() => {
              onLaunchComplete()
            }, 3000)
            return prev
          }
          return prev + 3 // Positive increment for upward movement
        })
      }, 30)

      // Stop screen shake after 4 seconds
      setTimeout(() => {
        setScreenShake(false)
      }, 4000)
    }
  }, [countdown, isLaunching, onLaunchComplete])

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden ${screenShake ? "screen-shake" : ""}`}>
      <div className="absolute inset-0 galaxy-background">
        {/* Galaxy spirals */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`galaxy-${i}`}
            className="absolute galaxy-spiral"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}

        {/* Bright stars */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bright-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`nebula-${i}`}
            className="absolute nebula-cloud"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {!isLaunching && (
          <>
            <div className="text-center mb-12 relative">
              <div className="fixed inset-0 flex items-center justify-center opacity-40 z-0">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%281%29-Y2TQJvylrFJfIFvv8yYiShBYFeSxBw.webp"
                  alt="Astronaut Helmet"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10">
                <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text-1 hover-glow-text cursor-default">
                  LET'S BEGIN YOUR
                </h1>
                <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text-2 hover-glow-text cursor-default">
                  SPACE TRIP WITH ODIN
                </h1>
              </div>
            </div>

            <Button
              onClick={handleLaunch}
              size="lg"
              className="text-2xl px-16 py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-500 glow-rainbow animate-pulse hover-glow-button"
            >
              <Rocket className="mr-4 h-10 w-10" />
              LAUNCH
            </Button>
          </>
        )}

        {countdown > 0 && (
          <div className="text-center relative">
            <div className="countdown-background"></div>
            <div className="text-[12rem] font-bold animate-bounce countdown-text relative z-10">{countdown}</div>
            <div className="countdown-ring"></div>
          </div>
        )}

        {showRocket && (
          <div
            className="fixed left-1/2 transform -translate-x-1/2 transition-all duration-50 ease-linear z-30"
            style={{ bottom: `${rocketPosition}%` }} // This now correctly moves rocket from bottom to top
          >
            <div className="relative rocket-container">
              {/* Main Rocket Body - Much Much Bigger */}
              <div className="relative">
                <div className="w-48 h-96 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500 rounded-t-full mx-auto shadow-2xl rocket-body">
                  {" "}
                  {/* Made rocket even bigger */}
                  {/* Rocket Details */}
                  <div className="w-44 h-88 bg-gradient-to-b from-white to-gray-100 rounded-t-full mx-auto pt-4">
                    <div className="w-40 h-80 bg-gradient-to-b from-blue-400 to-blue-700 rounded-t-full mx-auto mt-4 rocket-window"></div>
                    {/* Rocket stripes */}
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-36 h-3 bg-red-500"></div>
                    <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-36 h-3 bg-red-500"></div>
                  </div>
                  {/* Enhanced Rocket Fins */}
                  <div className="absolute bottom-0 -left-10 w-20 h-32 bg-gradient-to-r from-red-600 to-red-800 transform -skew-x-12 rocket-fin"></div>
                  <div className="absolute bottom-0 -right-10 w-20 h-32 bg-gradient-to-l from-red-600 to-red-800 transform skew-x-12 rocket-fin"></div>
                </div>
              </div>

              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-4">
                <div className="w-44 h-80 bg-gradient-to-b from-orange-300 via-red-400 to-yellow-300 rounded-full animate-pulse opacity-95 blur-sm rocket-fire" />
                <div className="w-40 h-72 bg-gradient-to-b from-yellow-200 via-orange-300 to-red-400 rounded-full absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse rocket-fire" />
                <div className="w-36 h-64 bg-gradient-to-b from-white via-yellow-100 to-orange-200 rounded-full absolute top-8 left-1/2 transform -translate-x-1/2 animate-pulse rocket-fire" />
              </div>
            </div>
          </div>
        )}

        {showSmoke && (
          <div className="fixed inset-0 pointer-events-none z-20">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute dark-smoke-particle rounded-full opacity-60 animate-ping"
                style={{
                  width: `${12 + Math.random() * 24}px`,
                  height: `${12 + Math.random() * 24}px`,
                  left: `${35 + Math.random() * 30}%`,
                  bottom: `${60 + Math.random() * 35}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}

            {[...Array(25)].map((_, i) => (
              <div
                key={`smoke-${i}`}
                className="absolute dark-smoke-cloud rounded-full opacity-50 animate-pulse expanding-smoke"
                style={{
                  width: `${48 + Math.random() * 96}px`,
                  height: `${48 + Math.random() * 96}px`,
                  left: `${25 + Math.random() * 50}%`,
                  bottom: `${50 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {fullScreenSmoke && (
          <div className="fixed inset-0 z-50 full-screen-smoke">
            {[...Array(150)].map((_, i) => (
              <div
                key={`fullsmoke-${i}`}
                className="absolute dark-transition-smoke rounded-full opacity-70 animate-pulse"
                style={{
                  width: `${60 + Math.random() * 120}px`,
                  height: `${60 + Math.random() * 120}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random() * 1}s`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black opacity-90 animate-pulse"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        .galaxy-background {
          background: radial-gradient(ellipse at center, #0f0f23 0%, #1a1a2e 30%, #16213e 60%, #0a0a0a 100%);
        }
        
        .galaxy-spiral {
          width: 200px;
          height: 200px;
          background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%);
          border-radius: 50%;
          animation: galaxyRotate 20s linear infinite;
        }
        
        .bright-star {
          width: 2px;
          height: 2px;
          background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
          border-radius: 50%;
          box-shadow: 0 0 6px #ffffff, 0 0 12px #3b82f6, 0 0 18px #8b5cf6;
        }
        
        .nebula-cloud {
          width: 300px;
          height: 150px;
          background: radial-gradient(ellipse at center, rgba(249, 115, 22, 0.2) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 70%);
          border-radius: 50%;
          animation: nebulaDrift 12s ease-in-out infinite;
        }
        
        .gradient-text-1 {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #f97316, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          animation: textShimmer 3s ease-in-out infinite;
        }
        
        .gradient-text-2 {
          background: linear-gradient(45deg, #f97316, #ef4444, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(249, 115, 22, 0.5);
          animation: textShimmer 3s ease-in-out infinite reverse;
        }
        
        .hover-glow-text:hover {
          text-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.6), 0 0 80px rgba(249, 115, 22, 0.4);
          transform: scale(1.05);
          transition: all 0.3s ease;
        }
        
        .countdown-background {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(249, 115, 22, 0.2) 50%, transparent 70%);
          border-radius: 50%;
          animation: countdownPulse 1s ease-in-out infinite;
        }
        
        .countdown-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 350px;
          height: 350px;
          border: 4px solid rgba(239, 68, 68, 0.5);
          border-radius: 50%;
          animation: ringRotate 2s linear infinite;
        }
        
        .countdown-text {
          background: linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 60px rgba(239, 68, 68, 0.8);
          animation: countdownGlow 1s ease-in-out infinite;
        }
        
        .glow-rainbow {
          box-shadow: 0 0 30px #3b82f6, 0 0 60px #8b5cf6, 0 0 90px #f97316;
        }
        
        .hover-glow-button:hover {
          box-shadow: 0 0 40px #3b82f6, 0 0 80px #8b5cf6, 0 0 120px #f97316, 0 0 160px #ef4444;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
        
        .rocket-container {
          animation: rocketVibration 0.1s ease-in-out infinite;
        }
        
        .rocket-body {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4);
        }
        
        .rocket-fire {
          animation: fireFlicker 0.1s ease-in-out infinite;
        }
        
        .dark-smoke-particle {
          background: radial-gradient(circle, rgba(64, 64, 64, 0.8) 0%, rgba(32, 32, 32, 0.6) 50%, rgba(16, 16, 16, 0.4) 100%);
          box-shadow: 0 0 10px rgba(64, 64, 64, 0.4);
        }
        
        .dark-smoke-cloud {
          background: radial-gradient(circle, rgba(80, 80, 80, 0.7) 0%, rgba(48, 48, 48, 0.5) 50%, rgba(24, 24, 24, 0.3) 100%);
          box-shadow: 0 0 20px rgba(80, 80, 80, 0.3);
        }
        
        .dark-transition-smoke {
          background: radial-gradient(circle, rgba(96, 96, 96, 0.9) 0%, rgba(64, 64, 64, 0.7) 30%, rgba(32, 32, 32, 0.5) 60%, rgba(16, 16, 16, 0.3) 100%);
          box-shadow: 0 0 30px rgba(96, 96, 96, 0.5);
        }
        
        .screen-shake {
          animation: screenShake 0.1s ease-in-out infinite;
        }
        
        @keyframes galaxyRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes nebulaDrift {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
        }
        
        @keyframes textShimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes countdownPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
        
        @keyframes ringRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes countdownGlow {
          0%, 100% { text-shadow: 0 0 60px rgba(239, 68, 68, 0.8); }
          50% { text-shadow: 0 0 80px rgba(239, 68, 68, 1), 0 0 100px rgba(249, 115, 22, 0.8); }
        }
        
        @keyframes rocketVibration {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(1px); }
        }
        
        @keyframes fireFlicker {
          0%, 100% { opacity: 0.9; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
        
        @keyframes screenShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes smokeRise {
          0% { transform: translateY(0) scale(0.5); opacity: 0.8; }
          50% { transform: translateY(-150px) scale(1.5); opacity: 0.6; }
          100% { transform: translateY(-300px) scale(3); opacity: 0; }
        }
        
        @keyframes smokeExpand {
          0% { transform: scale(0.5); opacity: 0.7; }
          50% { transform: scale(2); opacity: 0.4; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes smokeEnvelop {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}
