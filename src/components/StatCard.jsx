export default function StatCard({ icon: Icon, label, value, sub, tone = "primary" }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      {Icon && (
        <div className="stat-icon">
          <Icon />
        </div>
      )}
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}
