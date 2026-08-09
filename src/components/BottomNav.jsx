import { NavLink } from "react-router-dom";
import { FiHome, FiMap, FiBarChart2, FiBriefcase, FiSettings } from "react-icons/fi";
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

export default function BottomNav() {
  const { data } = useApp();
  const course = getCourse(data.settings.course);
  const links = LINKS.filter((link) => !link.dsaOnly || course.id === "dsa");
  return (
    <nav className="bottom-nav">
      {links.map(({ to, label, icon: Icon, end }) => (
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
