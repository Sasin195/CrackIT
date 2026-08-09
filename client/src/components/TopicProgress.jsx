import ProgressBar from "./ProgressBar.jsx";
import { TOPIC_COLORS } from "../data/roadmap.js";

export default function TopicProgress({ topic, stats }) {
  const color = TOPIC_COLORS[topic] || "#6366f1";
  return (
    <div className="topic-progress">
      <div className="topic-progress-head">
        <span className="topic-name">
          <span className="topic-dot" style={{ background: color }} />
          {topic}
        </span>
        <span className="topic-count">
          {stats.solved} / {stats.total}
        </span>
      </div>
      <div className="topic-progress-bar-row">
        <ProgressBar percent={stats.percent} color={color} />
        <span className="topic-percent">{Math.round(stats.percent)}%</span>
      </div>
    </div>
  );
}
