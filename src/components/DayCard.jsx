import { Link } from "react-router-dom";
import { FiCheckCircle, FiPlay, FiClock, FiArrowRight, FiLock } from "react-icons/fi";
import { getDayProblemStats, isDayCompleted } from "../utils/progress.js";
import { cn } from "../utils/helpers.js";

export default function DayCard({ day, data, isCurrent, locked }) {
  const completed = isDayCompleted(data, day.day);
  const stats = getDayProblemStats(data, day);
  const isRevision = day.type === "revision";
  const isSimulation = day.type === "simulation";
  const isMixed = day.type === "mixed";
  const isFinal = day.type === "final-revision";
  const hasProblems = stats.total > 0;
  const countLabel = isRevision || isFinal ? "Revision" : isSimulation ? "Simulation" : isMixed ? "Mixed Set" : `${stats.total} Problems`;

  const linkTo = isSimulation ? "/placement" : `/day/${day.day}`;

  const status = completed
    ? { label: "Completed", icon: FiCheckCircle, tone: "done" }
    : locked
      ? { label: "Locked", icon: FiLock, tone: "locked" }
      : isCurrent
        ? { label: "Current", icon: FiPlay, tone: "current" }
        : { label: "Upcoming", icon: FiClock, tone: "upcoming" };

  const content = (
    <>
      <div className="day-card-top">
        <span className="day-number">Day {day.day}</span>
        <span className={cn("day-status-chip", status.tone)}>
          <status.icon />
          {status.label}
        </span>
      </div>
      <h3 className="day-topic">{day.topic}</h3>
      <p className="day-count">{countLabel}</p>
      {hasProblems && (
        <div className="day-progress">
          <span>
            Progress: {stats.solved} / {stats.total}
          </span>
          <div className="progress progress-sm">
            <div className="progress-fill" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
      )}
      <span className="day-cta">
        {completed ? "Review day" : locked ? "Unlocks tomorrow" : isCurrent ? "Start today" : "Open day"}
        <FiArrowRight />
      </span>
    </>
  );

  if (locked) {
    return <div className={cn("day-card", status.tone)}>{content}</div>;
  }

  return (
    <Link to={linkTo} state={{ from: "/roadmap" }} className={cn("day-card", status.tone, isCurrent && "current")}>
      {content}
    </Link>
  );
}
