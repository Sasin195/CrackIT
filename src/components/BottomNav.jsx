import { NavLink } from "react-router-dom";
import { FiHome, FiMap, FiBarChart2, FiBriefcase, FiSettings } from "react-icons/fi";
import { cn } from "../utils/helpers.js";

const LINKS = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/roadmap", label: "Roadmap", icon: FiMap },
  { to: "/progress", label: "Progress", icon: FiBarChart2 },
  { to: "/placement", label: "Placement", icon: FiBriefcase },
  { to: "/settings", label: "Settings", icon: FiSettings }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => cn("bottom-nav-item", isActive && "active")}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
