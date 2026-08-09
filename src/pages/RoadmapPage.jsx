import { FiCalendar, FiCheck, FiClock } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import { getCourse } from "../data/roadmap.js";
import { calculateProgress, isProblemSolved } from "../utils/progress.js";
import ProgressBar from "../components/ProgressBar.jsx";
import PageHeader from "../components/PageHeader.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";

const TYPE_LABELS = {
  revision: "Revision",
  simulation: "Simulation",
  mixed: "Mixed",
  "final-revision": "Final Revision",
  final: "Final",
  project: "Project",
  learning: "Learning"
};

const TYPE_NOTES = {
  revision: "Revisit problems you flagged for review.",
  "final-revision": "Re-do your hardest and most-flagged problems.",
  final: "Re-do your hardest and most-flagged problems."
};

export default function RoadmapPage() {
  const { data } = useApp();
  const course = getCourse(data.settings.course);
  const progress = calculateProgress(data, course);

  return (
    <>
      <PageHeader title={`${course.totalDays}-Day Roadmap`} subtitle="All problems and tasks in the plan, day by day." />

      <div className="roadmap-summary card">
        <div className="roadmap-summary-head">
          <span>
            <FiCalendar />
            {progress.daysCompleted} / {course.totalDays} days completed
          </span>
          <strong>{Math.round(progress.daysPercent)}%</strong>
        </div>
        <ProgressBar percent={progress.daysPercent} />
      </div>

      <div className="roadmap-group-list">
        {course.roadmap.map((day) => {
          const problems = day.problems || [];
          const typeLabel = TYPE_LABELS[day.type];
          const typeNote = TYPE_NOTES[day.type];

          return (
            <div key={day.day} className="roadmap-group">
              <div className="roadmap-group-head">
                <span className="roadmap-day-label">Day {day.day}</span>
                <h3>{day.topic}</h3>
                {typeLabel && <span className="roadmap-day-type">{typeLabel}</span>}
              </div>

              {problems.length > 0 ? (
                <ul className="roadmap-problem-list">
                  {problems.map((problem) => {
                    const solved = isProblemSolved(data, problem.progressKey);
                    return (
                      <li key={problem.progressKey} className="roadmap-problem">
                        <span className="roadmap-problem-number">{problem.number}</span>
                        <span className="roadmap-problem-title">{problem.title}</span>
                        <DifficultyBadge difficulty={problem.difficulty} />
                        {problem.topic && <span className="topic-chip">{problem.topic}</span>}
                        {solved && <FiCheck className="roadmap-problem-done" />}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="roadmap-group-note">
                  <FiClock />
                  {typeNote || "No fixed tasks — this day depends on your progress."}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
