export default function ScoreBreakdown({ scoreData }) {
    return (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Maximum Possible Score:</span>
          <span>{scoreData.max_score}</span>
        </div>
        <div className="flex justify-between text-yellow-400">
          <span>Penalty for Extra Moves ({scoreData.your_moves - scoreData.optimal_moves} moves × 10 points):</span>
          <span>-{scoreData.move_penalty}</span>
        </div>
        <div className="flex justify-between text-blue-400">
          <span>Penalty for Hints Used ({scoreData.hint_penalty / 5} hints × 5 points):</span>
          <span>-{scoreData.hint_penalty}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Final Score:</span>
          <span>{scoreData.final_score}</span>
        </div>
      </div>
    );
  }