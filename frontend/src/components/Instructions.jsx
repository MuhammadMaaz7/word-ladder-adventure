import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

export default function Instructions({ onStartClick }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Word Ladder Adventure!</CardTitle>
        <CardDescription>Transform one word into another, one letter at a time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-900/30 p-2 rounded-full">
              <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">How to Play</h3>
              <p className="text-gray-300">
                The goal is to transform the start word into the target word by changing just one letter at a time. Each
                intermediate word must be a valid English word.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-blue-900/30 p-2 rounded-full">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Rules</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                <li>You can only change one letter at a time</li>
                <li>Each word must be a valid English word</li>
                <li>The word length stays the same throughout the game</li>
                <li>You must reach the target word within the move limit</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-green-900/30 p-2 rounded-full">
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
              <p className="text-gray-300">
                Your score is based on how efficiently you reach the target word. Using fewer moves and fewer hints will
                result in a higher score.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-yellow-900/30 p-2 rounded-full">
              <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Example</h3>
              <p className="text-gray-300">Transforming "CAT" to "DOG":</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="bg-green-900/30 px-2 py-1 rounded text-green-400 font-bold">CAT</span>
                <span className="text-gray-400">→</span>
                <span className="bg-gray-700 px-2 py-1 rounded">COT</span>
                <span className="text-gray-400">→</span>
                <span className="bg-gray-700 px-2 py-1 rounded">DOT</span>
                <span className="text-gray-400">→</span>
                <span className="bg-red-900/30 px-2 py-1 rounded text-red-400 font-bold">DOG</span>
              </div>
            </div>
          </div>

          {/* Add Play Now button */}
          <div className="pt-6 flex justify-center">
            <Button
              onClick={onStartClick}
              className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              Play Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

