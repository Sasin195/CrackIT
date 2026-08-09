import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";
import { useToasts } from "../utils/toast.js";
import { cn } from "../utils/helpers.js";

const ICONS = {
  success: FiCheckCircle,
  info: FiInfo,
  warning: FiAlertTriangle
};

export default function Toasts() {
  const { toasts, dismiss } = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || FiInfo;
        return (
          <div key={toast.id} className={cn("toast", toast.type)}>
            <Icon />
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
              <FiX />
            </button>
          </div>
        );
      })}
    </div>
  );
}
