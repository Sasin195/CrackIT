import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiMap,
  FiBarChart2,
  FiBriefcase,
  FiSettings
} from "react-icons/fi";
import { cn } from "../utils/helpers.js";

const LINKS = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/roadmap", label: "Roadmap", icon: FiMap },
  { to: "/progress", label: "Progress", icon: FiBarChart2 },
  { to: "/placement", label: "Placement", icon: FiBriefcase },
  { to: "/settings", label: "Settings", icon: FiSettings }
];

export default function Sidebar() {
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
        {LINKS.map(({ to, label, icon: Icon, end }) => (
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
