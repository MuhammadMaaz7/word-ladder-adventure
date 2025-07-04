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
import ScoreBreakdown from "./components/ScoreBreakdown";
import "./App.css"


const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://word-ladder-adventure-production.up.railway.app";


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
    sessionId: "", // Add this line
    bannedWords: [],
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
  const [error, setError] = useState(null); // Add this with other state declarations
  const [isMoveLoading, setIsMoveLoading] = useState(false);
  const [loadingHint, setLoadingHint] = useState(null); // 'ucs', 'gbfs', 'astar', or null
  const [optimalPath, setOptimalPath] = useState([]);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [hintsUsedThisTurn, setHintsUsedThisTurn] = useState([]);

  // Calculate percentage similarity between two words (0-100)
  const calculateWordSimilarity = (current, target) => {
    if (!current || !target || current.length !== target.length) return 0;

    let matchingLetters = 0;
    for (let i = 0; i < current.length; i++) {
      if (current[i] === target[i]) matchingLetters++;
    }
    return Math.round((matchingLetters / current.length) * 100);
  };

  const startGame = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Frontend validation for custom games
    if (gameType === "custom") {
      if (!customStartWord || !customEndWord) {
        setError("Please enter both start and end words");
        setIsLoading(false);
        return;
      }
      if (customStartWord.length !== customEndWord.length) {
        setError("Start and end words must be the same length");
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = `${API_BASE_URL}/api/start-game`;
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
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to start game. Please try different words.");
      }

      const data = await response.json();
      // console.log("Game start response:", data);

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
        sessionId: data.sessionId,
        bannedWords: data.bannedWords || [],
      });
      // console.log("Current banned words:", data.bannedWords);  // Add this line
      setOptimalPath(data.optimalPath || []);
      setValidWords(data.validMoves);
      setShowInstructions(false);
      setMessage({
        type: "success",
        text: `Transform "${data.startWord}" into "${data.endWord}" in ${data.movesLimit} moves or less.`,
      });
    } catch (error) {
      console.error("Error starting game:", error);
      setError(error.message || "Failed to start the game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Make a move
  const makeMove = async (word) => {
    if (gameState.gameStatus !== "playing") return;

    setError(null); // Clear previous errors
    setIsMoveLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/make-move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWord: gameState.currentWord,
          nextWord: word.toLowerCase(),
          endWord: gameState.endWord,
          session_id: gameState.sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.detail && errorData.detail.includes("banned")) {
          throw new Error(`"${word}" is a banned word and cannot be used`);
        }

        throw new Error(errorData.detail || "Invalid move. Please try a different word.");
      }

      const data = await response.json();

      const newPath = [...gameState.path, word];
      const newMovesTaken = gameState.movesTaken + 1;
      let newGameStatus = gameState.gameStatus;
      let newScore = gameState.score;

      if (word === gameState.endWord) {
        newGameStatus = "won";
        newScore = data.score; // Updated this line - score is now a number
        setScoreBreakdown({
          max_score: 100,
          move_penalty: (newMovesTaken - gameState.optimalMoves) * 10,
          hint_penalty: gameState.hintsUsed * 5,
          final_score: data.score,
          optimal_moves: gameState.optimalMoves,
          your_moves: newMovesTaken
        });
        setMessage({
          type: "success",
          text: `Congratulations! You won with a score of ${data.score}!`,
        });
      } else if (newMovesTaken >= gameState.movesLimit) {
        newGameStatus = "lost";
        setMessage({
          type: "error",
          text: "Game Over! You've reached the move limit.",
        });
      }

      setGameState({
        ...gameState,
        currentWord: word,
        path: newPath,
        movesTaken: newMovesTaken,
        gameStatus: newGameStatus,
        score: newScore,
      });

      setValidWords(data.validMoves || []);
      setNextWordInput("");
      setHintsUsedThisTurn([]);

    } catch (error) {
      console.error("Move error:", error);
      setError(error.message);
    } finally {
      setIsMoveLoading(false);
    }
  };

  // Get hint
  const getHint = async (algorithm) => {
    if (gameState.gameStatus !== "playing") return;

    setLoadingHint(algorithm);

    try {
      const response = await fetch(`${API_BASE_URL}/api/hint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWord: gameState.currentWord,
          endWord: gameState.endWord,
          algorithm,
          session_id: gameState.sessionId, // Add this line
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to get hint");
      }

      const data = await response.json();

      setGameState({
        ...gameState,
        hintsUsed: gameState.hintsUsed + 1,
      });

      setHintsUsedThisTurn([...hintsUsedThisTurn, algorithm]);

      setMessage({
        type: "info",
        text: `Hint (${algorithm.toUpperCase()}): Try the word "${data.hint}"`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to get a hint. Please try again.",
      });
    } finally {
      setLoadingHint(null); // Reset loading state
    }
  };

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
      sessionId: "", // Add this line
    });
    setValidWords([]);
    setNextWordInput("");
    setShowInstructions(true);
    setMessage(null);
    setHintsUsedThisTurn([]);
  };

  // Handle word input submission
  const handleWordSubmit = (e) => {
    e.preventDefault();
    const submittedWord = nextWordInput.toLowerCase().trim();

    // Clear previous messages and errors
    setError(null);
    setMessage(null);

    // Frontend validation
    if (!submittedWord) {
      setError("Please enter a word");
      return;
    }

    if (gameState.currentWord === submittedWord) {
      setError("Cannot stay on the same word. Please change one letter.");
      return;
    }

    if (submittedWord.length !== gameState.currentWord.length) {
      setError(`Word must be exactly ${gameState.currentWord.length} letters long`);
      return;
    }

    // Add banned words check
    if (gameState.bannedWords.includes(submittedWord)) {
      setError(`"${submittedWord}" is a banned word and cannot be used`);
      return;
    }

    makeMove(submittedWord);
  };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
//       <div className="max-w-4xl mx-auto">
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text animate-gradient">
//             Word Ladder Adventure
//           </h1>
//           <p className="text-gray-300">Transform one word into another, one letter at a time!</p>
//         </header>

//         <div className="space-y-4 mb-4">
//           {error && (
//             <div className="p-4 rounded-lg bg-red-900/50 border border-red-500">
//               {error}
//             </div>
//           )}
//           {message && (
//             <div
//               className={`p-4 rounded-lg border transition-all duration-300 ${message.type === "error"
//                 ? "bg-red-900/50 border-red-500"
//                 : message.type === "success"
//                   ? "bg-green-900/50 border-green-500"
//                   : "bg-blue-900/50 border-blue-500"
//                 }`}
//             >
//               {message.text}
//             </div>
//           )}
//         </div>

//         {showInstructions ? (
//           <Instructions onStartClick={() => setShowInstructions(false)} />
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2">
//               <Card>
//                 <CardHeader>
//                   <div className="flex justify-between items-center">
//                     <CardTitle>Game Board</CardTitle>
//                     <div className="flex space-x-2">
//                       <Badge variant="outline">
//                         Moves: {gameState.movesTaken}/{gameState.movesLimit}
//                       </Badge>
//                       <Badge variant="outline">Hints: {gameState.hintsUsed}</Badge>
//                     </div>
//                   </div>
//                   <CardDescription>
//                     Transform <span className="font-bold text-green-400">{gameState.startWord}</span> into{" "}
//                     <span className="font-bold text-red-400">{gameState.endWord}</span>
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <GameBoard
//                     startWord={gameState.startWord}
//                     endWord={gameState.endWord}
//                     currentWord={gameState.currentWord}
//                     gameStatus={gameState.gameStatus}
//                   />

//                   <div className="mt-6">
//                     <div className="mb-2 flex justify-between">
//                       <span>Progress</span>
//                       <span>
//                         {gameState.gameStatus === "won"
//                           ? "100%"
//                           : `${calculateWordSimilarity(gameState.currentWord, gameState.endWord)}%`
//                         }
//                       </span>
//                     </div>
//                     <Progress
//                       value={
//                         gameState.gameStatus === "won"
//                           ? 100
//                           : calculateWordSimilarity(gameState.currentWord, gameState.endWord)
//                       }
//                     />
//                   </div>
//                   {gameState.gameStatus === "playing" && (
//                     <>
//                       <form onSubmit={handleWordSubmit} className="mt-6">
//                         <div className="flex space-x-2">
//                           <Input
//                             value={nextWordInput}
//                             onChange={(e) => setNextWordInput(e.target.value)}
//                             placeholder="Enter next word..."
//                           />
//                           <Button type="submit" disabled={isMoveLoading}>
//                             {isMoveLoading ? "Processing..." : "Submit"}
//                           </Button>
//                         </div>
//                       </form>

//                       <div className="mt-4">
//                         <p className="mb-2 text-sm text-gray-400">Need a hint?</p>
//                         <div className="flex space-x-2">
//                           {["ucs", "gbfs", "astar"].map((algorithm) => (
//                             <Button
//                               key={algorithm}
//                               variant="outline"
//                               size="sm"
//                               onClick={() => getHint(algorithm)}
//                               disabled={loadingHint !== null || hintsUsedThisTurn.includes(algorithm)}
//                             >
//                               {loadingHint === algorithm ? "Loading..." : `${algorithm.toUpperCase()} Hint`}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {(gameState.gameStatus === "won" || gameState.gameStatus === "lost") && (
//                     <div className="mt-6">
//                       <div className={`p-4 rounded-lg ${gameState.gameStatus === "won"
//                         ? "bg-green-900/30 border border-green-500"
//                         : "bg-red-900/30 border border-red-500"}`}
//                       >
//                         <h3 className="text-xl font-bold mb-2">
//                           {gameState.gameStatus === "won" ? "Congratulations!" : "Game Over"}
//                         </h3>
//                         <p>
//                           {gameState.gameStatus === "won"
//                             ? `You won with a score of ${gameState.score}!`
//                             : "You've reached the move limit. Try again!"}
//                         </p>

//                         {gameState.gameStatus === "won" && scoreBreakdown && (
//                           <>
//                             <ScoreBreakdown scoreData={scoreBreakdown} />
//                             <div className="mt-4">
//                               <h4 className="font-medium mb-1">Optimal Solution:</h4>
//                               <div className="flex flex-wrap gap-1">
//                                 {optimalPath.map((word, index) => (
//                                   <span key={index} className="px-2 py-1 bg-gray-700 rounded">
//                                     {word}
//                                     {index < optimalPath.length - 1 && (
//                                       <span className="mx-1 text-gray-400">→</span>
//                                     )}
//                                   </span>
//                                 ))}
//                               </div>
//                               <p className="mt-2 text-sm text-gray-300">
//                                 Optimal moves: {optimalPath.length - 1}, Your moves: {gameState.movesTaken}
//                               </p>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       <Button className="w-full mt-4" onClick={resetGame}>
//                         Play Again
//                       </Button>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             <div>
//               <Card className="mb-6">
//                 <CardHeader>
//                   <CardTitle>Your Path</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <WordPath path={gameState.path} />
//                 </CardContent>
//               </Card>

//               {/* Add this in the right column where other game info is displayed */}
//               {gameState.gameStatus === "playing" && gameMode === "advanced" && gameState.bannedWords.length > 0 && (
//                 <Card className="mb-6">
//                   <CardHeader>
//                     <CardTitle>🚫 Banned Words</CardTitle>
//                     <CardDescription>
//                       These words cannot be used in your solution
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex flex-wrap gap-2">
//                       {gameState.bannedWords.map((word, index) => (
//                         <Badge key={index} variant="destructive" className="font-mono">
//                           {word}
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="mt-2 text-sm text-gray-400">
//                       Using a banned word will result in an invalid move.
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}

//               {gameState.gameStatus === "idle" && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Game Setup</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="mb-2 font-medium">Game Type</h3>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant={gameType === "challenge" ? "default" : "outline"}
//                             className="flex-1"
//                             onClick={() => setGameType("challenge")}
//                           >
//                             Challenge
//                           </Button>
//                           <Button
//                             variant={gameType === "custom" ? "default" : "outline"}
//                             className="flex-1"
//                             onClick={() => setGameType("custom")}
//                           >
//                             Custom
//                           </Button>
//                         </div>
//                       </div>

//                       {gameType === "challenge" ? (
//                         <div>
//                           <h3 className="mb-2 font-medium">Select Difficulty</h3>
//                           <div className="space-y-2">
//                             {[
//                               { value: "beginner", label: "Beginner", moves: 5 },
//                               { value: "intermediate", label: "Intermediate", moves: 7 },
//                               { value: "advanced", label: "Advanced", moves: 10 },
//                             ].map(({ value, label, moves }) => (
//                               <Button
//                                 key={value}
//                                 variant={gameMode === value ? "default" : "outline"}
//                                 className="w-full justify-between"
//                                 onClick={() => setGameMode(value)}
//                               >
//                                 <span>{label}</span>
//                                 <Badge variant="secondary" className="ml-2">
//                                   {moves} moves
//                                 </Badge>
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium mb-1">Start Word</label>
//                             <Input
//                               value={customStartWord}
//                               onChange={(e) => setCustomStartWord(e.target.value)}
//                               placeholder="Enter start word"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium mb-1">End Word</label>
//                             <Input
//                               value={customEndWord}
//                               onChange={(e) => setCustomEndWord(e.target.value)}
//                               placeholder="Enter end word"
//                             />
//                           </div>
//                         </div>
//                       )}

//                       <Button
//                         className="w-full"
//                         onClick={startGame}
//                         disabled={isLoading || (gameType === "custom" && (!customStartWord || !customEndWord))}
//                       >
//                         {isLoading ? "Loading..." : "Start Game"}
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-2 sm:p-4 lg:p-6">
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text animate-gradient">
          Word Ladder Adventure
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-300">
          Transform one word into another, one letter at a time!
        </p>
      </header>

      <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-2 sm:mb-3 lg:mb-4">
        {error && (
          <div className="p-2 sm:p-3 lg:p-4 rounded-lg bg-red-900/50 border border-red-500 text-xs sm:text-sm lg:text-base">
            {error}
          </div>
        )}
        {message && (
          <div
            className={`p-2 sm:p-3 lg:p-4 rounded-lg border transition-all duration-300 text-xs sm:text-sm lg:text-base ${
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
      </div>

      {showInstructions ? (
        <Instructions onStartClick={() => setShowInstructions(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 sm:gap-2">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Game Board</CardTitle>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      Moves: {gameState.movesTaken}/{gameState.movesLimit}
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      Hints: {gameState.hintsUsed}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-xs sm:text-sm lg:text-base">
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

                <div className="mt-3 sm:mt-4 lg:mt-6">
                  <div className="mb-1 sm:mb-2 flex justify-between text-xs sm:text-sm lg:text-base">
                    <span>Progress</span>
                    <span>
                      {gameState.gameStatus === "won"
                        ? "100%"
                        : `${calculateWordSimilarity(gameState.currentWord, gameState.endWord)}%`
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      gameState.gameStatus === "won"
                        ? 100
                        : calculateWordSimilarity(gameState.currentWord, gameState.endWord)
                    }
                  />
                </div>

                {gameState.gameStatus === "playing" && (
                  <>
                    <form onSubmit={handleWordSubmit} className="mt-3 sm:mt-4 lg:mt-6">
                      <div className="flex flex-col xs:flex-row gap-2">
                        <Input
                          value={nextWordInput}
                          onChange={(e) => setNextWordInput(e.target.value)}
                          placeholder="Enter next word..."
                          className="flex-1 text-xs sm:text-sm lg:text-base"
                        />
                        <Button 
                          type="submit" 
                          disabled={isMoveLoading}
                          className="w-full xs:w-auto text-xs sm:text-sm"
                        >
                          {isMoveLoading ? "Processing..." : "Submit"}
                        </Button>
                      </div>
                    </form>

                    <div className="mt-2 sm:mt-3 lg:mt-4">
                      <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-400">Need a hint?</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {["ucs", "gbfs", "astar"].map((algorithm) => (
                          <Button
                            key={algorithm}
                            variant="outline"
                            size="sm"
                            onClick={() => getHint(algorithm)}
                            disabled={loadingHint !== null || hintsUsedThisTurn.includes(algorithm)}
                            className="text-xs sm:text-sm flex-1 min-w-[100px]"
                          >
                            {loadingHint === algorithm ? "Loading..." : `${algorithm.toUpperCase()} Hint`}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {(gameState.gameStatus === "won" || gameState.gameStatus === "lost") && (
                  <div className="mt-3 sm:mt-4 lg:mt-6">
                    <div className={`p-3 sm:p-4 rounded-lg ${
                      gameState.gameStatus === "won"
                        ? "bg-green-900/30 border border-green-500"
                        : "bg-red-900/30 border border-red-500"
                    }`}>
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                        {gameState.gameStatus === "won" ? "Congratulations!" : "Game Over"}
                      </h3>
                      <p className="text-sm sm:text-base">
                        {gameState.gameStatus === "won"
                          ? `You won with a score of ${gameState.score}!`
                          : "You've reached the move limit. Try again!"}
                      </p>

                      {gameState.gameStatus === "won" && scoreBreakdown && (
                        <>
                          <ScoreBreakdown scoreData={scoreBreakdown} />
                          <div className="mt-2 sm:mt-3 lg:mt-4">
                            <h4 className="font-medium mb-1 text-sm sm:text-base">Optimal Solution:</h4>
                            <div className="flex flex-wrap gap-1">
                              {optimalPath.map((word, index) => (
                                <span key={index} className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-700 rounded text-xs sm:text-sm">
                                  {word}
                                  {index < optimalPath.length - 1 && (
                                    <span className="mx-1 text-gray-400">→</span>
                                  )}
                                </span>
                              ))}
                            </div>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-300">
                              Optimal moves: {optimalPath.length - 1}, Your moves: {gameState.movesTaken}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <Button className="w-full mt-2 sm:mt-3 lg:mt-4" onClick={resetGame}>
                      Play Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg lg:text-xl">Your Path</CardTitle>
              </CardHeader>
              <CardContent>
                <WordPath path={gameState.path} />
              </CardContent>
            </Card>

            {gameState.gameStatus === "playing" && gameMode === "advanced" && gameState.bannedWords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">🚫 Banned Words</CardTitle>
                  <CardDescription className="text-xs sm:text-sm lg:text-base">
                    These words cannot be used in your solution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {gameState.bannedWords.map((word, index) => (
                      <Badge 
                        key={index} 
                        variant="destructive" 
                        className="font-mono text-xs sm:text-sm"
                      >
                        {word}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
                    Using a banned word will result in an invalid move.
                  </p>
                </CardContent>
              </Card>
            )}

            {gameState.gameStatus === "idle" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Game Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div>
                      <h3 className="mb-1 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Game Type</h3>
                      <div className="flex space-x-1 sm:space-x-2">
                        <Button
                          variant={gameType === "challenge" ? "default" : "outline"}
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => setGameType("challenge")}
                        >
                          Challenge
                        </Button>
                        <Button
                          variant={gameType === "custom" ? "default" : "outline"}
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => setGameType("custom")}
                        >
                          Custom
                        </Button>
                      </div>
                    </div>

                    {gameType === "challenge" ? (
                      <div>
                        <h3 className="mb-1 sm:mb-2 font-medium text-xs sm:text-sm lg:text-base">Select Difficulty</h3>
                        <div className="space-y-1 sm:space-y-2">
                          {[
                            { value: "beginner", label: "Beginner", moves: 5 },
                            { value: "intermediate", label: "Intermediate", moves: 7 },
                            { value: "advanced", label: "Advanced", moves: 10 },
                          ].map(({ value, label, moves }) => (
                            <Button
                              key={value}
                              variant={gameMode === value ? "default" : "outline"}
                              className="w-full justify-between text-xs sm:text-sm"
                              onClick={() => setGameMode(value)}
                            >
                              <span>{label}</span>
                              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xxs sm:text-xs">
                                {moves} moves
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Start Word</label>
                          <Input
                            value={customStartWord}
                            onChange={(e) => setCustomStartWord(e.target.value)}
                            placeholder="Enter start word"
                            className="text-xs sm:text-sm lg:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">End Word</label>
                          <Input
                            value={customEndWord}
                            onChange={(e) => setCustomEndWord(e.target.value)}
                            placeholder="Enter end word"
                            className="text-xs sm:text-sm lg:text-base"
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full text-xs sm:text-sm lg:text-base"
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