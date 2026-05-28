'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: 'good' | 'warning' | 'critical';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  status = 'good',
  icon,
  className = '',
}: MetricCardProps) {
  const statusColors = {
    good: 'border-neon-green shadow-neon-green',
    warning: 'border-yellow-500 shadow-yellow-500/30',
    critical: 'border-neon-red shadow-neon-red',
  };

  return (
    <div
      className={`
        border-l-4 bg-slate-900/50 backdrop-blur p-4 rounded-sm
        ${statusColors[status]}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-xs font-mono text-slate-300 uppercase tracking-widest">{title}</h3>
        {icon && <div className="text-neon-green">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-bold text-neon-green">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}
