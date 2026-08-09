import { cn } from "../utils/helpers.js";

export default function Card({ title, subtitle, action, children, className }) {
  return (
    <div className={cn("card", className)}>
      {(title || action) && (
        <div className="card-head">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
