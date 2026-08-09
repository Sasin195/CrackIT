import { DIFFICULTY_COLORS } from "../data/roadmap.js";

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className="difficulty-badge" style={{ color: DIFFICULTY_COLORS[difficulty] }}>
      <span className="difficulty-dot" style={{ background: DIFFICULTY_COLORS[difficulty] }} />
      {difficulty}
    </span>
  );
}
