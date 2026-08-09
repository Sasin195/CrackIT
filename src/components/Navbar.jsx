import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { getCurrentDay, isCourseStarted } from "../utils/progress.js";
import { getCourse, COURSES } from "../data/roadmap.js";
import { todayDateKey, formatDate } from "../utils/helpers.js";
import { cn } from "../utils/helpers.js";

export default function Navbar() {
  const { data, setCourse } = useApp();
  const location = useLocation();
  const course = getCourse(data.settings.course);
  const currentDay = getCurrentDay(data, course);
  const started = isCourseStarted(data, course.id);
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div>
          <span className="navbar-title">{course.title}</span>
          <span className="navbar-subtitle">{course.subtitle}</span>
        </div>
      </div>
      <div className="navbar-actions">
        <span className="navbar-date-chip">{formatDate(todayDateKey())}</span>
        <div className="course-switch">
          {COURSES.map((c) => (
            <button
              key={c.id}
              className={cn("course-switch-btn", c.id === course.id && "active")}
              onClick={() => setCourse(c.id)}
              title={c.title}
            >
              {c.id === "react" ? "React" : "DSA"}
            </button>
          ))}
        </div>
        {started ? (
          <NavLink to={`/day/${currentDay.day}`} state={{ from: location.pathname }} className="navbar-day-chip">
            Day {currentDay.day}
          </NavLink>
        ) : (
          <NavLink to="/" state={{ from: location.pathname }} className="navbar-day-chip">
            Start
          </NavLink>
        )}
      </div>
    </header>
  );
}
