import React, { useState, useEffect } from 'react'

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
    <div className="flex flex-col items-center space-y-8">
      <div className="flex justify-between items-center w-full">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Start Word</p>
          <div className="flex space-x-1">
            {startWord.split("").map((letter, index) => (
              <div
                key={`start-${index}`}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-green-900/30 border border-green-500 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-lg font-bold text-green-400">
                  {letter.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">End Word</p>
          <div className="flex space-x-1">
            {endWord.split("").map((letter, index) => (
              <div
                key={`end-${index}`}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-red-900/30 border border-red-500 animate-fade-in"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <span className="text-lg font-bold text-red-400">
                  {letter.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {gameStatus !== "idle" && (
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Current Word</p>
          <div className="flex space-x-1">
            {currentWord.split("").map((letter, index) => (
              <div
                key={`current-${index}`}
                className={`w-12 h-12 flex items-center justify-center rounded-md transform transition-all duration-300 ${
                  index === highlightedIndex
                    ? "bg-purple-900/50 border-2 border-purple-400 scale-110"
                    : "bg-gray-700 border border-gray-600"
                }`}
              >
                <span
                  className={`text-xl font-bold ${
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
