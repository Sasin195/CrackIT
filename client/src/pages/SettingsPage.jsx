import { Link } from "react-router-dom";
import {
  FiSun,
  FiMoon,
  FiMonitor,
  FiInfo,
  FiChevronRight,
  FiCheck
} from "react-icons/fi";
import PageHeader from "../components/PageHeader.jsx";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../utils/helpers.js";

const THEMES = [
  { key: "light", label: "Light Mode", icon: FiSun, desc: "Bright and clean" },
  { key: "dark", label: "Dark Mode", icon: FiMoon, desc: "Easy on the eyes" },
  { key: "system", label: "System Default", icon: FiMonitor, desc: "Follow your device" }
];

export default function SettingsPage() {
  const { data, setTheme } = useApp();

  const theme = data.settings.theme;

  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance and about." />

      <section className="settings-group">
        <h3 className="settings-group-title">Appearance</h3>
        <div className="settings-list">
          {THEMES.map(({ key, label, icon: Icon, desc }) => (
            <button
              key={key}
              className={cn("settings-row", theme === key && "settings-row-active")}
              onClick={() => setTheme(key)}
            >
              <Icon className="settings-row-icon" />
              <span className="settings-row-text">
                <span className="settings-row-title">{label}</span>
                <span className="settings-row-sub">{desc}</span>
              </span>
              {theme === key && <FiCheck className="settings-check" />}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-group">
        <h3 className="settings-group-title">About</h3>
        <div className="settings-list">
          <div className="settings-row">
            <span className="settings-brand">D</span>
            <span className="settings-row-text">
              <span className="settings-row-title">45-Day DSA Placement Prep</span>
              <span className="settings-row-sub">Built for consistent placement preparation</span>
            </span>
            <span className="settings-version">v1.0.0</span>
          </div>
          <Link className="settings-row" to="/roadmap">
            <FiInfo className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">View Roadmap</span>
            </span>
            <FiChevronRight className="settings-chevron" />
          </Link>
        </div>
      </section>
    </>
  );
}
