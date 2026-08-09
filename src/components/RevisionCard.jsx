import { Link } from "react-router-dom";
import { FiBookmark, FiArrowRight } from "react-icons/fi";
import DifficultyBadge from "./DifficultyBadge.jsx";
import EmptyState from "./EmptyState.jsx";

export default function RevisionCard({ problems, title, subtitle, emptyText }) {
  if (!problems || problems.length === 0) {
    return <EmptyState icon={FiBookmark} title={title} text={emptyText || "No problems flagged for revision right now."} />;
  }
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="revision-list">
        {problems.map((problem) => (
          <Link to={`/problem/${problem.progressKey}`} key={problem.progressKey} className="revision-item">
            <span className="revision-number">{problem.number}</span>
            <span className="revision-title">{problem.title}</span>
            <DifficultyBadge difficulty={problem.difficulty} />
            <FiArrowRight className="revision-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}
