import { cn } from "../utils/helpers.js";

export default function ProgressBar({ percent, color, className, size = "md" }) {
  const safe = Math.min(Math.max(percent || 0, 0), 100);
  return (
    <div className={cn("progress", `progress-${size}`, className)}>
      <div
        className="progress-fill"
        style={{ width: `${safe}%`, background: color || undefined }}
      />
    </div>
  );
}
