import { FiZap, FiAward } from "react-icons/fi";

export default function StreakCard({ streak, compact = false }) {
  if (compact) {
    return (
      <div className="streak-compact">
        <FiZap className="streak-flame" />
        <span>
          <strong>{streak.current}</strong> Day Streak
        </span>
      </div>
    );
  }
  return (
    <div className="streak-card">
      <div className="streak-item">
        <FiZap className="streak-flame" />
        <div>
          <strong>{streak.current}</strong>
          <span>Current streak</span>
        </div>
      </div>
      <div className="streak-divider" />
      <div className="streak-item">
        <FiAward className="streak-award" />
        <div>
          <strong>{streak.longest}</strong>
          <span>Longest streak</span>
        </div>
      </div>
    </div>
  );
}
