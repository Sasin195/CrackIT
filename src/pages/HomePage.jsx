import { Link } from "react-router-dom";
import {
  FiTarget,
  FiBookOpen,
  FiZap,
  FiCheckCircle,
  FiCircle,
  FiClock,
  FiStar,
  FiCalendar,
  FiArrowRight,
  FiAward,
  FiLock
} from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import {
  calculateProgress,
  isDayCompleted,
  getDayProblemStats,
  canStartDay
} from "../utils/progress.js";
import Card from "../components/Card.jsx";
import StatCard from "../components/StatCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StreakCard from "../components/StreakCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function HomePage() {
  const { data } = useApp();
  const progress = calculateProgress(data);
  const { currentDay, difficultyStats, daysPercent, daysCompleted, totalDays, problemsSolved, totalProblems, problemsToReview, challengeComplete } = progress;

  const todayStats = getDayProblemStats(data, currentDay);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="45-Day DSA Placement Prep — build DSA confidence for placements, one day at a time." />

      {challengeComplete && (
        <div className="challenge-complete">
          <FiAward />
          <div>
            <h2>🏆 45-Day Challenge Completed!</h2>
            <p>You finished every single day. Incredible work — now go ace that placement.</p>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <Card className="dashboard-progress-card">
          <h2>Current Progress</h2>
          <div className="progress-hero">
            <div className="progress-hero-label">
              <span>
                Day <strong>{currentDay.day}</strong> / {totalDays}
              </span>
              <span>{Math.round(daysPercent)}% Complete</span>
            </div>
            <ProgressBar percent={daysPercent} />
            <div className="progress-hero-meta">
              <span className="streak-pill">
                <FiZap /> {data.streak.current} Day Streak
              </span>
              <span>
                <FiCheckCircle /> {problemsSolved} / {totalProblems}+ Problems Solved
              </span>
            </div>
          </div>
        </Card>

        <Card className="today-plan-card">
          <div className="today-plan-head">
            <span className="chip chip-primary">
              <FiCalendar />
              {isDayCompleted(data, currentDay.day) ? "Completed" : "Today's Plan"}
            </span>
            <h2>Day {currentDay.day}</h2>
          </div>
          <p className="today-plan-topic">{currentDay.topic}</p>
          <p className="today-plan-goal">
            Today's Goal: {currentDay.description || `${todayStats.total} problems — solve them all`}
          </p>
          {currentDay.type !== "revision" && currentDay.type !== "final-revision" && todayStats.total > 0 && (
            <div className="today-plan-progress">
              <span>
                {todayStats.solved} / {todayStats.total} solved
              </span>
              <ProgressBar percent={todayStats.percent} size="sm" />
            </div>
          )}
          {canStartDay(data, currentDay.day) ? (
            <Link
              to={currentDay.type === "simulation" ? "/placement" : `/day/${currentDay.day}`}
              className="btn btn-primary btn-block"
            >
              {isDayCompleted(data, currentDay.day) ? "Review Today's Plan" : "Continue Today's Plan"}
              <FiArrowRight />
            </Link>
          ) : (
            <button className="btn btn-primary btn-block" disabled>
              <FiLock />
              Day {currentDay.day} unlocks tomorrow — one day at a time
            </button>
          )}
        </Card>
      </div>

      <h2 className="section-title">Quick Stats</h2>
      <div className="stats-grid">
        <StatCard icon={FiCircle} label="Easy Solved" value={difficultyStats.Easy?.solved ?? 0} sub={`of ${difficultyStats.Easy?.total ?? 0}`} tone="green" />
        <StatCard icon={FiTarget} label="Medium Solved" value={difficultyStats.Medium?.solved ?? 0} sub={`of ${difficultyStats.Medium?.total ?? 0}`} tone="amber" />
        <StatCard icon={FiBookOpen} label="Hard Solved" value={difficultyStats.Hard?.solved ?? 0} sub={`of ${difficultyStats.Hard?.total ?? 0}`} tone="red" />
        <StatCard icon={FiStar} label="Problems to Review" value={problemsToReview} sub="flagged" tone="warning" />
        <StatCard icon={FiCalendar} label="Days Completed" value={daysCompleted} sub={`of ${totalDays}`} tone="primary" />
        <StatCard icon={FiZap} label="Current Streak" value={data.streak.current} sub={`best ${data.streak.longest}`} tone="green" />
      </div>

      <h2 className="section-title">Consistency</h2>
      <StreakCard streak={data.streak} />

      <Card className="quick-nav-card">
        <h2>Where to next?</h2>
        <div className="quick-nav">
          <Link to="/roadmap" className="quick-nav-item">
            <FiBookOpen />
            <span>
              <strong>View 45-Day Roadmap</strong>
              <small>Your full preparation plan</small>
            </span>
            <FiArrowRight />
          </Link>
          <Link to="/progress" className="quick-nav-item">
            <FiTarget />
            <span>
              <strong>Progress Dashboard</strong>
              <small>Topic and difficulty breakdown</small>
            </span>
            <FiArrowRight />
          </Link>
          <Link to="/placement" className="quick-nav-item">
            <FiClock />
            <span>
              <strong>Placement Simulation</strong>
              <small>Practice under real conditions</small>
            </span>
            <FiArrowRight />
          </Link>
        </div>
      </Card>
    </>
  );
}
