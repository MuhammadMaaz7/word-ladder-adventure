"use client"

import { useState } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Progress } from "./components/ui/progress"
import GameBoard from "./components/GameBoard"
import Instructions from "./components/Instructions"
import WordPath from "./components/WordPath"
import "./App.css"

export default function App() {
  const [gameState, setGameState] = useState({
    startWord: "",
    endWord: "",
    currentWord: "",
    path: [],
    movesLimit: 10,
    movesTaken: 0,
    hintsUsed: 0,
    gameStatus: "idle",
    score: 0,
    optimalMoves: 0,
  })

  const [gameMode, setGameMode] = useState("beginner")
  const [gameType, setGameType] = useState("challenge")
  const [customStartWord, setCustomStartWord] = useState("")
  const [customEndWord, setCustomEndWord] = useState("")
  const [nextWordInput, setNextWordInput] = useState("")
  const [validWords, setValidWords] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [message, setMessage] = useState(null)

  // Initialize game
  const startGame = async () => {
    setIsLoading(true);
    try {
      const endpoint = "http://localhost:8000/api/start-game";
      const body = {
        gameMode,
        gameType,
        ...(gameType === "custom" && {
          startWord: customStartWord.toLowerCase(),
          endWord: customEndWord.toLowerCase(),
        }),
      };
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.detail || "Failed to start game");
      }
  
      const data = await response.json();
  
      setGameState({
        ...gameState,
        startWord: data.startWord,
        endWord: data.endWord,
        currentWord: data.startWord,
        path: [data.startWord],
        movesLimit: data.movesLimit,
        movesTaken: 0,
        hintsUsed: 0,
        gameStatus: "playing",
        score: 0,
        optimalMoves: data.optimalMoves,
      });
  
      setValidWords(data.validMoves);
      setShowInstructions(false);
      setMessage({
        type: "success",
        text: `Transform "${data.startWord}" into "${data.endWord}" in ${data.movesLimit} moves or less.`,
      });
    } catch (error) {
      console.error("Error starting game:", error.message); // Log the error
      setMessage({
        type: "error",
        text: error.message || "Failed to start the game. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Make a move
  const makeMove = async (word) => {
    if (gameState.gameStatus !== "playing") return

    try {
      const response = await fetch("http://localhost:8000/api/make-move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWord: gameState.currentWord,
          nextWord: word,
          endWord: gameState.endWord,
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid move")
      }

      const data = await response.json()

      const newPath = [...gameState.path, word]
      const newMovesTaken = gameState.movesTaken + 1
      let newGameStatus = gameState.gameStatus
      let newScore = gameState.score

      if (word === gameState.endWord) {
        newGameStatus = "won"
        newScore = data.score
        setMessage({
          type: "success",
          text: `Congratulations! You won with a score of ${data.score}!`,
        })
      } else if (newMovesTaken >= gameState.movesLimit) {
        newGameStatus = "lost"
        setMessage({
          type: "error",
          text: "Game Over! You've reached the move limit.",
        })
      }

      setGameState({
        ...gameState,
        currentWord: word,
        path: newPath,
        movesTaken: newMovesTaken,
        gameStatus: newGameStatus,
        score: newScore,
      })

      setValidWords(data.validMoves)
      setNextWordInput("")
    } catch (error) {
      setMessage({
        type: "error",
        text: "That's not a valid word transformation.",
      })
    }
  }

  // Get hint
  const getHint = async (algorithm) => {
    if (gameState.gameStatus !== "playing") return

    try {
      const response = await fetch("http://localhost:8000/api/hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWord: gameState.currentWord,
          endWord: gameState.endWord,
          algorithm,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get hint")
      }

      const data = await response.json()

      setGameState({
        ...gameState,
        hintsUsed: gameState.hintsUsed + 1,
      })

      setMessage({
        type: "info",
        text: `Hint (${algorithm.toUpperCase()}): Try the word "${data.hint}"`,
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to get a hint. Please try again.",
      })
    }
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      startWord: "",
      endWord: "",
      currentWord: "",
      path: [],
      movesLimit: 10,
      movesTaken: 0,
      hintsUsed: 0,
      gameStatus: "idle",
      score: 0,
      optimalMoves: 0,
    })
    setValidWords([])
    setNextWordInput("")
    setShowInstructions(true)
    setMessage(null)
  }

  // Handle word input submission
  const handleWordSubmit = (e) => {
    e.preventDefault()
    if (validWords.includes(nextWordInput.toLowerCase())) {
      makeMove(nextWordInput.toLowerCase())
    } else {
      setMessage({
        type: "error",
        text: "That's not a valid transformation. Try another word.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text animate-gradient">
            Word Ladder Adventure
          </h1>
          <p className="text-gray-300">Transform one word into another, one letter at a time!</p>
        </header>

        {message && (
          <div
            className={`p-4 mb-4 rounded-lg border transition-all duration-300 ${
              message.type === "error"
                ? "bg-red-900/50 border-red-500"
                : message.type === "success"
                  ? "bg-green-900/50 border-green-500"
                  : "bg-blue-900/50 border-blue-500"
            }`}
          >
            {message.text}
          </div>
        )}

        {showInstructions ? (
          <Instructions onStartClick={() => setShowInstructions(false)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Game Board</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        Moves: {gameState.movesTaken}/{gameState.movesLimit}
                      </Badge>
                      <Badge variant="outline">Hints: {gameState.hintsUsed}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Transform <span className="font-bold text-green-400">{gameState.startWord}</span> into{" "}
                    <span className="font-bold text-red-400">{gameState.endWord}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GameBoard
                    startWord={gameState.startWord}
                    endWord={gameState.endWord}
                    currentWord={gameState.currentWord}
                    gameStatus={gameState.gameStatus}
                  />

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between">
                      <span>Progress</span>
                      <span>{Math.round((gameState.movesTaken / gameState.movesLimit) * 100)}%</span>
                    </div>
                    <Progress value={(gameState.movesTaken / gameState.movesLimit) * 100} />
                  </div>

                  {gameState.gameStatus === "playing" && (
                    <>
                      <form onSubmit={handleWordSubmit} className="mt-6">
                        <div className="flex space-x-2">
                          <Input
                            value={nextWordInput}
                            onChange={(e) => setNextWordInput(e.target.value)}
                            placeholder="Enter next word..."
                          />
                          <Button type="submit">Submit</Button>
                        </div>
                      </form>

                      <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-400">Need a hint?</p>
                        <div className="flex space-x-2">
                          {["ucs", "gbfs", "astar"].map((algorithm) => (
                            <Button key={algorithm} variant="outline" size="sm" onClick={() => getHint(algorithm)}>
                              {algorithm.toUpperCase()} Hint
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {(gameState.gameStatus === "won" || gameState.gameStatus === "lost") && (
                    <div className="mt-6">
                      <div
                        className={`p-4 rounded-lg ${
                          gameState.gameStatus === "won"
                            ? "bg-green-900/30 border border-green-500"
                            : "bg-red-900/30 border border-red-500"
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-2">
                          {gameState.gameStatus === "won" ? "Congratulations!" : "Game Over"}
                        </h3>
                        <p>
                          {gameState.gameStatus === "won"
                            ? `You won with a score of ${gameState.score}! The optimal solution was ${gameState.optimalMoves} moves.`
                            : "You've reached the move limit. Try again!"}
                        </p>
                      </div>
                      <Button className="w-full mt-4" onClick={resetGame}>
                        Play Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Path</CardTitle>
                </CardHeader>
                <CardContent>
                  <WordPath path={gameState.path} />
                </CardContent>
              </Card>

              {gameState.gameStatus === "idle" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Game Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 font-medium">Game Type</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant={gameType === "challenge" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setGameType("challenge")}
                          >
                            Challenge
                          </Button>
                          <Button
                            variant={gameType === "custom" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setGameType("custom")}
                          >
                            Custom
                          </Button>
                        </div>
                      </div>

                      {gameType === "challenge" ? (
                        <div>
                          <h3 className="mb-2 font-medium">Select Difficulty</h3>
                          <div className="space-y-2">
                            {[
                              { value: "beginner", label: "Beginner", moves: 5 },
                              { value: "intermediate", label: "Intermediate", moves: 7 },
                              { value: "advanced", label: "Advanced", moves: 10 },
                            ].map(({ value, label, moves }) => (
                              <Button
                                key={value}
                                variant={gameMode === value ? "default" : "outline"}
                                className="w-full justify-between"
                                onClick={() => setGameMode(value)}
                              >
                                <span>{label}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {moves} moves
                                </Badge>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Start Word</label>
                            <Input
                              value={customStartWord}
                              onChange={(e) => setCustomStartWord(e.target.value)}
                              placeholder="Enter start word"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">End Word</label>
                            <Input
                              value={customEndWord}
                              onChange={(e) => setCustomEndWord(e.target.value)}
                              placeholder="Enter end word"
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={startGame}
                        disabled={isLoading || (gameType === "custom" && (!customStartWord || !customEndWord))}
                      >
                        {isLoading ? "Loading..." : "Start Game"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

