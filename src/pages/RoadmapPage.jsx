import { FiMap, FiCalendar, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { getCourse } from "../data/roadmap.js";
import { calculateProgress, getCurrentDay, canStartDay, getDayCompletedToday, isCourseStarted } from "../utils/progress.js";
import DayCard from "../components/DayCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function RoadmapPage({ readOnly = false }) {
  const { data } = useApp();
  const course = getCourse(data.settings.course);
  const roadmap = course.roadmap;
  const progress = calculateProgress(data, course);
  const currentDayNumber = getCurrentDay(data, course).day;
  const started = isCourseStarted(data, course.id);

  const note = readOnly
    ? `${course.totalDays} days planned across the ${course.title}.`
    : !started
      ? "Start the challenge to begin tracking — Day 1 unlocks when you press Start."
      : progress.challengeComplete
        ? "🏆 All days completed — congratulations!"
        : `You're currently on Day ${currentDayNumber}.`;

  return (
    <>
      <PageHeader
        title={`${course.totalDays}-Day Roadmap`}
        subtitle={readOnly ? "A read-only overview of the full plan." : "Follow the plan day by day. Review any previous day at any time."}
      />

      <div className="roadmap-summary card">
        <div className="roadmap-summary-head">
          <span>
            <FiCalendar />
            {progress.daysCompleted} / {course.totalDays} days completed
          </span>
          <strong>{Math.round(progress.daysPercent)}%</strong>
        </div>
        <ProgressBar percent={progress.daysPercent} />
        <p className="roadmap-summary-note">{note}</p>
      </div>

      {!readOnly && !started && (
        <div className="roadmap-lock-note">
          <FiLock />
          <span>
            The roadmap is locked until you start.{" "}
            <Link to="/" className="link-inline">Start the challenge</Link> to unlock Day 1.
          </span>
        </div>
      )}

      {!readOnly && started && getDayCompletedToday(data, course.id) !== null && (
        <div className="roadmap-lock-note">
          <FiLock />
          <span>
            One day per calendar day — you already completed a day today. Days after it unlock tomorrow.
          </span>
        </div>
      )}

      <div className="roadmap-grid">
        {roadmap.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            data={data}
            readOnly={readOnly}
            isCurrent={day.day === currentDayNumber}
            locked={!started || !canStartDay(data, day)}
          />
        ))}
      </div>
    </>
  );
}
