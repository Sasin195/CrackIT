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
  isCourseStarted,
  getDayProblemStats,
  getDayCompletedToday
} from "../utils/progress.js";
import { getCourse } from "../data/roadmap.js";
import Card from "../components/Card.jsx";
import StatCard from "../components/StatCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StreakCard from "../components/StreakCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StartScreen from "../components/StartScreen.jsx";

export default function HomePage() {
  const { data, startCourse } = useApp();
  const course = getCourse(data.settings.course);
  const started = isCourseStarted(data, course.id);

  if (!started) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle={`${course.title} — ${course.subtitle}.`} />
        <StartScreen course={course} onStart={() => startCourse(course.id)} />
      </>
    );
  }

  const progress = calculateProgress(data, course);
  const { currentDay, difficultyStats, daysPercent, daysCompleted, totalDays, problemsSolved, totalProblems, problemsToReview, challengeComplete } = progress;

  const completedToday = getDayCompletedToday(data, course.id);
  const focusDay = !course.flexible && completedToday !== null ? course.roadmap.find((d) => d.day === completedToday) : currentDay;
  const isFocusCompleted = isDayCompleted(data, focusDay);
  const focusStats = getDayProblemStats(data, focusDay);
  const nextDayLocked = !course.flexible && completedToday !== null && completedToday < totalDays;
  const nextDay = completedToday !== null ? completedToday + 1 : null;

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`${course.title} — ${course.subtitle}.`} />

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
                Day <strong>{focusDay.day}</strong> / {totalDays}
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
              {isFocusCompleted ? "Completed" : "Today's Plan"}
            </span>
            <h2>Day {focusDay.day}</h2>
          </div>
          <p className="today-plan-topic">{focusDay.topic}</p>
          <p className="today-plan-goal">
            Today's Goal: {focusDay.description || `${focusStats.total} problems — solve them all`}
          </p>
          {!isFocusCompleted && focusDay.type !== "revision" && focusDay.type !== "final-revision" && focusStats.total > 0 && (
            <div className="today-plan-progress">
              <span>
                {focusStats.solved} / {focusStats.total} solved
              </span>
              <ProgressBar percent={focusStats.percent} size="sm" />
            </div>
          )}
          {nextDayLocked ? (
            <>
              <Link to={`/day/${focusDay.day}`} state={{ from: "/" }} className="btn btn-primary btn-block">
                Review Today's Plan
                <FiArrowRight />
              </Link>
              <div className="today-lock-note">
                <FiLock />
                Day {nextDay} unlocks tomorrow — one day at a time
              </div>
            </>
          ) : (
            <Link
              to={focusDay.type === "simulation" ? "/placement" : `/day/${focusDay.day}`}
              state={{ from: "/" }}
              className="btn btn-primary btn-block"
            >
              {isFocusCompleted ? "Review Today's Plan" : "Continue Today's Plan"}
              <FiArrowRight />
            </Link>
          )}
        </Card>
      </div>

      <h2 className="section-title">Quick Stats</h2>
      <div className="stats-grid">
        {course.hasTopics ? (
          <>
            <StatCard icon={FiCircle} label="Easy Solved" value={difficultyStats.Easy?.solved ?? 0} sub={`of ${difficultyStats.Easy?.total ?? 0}`} tone="green" />
            <StatCard icon={FiTarget} label="Medium Solved" value={difficultyStats.Medium?.solved ?? 0} sub={`of ${difficultyStats.Medium?.total ?? 0}`} tone="amber" />
            <StatCard icon={FiBookOpen} label="Hard Solved" value={difficultyStats.Hard?.solved ?? 0} sub={`of ${difficultyStats.Hard?.total ?? 0}`} tone="red" />
          </>
        ) : (
          <StatCard icon={FiCheckCircle} label="Tasks Completed" value={problemsSolved} sub={`of ${totalProblems}`} tone="green" />
        )}
        <StatCard icon={FiStar} label={course.hasTopics ? "Problems to Review" : "Tasks to Review"} value={problemsToReview} sub="flagged" tone="warning" />
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
              <strong>View {course.totalDays}-Day Roadmap</strong>
              <small>Your full preparation plan</small>
            </span>
            <FiArrowRight />
          </Link>
          <Link to="/progress" className="quick-nav-item">
            <FiTarget />
            <span>
              <strong>Progress Dashboard</strong>
              <small>{course.hasTopics ? "Topic and difficulty breakdown" : "Days and task breakdown"}</small>
            </span>
            <FiArrowRight />
          </Link>
          {course.id === "dsa" && (
            <Link to="/placement" className="quick-nav-item">
              <FiClock />
              <span>
                <strong>Placement Simulation</strong>
                <small>Practice under real conditions</small>
              </span>
              <FiArrowRight />
            </Link>
          )}
        </div>
      </Card>
    </>
  );
}
