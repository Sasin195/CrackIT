import { FiMap, FiCalendar, FiLock } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import { ROADMAP, TOTAL_DAYS } from "../data/roadmap.js";
import { calculateProgress, getCurrentDay, canStartDay, getDayCompletedToday } from "../utils/progress.js";
import DayCard from "../components/DayCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function RoadmapPage() {
  const { data } = useApp();
  const progress = calculateProgress(data);
  const currentDayNumber = getCurrentDay(data).day;

  return (
    <>
      <PageHeader
        title="45-Day Roadmap"
        subtitle="Follow the plan day by day. Review any previous day at any time."
      />

      <div className="roadmap-summary card">
        <div className="roadmap-summary-head">
          <span>
            <FiCalendar />
            {progress.daysCompleted} / {TOTAL_DAYS} days completed
          </span>
          <strong>{Math.round(progress.daysPercent)}%</strong>
        </div>
        <ProgressBar percent={progress.daysPercent} />
        <p className="roadmap-summary-note">
          {progress.challengeComplete
            ? "🏆 All 45 days completed — congratulations!"
            : `You're currently on Day ${currentDayNumber}.`}
        </p>
      </div>

      {getDayCompletedToday(data) !== null && (
        <div className="roadmap-lock-note">
          <FiLock />
          <span>
            One day per calendar day — you already completed a day today. Days after it unlock tomorrow.
          </span>
        </div>
      )}

      <div className="roadmap-grid">
        {ROADMAP.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            data={data}
            isCurrent={day.day === currentDayNumber}
            locked={!canStartDay(data, day.day)}
          />
        ))}
      </div>
    </>
  );
}
