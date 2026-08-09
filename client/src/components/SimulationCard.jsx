import { FiCheck, FiX, FiClock } from "react-icons/fi";
import DifficultyBadge from "./DifficultyBadge.jsx";
import { formatDate } from "../utils/helpers.js";

export default function SimulationCard({ simulation }) {
  const { score, total, accuracy, timeTaken, date, problems } = simulation;
  return (
    <div className="simulation-result-card">
      <div className="sim-result-head">
        <div>
          <span className="sim-date">{formatDate(date)}</span>
          <div className="sim-score">
            <strong>{score}</strong> / {total}
          </div>
        </div>
        <div className="sim-stats">
          <div className="sim-stat">
            <span>Accuracy</span>
            <strong>{accuracy}%</strong>
          </div>
          <div className="sim-stat">
            <span>Time</span>
            <strong>{timeTaken}</strong>
          </div>
        </div>
      </div>
      {problems && problems.length > 0 && (
        <div className="sim-problems">
          {problems.map((problem, index) => (
            <div className="sim-problem" key={index}>
              <span className="sim-problem-status solved">{problem.solved ? <FiCheck /> : <FiX />}</span>
              <span className="sim-problem-title">
                {problem.number} — {problem.title}
              </span>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          ))}
        </div>
      )}
      {timeTaken && (
        <div className="sim-time-row">
          <FiClock />
          <span>{timeTaken}</span>
        </div>
      )}
    </div>
  );
}
