"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useState } from "react"

export default function Instructions({ onStartClick }) {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Welcome to Word Ladder Adventure!</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Transform one word into another, one letter at a time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-6">
          {/* How to Play - Always visible */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="bg-purple-900/30 p-2 rounded-full flex-shrink-0">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">How to Play</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Transform the start word into the target word by changing one letter at a time. Each word must be valid
                English.
              </p>
            </div>
          </div>

          {/* Example - Always visible on mobile, expanded on desktop */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="bg-yellow-900/30 p-2 rounded-full flex-shrink-0">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Quick Example</h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                <span className="bg-green-900/30 px-2 py-1 rounded text-green-400 font-bold text-xs sm:text-sm">
                  CAT
                </span>
                <span className="text-gray-400 text-xs sm:text-sm">→</span>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs sm:text-sm">COT</span>
                <span className="text-gray-400 text-xs sm:text-sm">→</span>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs sm:text-sm">DOT</span>
                <span className="text-gray-400 text-xs sm:text-sm">→</span>
                <span className="bg-red-900/30 px-2 py-1 rounded text-red-400 font-bold text-xs sm:text-sm">DOG</span>
              </div>
            </div>
          </div>

          {/* Mobile: Collapsible sections, Desktop: Always expanded */}
          <div className="block sm:hidden space-y-3">
            {/* Game Modes - Mobile Collapsible */}
            <div className="border border-gray-700 rounded-lg">
              <button
                onClick={() => toggleSection("modes")}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-900/30 p-1.5 rounded-full">
                    <svg className="h-4 w-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Game Modes</span>
                </div>
                <svg
                  className={`h-4 w-4 transition-transform ${expandedSection === "modes" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === "modes" && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Beginner
                    </Badge>
                    <span className="text-gray-300 text-xs">5 moves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Intermediate
                    </Badge>
                    <span className="text-gray-300 text-xs">7 moves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Advanced
                    </Badge>
                    <span className="text-gray-300 text-xs">10 moves + banned words</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Custom
                    </Badge>
                    <span className="text-gray-300 text-xs">Your own words</span>
                  </div>
                </div>
              )}
            </div>

            {/* Rules - Mobile Collapsible */}
            <div className="border border-gray-700 rounded-lg">
              <button
                onClick={() => toggleSection("rules")}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-900/30 p-1.5 rounded-full">
                    <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Rules & Scoring</span>
                </div>
                <svg
                  className={`h-4 w-4 transition-transform ${expandedSection === "rules" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === "rules" && (
                <div className="px-3 pb-3">
                  <ul className="list-disc pl-4 text-gray-300 space-y-1 text-xs">
                    <li>Change only one letter at a time</li>
                    <li>Each word must be valid English</li>
                    <li>Same word length throughout</li>
                    <li>Reach target within move limit</li>
                  </ul>
                  <p className="text-gray-300 text-xs mt-2">
                    <strong>Scoring:</strong> Start with 100 points. -10 per extra move, -5 per hint.
                  </p>
                </div>
              )}
            </div>

            {/* Hints - Mobile Collapsible */}
            <div className="border border-gray-700 rounded-lg">
              <button
                onClick={() => toggleSection("hints")}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-cyan-900/30 p-1.5 rounded-full">
                    <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">AI Hints</span>
                </div>
                <svg
                  className={`h-4 w-4 transition-transform ${expandedSection === "hints" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === "hints" && (
                <div className="px-3 pb-3">
                  <p className="text-gray-300 text-xs mb-2">Get AI-powered suggestions when stuck:</p>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div>
                      <strong className="text-purple-400">UCS:</strong> Shortest path
                    </div>
                    <div>
                      <strong className="text-purple-400">GBFS:</strong> Greedy search
                    </div>
                    <div>
                      <strong className="text-purple-400">A*:</strong> Optimal algorithm
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Always expanded sections */}
          <div className="hidden sm:block space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-900/30 p-2 rounded-full flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Rules</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1 text-base">
                  <li>You can only change one letter at a time</li>
                  <li>Each word must be a valid English word</li>
                  <li>The word length stays the same throughout the game</li>
                  <li>You must reach the target word within the move limit</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-900/30 p-2 rounded-full flex-shrink-0">
                <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Game Modes</h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Beginner
                    </Badge>
                    <span className="text-gray-300 text-sm">5 moves • Perfect for learning</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Intermediate
                    </Badge>
                    <span className="text-gray-300 text-sm">7 moves • Balanced challenge</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Advanced
                    </Badge>
                    <span className="text-gray-300 text-sm">10 moves • Includes banned words</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Custom
                    </Badge>
                    <span className="text-gray-300 text-sm">Choose your own start and end words</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-cyan-900/30 p-2 rounded-full flex-shrink-0">
                <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Hint System</h3>
                <p className="text-gray-300 text-base mb-2">
                  Stuck? Use AI-powered hints, but they'll reduce your final score:
                </p>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>
                    <strong className="text-purple-400">UCS:</strong> Finds shortest path
                  </div>
                  <div>
                    <strong className="text-purple-400">GBFS:</strong> Greedy best-first search
                  </div>
                  <div>
                    <strong className="text-purple-400">A*:</strong> Optimal pathfinding algorithm
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-900/30 p-2 rounded-full flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Scoring</h3>
                <p className="text-gray-300 text-base">
                  Start with 100 points. Lose 10 points per extra move beyond optimal and 5 points per hint used. Aim
                  for efficiency to maximize your score!
                </p>
              </div>
            </div>
          </div>

          {/* Tip - Always visible but smaller on mobile */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-300">
              💡 <strong>Pro Tip:</strong> Think of common letter patterns and word families to find efficient paths!
            </p>
          </div>

          {/* Play Now button */}
          <div className="pt-2 sm:pt-6 flex justify-center">
            <Button
              onClick={onStartClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              Play Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
