import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSun,
  FiMoon,
  FiMonitor,
  FiInfo,
  FiChevronRight,
  FiCheck,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiAlertTriangle
} from "react-icons/fi";
import PageHeader from "../components/PageHeader.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../utils/helpers.js";
import { toast } from "../utils/toast.js";

const THEMES = [
  { key: "light", label: "Light Mode", icon: FiSun, desc: "Bright and clean" },
  { key: "dark", label: "Dark Mode", icon: FiMoon, desc: "Easy on the eyes" },
  { key: "system", label: "System Default", icon: FiMonitor, desc: "Follow your device" }
];

export default function SettingsPage() {
  const { data, setTheme, resetPlan, resetProgress, importData } = useApp();
  const fileInputRef = useRef(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const theme = data.settings.theme;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const dateKey = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `dsa-progress-backup-${dateKey}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    toast("Data exported", "success");
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(reader.result);
        toast("Data imported successfully", "success");
      } catch (err) {
        toast("Import failed — invalid data file", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const runReset = () => {
    if (confirmAction === "plan") {
      resetPlan();
      toast("Current plan progress reset", "info");
    } else if (confirmAction === "all") {
      resetProgress();
      toast("All data reset", "info");
    }
    setConfirmAction(null);
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance, data and about." />

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
        <h3 className="settings-group-title">Data</h3>
        <div className="settings-list">
          <button className="settings-row" onClick={exportData}>
            <FiDownload className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">Export Data</span>
              <span className="settings-row-sub">Download all progress as a JSON backup</span>
            </span>
            <FiChevronRight className="settings-chevron" />
          </button>
          <button className="settings-row" onClick={() => fileInputRef.current?.click()}>
            <FiUpload className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">Import Data</span>
              <span className="settings-row-sub">Restore progress from a backup file</span>
            </span>
            <FiChevronRight className="settings-chevron" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="settings-file-input"
            onChange={handleImportFile}
          />
          <button className="settings-row" onClick={() => setConfirmAction("plan")}>
            <FiRefreshCw className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">Reset Current 45-Day Plan</span>
              <span className="settings-row-sub">Clears plan progress and days</span>
            </span>
            <FiChevronRight className="settings-chevron" />
          </button>
          <button className="settings-row settings-row-danger" onClick={() => setConfirmAction("all")}>
            <FiAlertTriangle className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">Reset All Data</span>
              <span className="settings-row-sub">Clears everything including simulation history</span>
            </span>
            <FiChevronRight className="settings-chevron" />
          </button>
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
          <Link className="settings-row" to="/roadmap/preview">
            <FiInfo className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">View Roadmap</span>
            </span>
            <FiChevronRight className="settings-chevron" />
          </Link>
        </div>
      </section>

      <ConfirmModal
        open={confirmAction !== null}
        title={confirmAction === "all" ? "Reset all data?" : "Reset 45-Day Plan?"}
        message={
          confirmAction === "all"
            ? "This permanently deletes all progress, notes, revision flags, days and simulation history from this browser. Export a backup first if you need one."
            : "This clears all solved problems, notes, revision flags and completed days from this browser. Theme stays unchanged."
        }
        confirmLabel="Reset"
        onConfirm={runReset}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
