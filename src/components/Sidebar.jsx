import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiMap,
  FiBarChart2,
  FiBriefcase,
  FiSettings
} from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import { getCourse } from "../data/roadmap.js";
import { cn } from "../utils/helpers.js";

const LINKS = [
  { to: "/", label: "Home", icon: FiHome, end: true, dsaOnly: false },
  { to: "/roadmap", label: "Roadmap", icon: FiMap, dsaOnly: false },
  { to: "/progress", label: "Progress", icon: FiBarChart2, dsaOnly: false },
  { to: "/placement", label: "Placement", icon: FiBriefcase, dsaOnly: true },
  { to: "/settings", label: "Settings", icon: FiSettings, dsaOnly: false }
];

export default function Sidebar() {
  const { data } = useApp();
  const course = getCourse(data.settings.course);
  const links = LINKS.filter((link) => !link.dsaOnly || course.id === "dsa");
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">D</span>
        <div className="brand-text">
          <strong>DSA Prep</strong>
          <span>45-Day Plan</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn("sidebar-link", isActive && "active")}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>Version 1.0.0</span>
      </div>
    </aside>
  );
}
