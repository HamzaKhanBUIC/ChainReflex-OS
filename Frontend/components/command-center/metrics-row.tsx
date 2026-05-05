"use client";

import { Globe, Users, AlertTriangle, Brain } from "lucide-react";

const metrics = [
  {
    label: "Global Routes Monitored",
    value: "24,847",
    subtext: "+127 last hour",
    icon: Globe,
    color: "#00ff88",
    trend: "up",
  },
  {
    label: "Active Suppliers",
    value: "1,293",
    subtext: "98.2% uptime",
    icon: Users,
    color: "#00ccff",
    trend: "stable",
  },
  {
    label: "Threat Level",
    value: "ELEVATED",
    subtext: "3 active anomalies",
    icon: AlertTriangle,
    color: "#ffaa00",
    trend: "warning",
  },
  {
    label: "Autonomy Confidence",
    value: "98.4%",
    subtext: "Neural sync active",
    icon: Brain,
    color: "#00ff88",
    trend: "up",
  },
];

export function MetricsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="group relative overflow-hidden rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-[#00ff88]/30"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          
          {/* Top row with icon and label */}
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded border"
                style={{
                  borderColor: `${metric.color}30`,
                  backgroundColor: `${metric.color}10`,
                }}
              >
                <metric.icon
                  className="h-5 w-5"
                  style={{ color: metric.color }}
                />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#666666]">
                {metric.label}
              </span>
            </div>
          </div>

          {/* Value */}
          <div className="relative mt-4">
            <span
              className="text-3xl font-bold font-mono tracking-tight"
              style={{ color: metric.color }}
            >
              {metric.value}
            </span>
          </div>

          {/* Subtext */}
          <div className="relative mt-2 flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: metric.color }}
            />
            <span className="text-xs font-mono text-[#666666]">
              {metric.subtext}
            </span>
          </div>

          {/* Corner accent */}
          <div
            className="absolute bottom-0 right-0 h-12 w-12"
            style={{
              background: `linear-gradient(135deg, transparent 50%, ${metric.color}10 50%)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
