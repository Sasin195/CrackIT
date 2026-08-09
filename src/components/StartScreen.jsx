import { FiPlay, FiZap, FiCalendar, FiCheckCircle, FiLock, FiAward } from "react-icons/fi";
import { getAllProblems } from "../data/roadmap.js";

export default function StartScreen({ course, onStart }) {
  const totalProblems = getAllProblems(course.roadmap).length;
  return (
    <div className="start-screen">
      <div className="start-screen-card card">
        <div className="start-screen-badge">{course.id === "react" ? "React" : "DSA"}</div>
        <h1>{course.title}</h1>
        <p className="start-screen-subtitle">{course.subtitle}</p>

        <div className="start-screen-stats">
          <div>
            <strong>{course.totalDays}</strong>
            <span>Days</span>
          </div>
          <div>
            <strong>{totalProblems}+</strong>
            <span>Problems</span>
          </div>
          <div>
            <strong>1</strong>
            <span>Day at a time</span>
          </div>
        </div>

        <div className="start-screen-how">
          <h3>How it works</h3>
          <ul>
            <li>
              <FiCalendar />
              <span>
                <strong>One day per calendar day.</strong> You can only complete one day per day — it keeps your streak honest.
              </span>
            </li>
            <li>
              <FiCheckCircle />
              <span>
                <strong>Mark problems done as you solve.</strong> Finish all of a day's problems and it completes automatically.
              </span>
            </li>
            <li>
              <FiZap />
              <span>
                <strong>Keep your streak alive.</strong> Study daily to build a streak and stay consistent until placements.
              </span>
            </li>
            <li>
              <FiLock />
              <span>
                <strong>No shortcuts.</strong> Days unlock in order — skip ahead and you'll miss the fundamentals.
              </span>
            </li>
          </ul>
        </div>

        <button className="btn btn-primary btn-lg start-screen-start" onClick={onStart}>
          <FiPlay />
          Start Day 1 — Let's Go!
        </button>
        <p className="start-screen-note">
          <FiAward />
          Progress is saved on this device only.
        </p>
      </div>
    </div>
  );
}
