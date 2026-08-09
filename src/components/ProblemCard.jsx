import { FiCheck, FiCircle, FiStar, FiExternalLink, FiTrash2 } from "react-icons/fi";
import DifficultyBadge from "./DifficultyBadge.jsx";
import { cn } from "../utils/helpers.js";

const leetcodeUrl = (slug) => `https://leetcode.com/problems/${slug}/`;

export default function ProblemCard({
  problem,
  solved,
  review,
  note,
  onToggleSolved,
  onToggleReview,
  onClearNote,
  onNoteChange
}) {
  return (
    <div className={cn("problem-card", solved && "solved")}>
      <div className="problem-head">
        <span className="problem-number">{problem.number}</span>
        <div className="problem-title">
          <h4>{problem.title}</h4>
          <div className="problem-meta">
            <DifficultyBadge difficulty={problem.difficulty} />
            {problem.topic && <span className="topic-chip">{problem.topic}</span>}
          </div>
        </div>
        {solved && <FiCheck className="problem-solved-icon" />}
      </div>

      <div className="problem-actions">
        {problem.slug && (
          <a
            href={leetcodeUrl(problem.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <FiExternalLink />
            Open LeetCode
          </a>
        )}
        <button
          onClick={onToggleSolved}
          className={cn("btn btn-sm", solved ? "btn-outline" : "btn-primary")}
        >
          {solved ? <FiCheck /> : <FiCircle />}
          {problem.courseId === "react" ? (solved ? "Mark Undone" : "Mark Done") : (solved ? "Mark Unsolved" : "Mark Solved")}
        </button>
        <button
          onClick={onToggleReview}
          className={cn("btn btn-sm btn-soft-warning", review && "active")}
          title="Mark for review"
        >
          <FiStar />
          {review ? "In Review" : "For Review"}
        </button>
      </div>

      <div className="problem-notes">
        <textarea
          value={note || ""}
          placeholder='Personal notes (saved automatically) — e.g. "I initially used nested loops. Need to revise the O(n) approach."'
          onChange={(e) => onNoteChange(e.target.value)}
          rows={2}
        />
        {note && (
          <button className="btn btn-ghost btn-sm btn-icon-only note-clear" onClick={onClearNote} title="Clear notes">
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}
