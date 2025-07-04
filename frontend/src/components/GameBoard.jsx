"use client"

import { useState, useEffect } from "react"

export default function GameBoard({ startWord, endWord, currentWord, gameStatus }) {
  const [highlightedIndex, setHighlightedIndex] = useState(null)

  useEffect(() => {
    if (startWord && currentWord && startWord !== currentWord) {
      for (let i = 0; i < startWord.length; i++) {
        if (startWord[i] !== currentWord[i]) {
          setHighlightedIndex(i)
          break
        }
      }
    }
  }, [startWord, currentWord])

  if (!startWord || !endWord) {
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Start and End Words - Stack on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4 sm:gap-6">
        <div className="text-center flex-1">
          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Start Word</p>
          <div className="flex justify-center space-x-1">
            {startWord.split("").map((letter, index) => (
              <div
                key={`start-${index}`}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-md bg-green-900/30 border border-green-500 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-sm sm:text-lg lg:text-xl font-bold text-green-400">{letter.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center flex-1">
          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">End Word</p>
          <div className="flex justify-center space-x-1">
            {endWord.split("").map((letter, index) => (
              <div
                key={`end-${index}`}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-md bg-red-900/30 border border-red-500 animate-fade-in"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <span className="text-sm sm:text-lg lg:text-xl font-bold text-red-400">{letter.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Word */}
      {gameStatus !== "idle" && (
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Current Word</p>
          <div className="flex justify-center space-x-1">
            {currentWord.split("").map((letter, index) => (
              <div
                key={`current-${index}`}
                className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-md transform transition-all duration-300 ${
                  index === highlightedIndex
                    ? "bg-purple-900/50 border-2 border-purple-400 scale-110"
                    : "bg-gray-700 border border-gray-600"
                }`}
              >
                <span
                  className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                    index === highlightedIndex ? "text-purple-300" : "text-white"
                  }`}
                >
                  {letter.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
