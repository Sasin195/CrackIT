import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { getCurrentDay } from "../utils/progress.js";
import { todayDateKey, formatDate } from "../utils/helpers.js";

export default function Navbar() {
  const { data } = useApp();
  const currentDay = getCurrentDay(data);
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div>
          <span className="navbar-title">45-Day DSA Placement Prep</span>
          <span className="navbar-subtitle">Build DSA confidence for placements — one day at a time.</span>
        </div>
      </div>
      <div className="navbar-actions">
        <span className="navbar-date-chip">{formatDate(todayDateKey())}</span>
        <NavLink to={`/day/${currentDay.day}`} className="navbar-day-chip">
          Day {currentDay.day}
        </NavLink>
      </div>
    </header>
  );
}
