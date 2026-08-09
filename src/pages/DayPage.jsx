import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiCheckCircle,
  FiStar,
  FiExternalLink,
  FiFlag,
  FiRefreshCw,
  FiThumbsUp,
  FiBookmark,
  FiCalendar,
  FiChevronLeft,
  FiTrash2
} from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import { ROADMAP, getDayProblems } from "../data/roadmap.js";
import {
  isProblemSolved,
  isProblemReview,
  isDayCompleted,
  getDayProblemStats,
  getRevisionProblems,
  getDayWeakProblems,
  getHardestProblems
} from "../utils/progress.js";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import ProblemCard from "../components/ProblemCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";

const leetcodeUrl = (slug) => `https://leetcode.com/problems/${slug}/`;

function RevisionItem({ problem, data, onReSolved, onUnderstood, onKeep, onNoteChange, onClearNote }) {
  const solved = isProblemSolved(data, problem.progressKey);
  const note = data.notes[problem.progressKey] || "";
  return (
    <div className="problem-card revision-item-card">
      <div className="problem-head">
        <span className="problem-number">{problem.number}</span>
        <div className="problem-title">
          <h4>{problem.title}</h4>
          <div className="problem-meta">
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="topic-chip">{problem.topic}</span>
          </div>
        </div>
        {solved && <FiCheckCircle className="problem-solved-icon" />}
      </div>
      <div className="problem-actions">
        <a href={leetcodeUrl(problem.slug)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
          <FiExternalLink />
          Open LeetCode
        </a>
        <button onClick={() => onReSolved(problem)} className="btn btn-primary btn-sm">
          <FiCheckCircle />
          Mark Re-solved
        </button>
        <button onClick={() => onUnderstood(problem)} className="btn btn-soft-success btn-sm">
          <FiThumbsUp />
          Understood
        </button>
        <button onClick={() => onKeep(problem)} className="btn btn-soft-warning btn-sm">
          <FiBookmark />
          Keep for Review
        </button>
      </div>
      <div className="problem-notes">
        <textarea
          value={note}
          placeholder="Revision notes (saved automatically)..."
          onChange={(e) => onNoteChange(problem, e.target.value)}
          rows={2}
        />
        {note && (
          <button className="btn btn-ghost btn-sm btn-icon-only note-clear" onClick={() => onClearNote(problem)} title="Clear notes">
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}

export default function DayPage() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { data, setProblemSolved, setProblemReview, saveNote, completeDay, uncompleteDay, markUnderstood } = useApp();

  const day = ROADMAP.find((d) => d.day === Number(dayNumber));

  const rawProblems = useMemo(() => {
    if (!day) return [];
    if (day.type === "mixed") {
      return getDayWeakProblems(data, day.day, 3);
    }
    if (day.type === "final-revision") {
      return getHardestProblems(data, 10);
    }
    return getDayProblems(day);
  }, [day, data]);

  const problems = useMemo(
    () =>
      day?.type === "mixed"
        ? rawProblems.map((prob, index) => ({ ...prob, progressKey: `day${day.day}-problem${index + 1}` }))
        : rawProblems,
    [day, rawProblems]
  );

  const revisionProblems = useMemo(() => getRevisionProblems(data, 5), [data]);

  useEffect(() => {
    if (day?.type === "simulation") {
      navigate("/placement", { replace: true });
    }
  }, [day, navigate]);

  if (!day) {
    return (
      <EmptyState
        icon={FiCalendar}
        title="Day not found"
        text="This day doesn't exist in the roadmap."
        action={
          <Link to="/roadmap" className="btn btn-primary">
            Back to Roadmap
          </Link>
        }
      />
    );
  }

  if (day.type === "simulation") {
    return null;
  }

  const completed = isDayCompleted(data, day.day);
  const isRevision = day.type === "revision";
  const isFinal = day.type === "final-revision";
  const isMixed = day.type === "mixed";

  const dayStats = getDayProblemStats(data, { ...day, problems });

  const toggleSolved = (problem) => {
    setProblemSolved(problem.progressKey, !isProblemSolved(data, problem.progressKey));
  };

  const toggleReview = (problem) => {
    setProblemReview(problem.progressKey, !isProblemReview(data, problem.progressKey));
  };

  const handleCompleteDay = () => {
    if (completed) uncompleteDay(day.day);
    else completeDay(day.day, "manual");
  };

  return (
    <>
      <div className="back-link">
        <Link to="/roadmap">
          <FiChevronLeft />
          Back to Roadmap
        </Link>
      </div>

      <PageHeader
        title={`Day ${day.day}`}
        subtitle={`${day.topic}${day.description ? ` — ${day.description}` : ""}`}
        actions={
          <span className={`chip ${completed ? "chip-success" : "chip-upcoming"}`}>
            {completed ? <FiCheckCircle /> : <FiFlag />}
            {completed ? "Completed" : day.type === "revision" ? "Revision Day" : day.type === "final-revision" ? "Final Revision" : "In Progress"}
          </span>
        }
      />

      <div className="day-summary card">
        <div className="day-summary-row">
          <span>
            Progress: <strong>{dayStats.solved} / {dayStats.total}</strong> Completed
          </span>
          <strong>{Math.round(dayStats.percent)}%</strong>
        </div>
        <ProgressBar percent={dayStats.percent} />
        <div className="day-summary-actions">
          <button className={`btn ${completed ? "btn-outline" : "btn-primary"}`} onClick={handleCompleteDay}>
            {completed ? <FiRefreshCw /> : <FiCheckCircle />}
            {completed ? "Reopen Day" : "Mark Day Complete"}
          </button>
          {!completed && (
            <span className="day-summary-hint">
              {isRevision || isFinal
                ? "Finish your revision tasks to build consistency — then mark the day complete."
                : "Complete all problems to finish this day automatically — or mark it complete if you finished studying elsewhere."}
            </span>
          )}
        </div>
      </div>

      {isRevision && (
        <Card
          title="Today's Revision"
          subtitle="Problems you flagged for review. Re-solve them to lock them in."
          className="revision-section"
        >
          {revisionProblems.length === 0 ? (
            <EmptyState
              icon={FiBookmark}
              title="Nothing to revise yet"
              text="No problems are flagged for review. Mark problems as 'For Review' on any day to see them here."
            />
          ) : (
            <div className="problem-list">
              {revisionProblems.map((problem) => (
                <RevisionItem
                  key={problem.progressKey}
                  problem={problem}
                  data={data}
                  onReSolved={(prob) => {
                    setProblemSolved(prob.progressKey, true);
                    markUnderstood(prob.progressKey);
                  }}
                  onUnderstood={(prob) => markUnderstood(prob.progressKey)}
                  onKeep={() => setProblemReview(problem.progressKey, true)}
                  onNoteChange={(prob, text) => saveNote(prob.progressKey, text)}
                  onClearNote={(prob) => saveNote(prob.progressKey, "")}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {isMixed && (
        <Card title="Weak Topic Focus" subtitle="3 problems picked from your current weak topics.">
          {problems.length === 0 ? (
            <EmptyState icon={FiStar} title="No weak problems found" text="Solve more problems and this day will fill with recommendations." />
          ) : (
            <div className="problem-list">
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.progressKey}
                  problem={problem}
                  solved={isProblemSolved(data, problem.progressKey)}
                  review={isProblemReview(data, problem.progressKey)}
                  note={data.notes[problem.progressKey]}
                  onToggleSolved={() => toggleSolved(problem)}
                  onToggleReview={() => toggleReview(problem)}
                  onClearNote={() => saveNote(problem.progressKey, "")}
                  onNoteChange={(text) => saveNote(problem.progressKey, text)}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {isFinal && (
        <Card title="Redo 10 Hardest Problems" subtitle="Your hardest and most-flagged problems one last time before placements.">
          <div className="problem-list">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.progressKey}
                problem={problem}
                solved={isProblemSolved(data, problem.progressKey)}
                review={isProblemReview(data, problem.progressKey)}
                note={data.notes[problem.progressKey]}
                onToggleSolved={() => toggleSolved(problem)}
                onToggleReview={() => toggleReview(problem)}
                onClearNote={() => saveNote(problem.progressKey, "")}
                onNoteChange={(text) => saveNote(problem.progressKey, text)}
              />
            ))}
          </div>
        </Card>
      )}

      {!isRevision && !isMixed && !isFinal && (
        <div className="problem-list">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.progressKey}
              problem={problem}
              solved={isProblemSolved(data, problem.progressKey)}
              review={isProblemReview(data, problem.progressKey)}
              note={data.notes[problem.progressKey]}
              onToggleSolved={() => toggleSolved(problem)}
              onToggleReview={() => toggleReview(problem)}
              onClearNote={() => saveNote(problem.progressKey, "")}
              onNoteChange={(text) => saveNote(problem.progressKey, text)}
            />
          ))}
        </div>
      )}

      <div className="day-footer">
        <Link to={`/day/${day.day - 1}`} className={`btn btn-ghost ${day.day <= 1 ? "disabled" : ""}`}>
          <FiChevronLeft />
          Day {day.day - 1}
        </Link>
        {day.day < 45 && (
          <Link to={`/day/${day.day + 1}`} className="btn btn-ghost">
            Day {day.day + 1}
            <FiChevronLeft style={{ transform: "rotate(180deg)" }} />
          </Link>
        )}
      </div>
    </>
  );
}
