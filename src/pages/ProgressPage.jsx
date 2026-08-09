import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiCode,
  FiStar,
  FiZap,
  FiTrendingUp,
  FiArrowRight
} from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import {
  calculateProgress,
  getWeakTopics,
  getSimulationAccuracy
} from "../utils/progress.js";
import { DIFFICULTY_COLORS, getCourse } from "../data/roadmap.js";
import Card from "../components/Card.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StatCard from "../components/StatCard.jsx";
import TopicProgress from "../components/TopicProgress.jsx";
import StreakCard from "../components/StreakCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const DIFFICULTIES = [
  { key: "Easy", emoji: "🟢" },
  { key: "Medium", emoji: "🟡" },
  { key: "Hard", emoji: "🔴" }
];

export default function ProgressPage() {
  const { data } = useApp();
  const course = getCourse(data.settings.course);
  const progress = calculateProgress(data, course);
  const weakTopics = getWeakTopics(data, 3);
  const accuracy = getSimulationAccuracy(data);

  return (
    <>
      <PageHeader title="Progress Dashboard" subtitle={`${course.title} — your complete overview, calculated live from your local progress.`} />

      <div className="overall-grid">
        <Card className="overall-card">
          <div className="overall-head">
            <span className="chip chip-primary">
              <FiCalendar />
              Days
            </span>
            <strong>{progress.daysCompleted} / {progress.totalDays}</strong>
          </div>
          <ProgressBar percent={progress.daysPercent} />
          <p className="overall-label">{Math.round(progress.daysPercent)}% of the plan complete</p>
        </Card>
        <Card className="overall-card">
          <div className="overall-head">
            <span className="chip chip-success">
              <FiCode />
              {course.unit}
            </span>
            <strong>{progress.problemsSolved} / {progress.totalProblems}</strong>
          </div>
          <ProgressBar percent={progress.problemsPercent} color={DIFFICULTY_COLORS.Easy} />
          <p className="overall-label">{Math.round(progress.problemsPercent)}% of all {course.unit.toLowerCase()} completed</p>
        </Card>
      </div>

      <div className="stats-grid">
        <StatCard icon={FiCalendar} label="Days Completed" value={progress.daysCompleted} sub={`of ${progress.totalDays} days`} tone="primary" />
        <StatCard icon={FiCode} label={course.unit} value={progress.problemsSolved} sub={`of ${progress.totalProblems}`} tone="green" />
        <StatCard icon={FiStar} label="Needs Review" value={progress.problemsToReview} sub={`${course.unit.toLowerCase()} flagged`} tone="warning" />
        <StatCard icon={FiZap} label="Current Streak" value={data.streak.current} sub={`best ${data.streak.longest}`} tone="green" />
      </div>

      {course.hasTopics && (
        <>
          <h2 className="section-title">Difficulty Statistics</h2>
          <div className="difficulty-grid">
            {DIFFICULTIES.map(({ key, emoji }) => {
              const stats = progress.difficultyStats[key];
              return (
                <Card key={key} className="difficulty-card">
                  <div className="difficulty-head">
                    <span>
                      {emoji} {key}
                    </span>
                    <strong>{stats.solved} / {stats.total}</strong>
                  </div>
                  <ProgressBar percent={stats.percent} color={DIFFICULTY_COLORS[key]} />
                </Card>
              );
            })}
          </div>

          <h2 className="section-title">Topic Progress</h2>
          <Card>
            <div className="topic-progress-list">
              {Object.entries(progress.topicStats).map(([topic, stats]) => (
                <TopicProgress key={topic} topic={topic} stats={stats} />
              ))}
            </div>
          </Card>

          <h2 className="section-title">Weak Topics</h2>
          {weakTopics.length === 0 ? (
            <EmptyState
              icon={FiTrendingUp}
              title="No weak topics"
              text="Everything looks strong. Keep it up!"
            />
          ) : (
            <Card>
              <div className="weak-topics-list">
                {weakTopics.map((item, index) => (
                  <div key={item.topic} className="weak-topic-row">
                    <span className="weak-rank">{index + 1}</span>
                    <div className="weak-topic-info">
                      <strong>{item.topic}</strong>
                      <span className={`weak-status weak-${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="weak-topic-stats">
                      <span>{item.solved}/{item.total} solved</span>
                      {item.review > 0 && <span>{item.review} in review</span>}
                    </div>
                    <Link to="/roadmap" className="btn btn-ghost btn-sm">
                      Practice
                      <FiArrowRight />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {accuracy !== null && (
        <Card title="Placement Accuracy" subtitle="Across all simulations">
          <div className="overall-head">
            <span className="chip chip-primary">
              <FiTrendingUp />
              Accuracy
            </span>
            <strong>{accuracy}%</strong>
          </div>
        </Card>
      )}

      <h2 className="section-title">Consistency</h2>
      <StreakCard streak={data.streak} />
    </>
  );
}
