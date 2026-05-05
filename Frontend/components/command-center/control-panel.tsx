"use client";

import { useState } from "react";
import {
  FileText,
  Satellite,
  Mic,
  Zap,
  ChevronRight,
  Loader2,
} from "lucide-react";

const scoutButtons = [
  {
    id: "cyber",
    label: "Run Cyber Scout",
    sublabel: "Logs Analysis",
    icon: FileText,
    description: "Scan supply chain logs for anomalies",
  },
  {
    id: "vision",
    label: "Run Vision Scout",
    sublabel: "Satellite Feed",
    icon: Satellite,
    description: "Analyze satellite imagery data",
  },
  {
    id: "voice",
    label: "Run Voice Scout",
    sublabel: "Audio Intel",
    icon: Mic,
    description: "Process communication intercepts",
  },
];

export function ControlPanel({ onTriggerAI }: { onTriggerAI: (vectorType: string) => void }) {
  const [activeScout, setActiveScout] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleScoutClick = (id: string) => {
    setActiveScout(activeScout === id ? null : id);
    onTriggerAI(id);
  };

  const handleInitialize = () => {
    setIsInitializing(true);
    if (activeScout) {
      onTriggerAI(activeScout);
    } else {
      onTriggerAI("cyber"); // default or maybe all? We can just send 'cyber'
    }
    setTimeout(() => setIsInitializing(false), 3000);
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-[#111111] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
          <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-[#e0e0e0]">
            Data Ingestion Swarm
          </h2>
        </div>
        <p className="mt-1 text-xs font-mono text-[#666666]">
          Deploy autonomous reconnaissance agents
        </p>
      </div>

      {/* Scout Buttons */}
      <div className="flex-1 p-5 space-y-3">
        {scoutButtons.map((scout) => (
          <button
            key={scout.id}
            onClick={() => handleScoutClick(scout.id)}
            className={`group relative w-full overflow-hidden rounded border transition-all duration-300 ${
              activeScout === scout.id
                ? "border-[#00ff88]/50 bg-[#00ff88]/10"
                : "border-[#1f1f1f] bg-[#111111] hover:border-[#00ff88]/30 hover:bg-[#111111]/80"
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded border transition-all ${
                  activeScout === scout.id
                    ? "border-[#00ff88]/50 bg-[#00ff88]/20"
                    : "border-[#1f1f1f] bg-[#0a0a0a] group-hover:border-[#00ff88]/30"
                }`}
              >
                <scout.icon
                  className={`h-5 w-5 transition-colors ${
                    activeScout === scout.id
                      ? "text-[#00ff88]"
                      : "text-[#666666] group-hover:text-[#00ff88]"
                  }`}
                />
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-mono font-semibold transition-colors ${
                      activeScout === scout.id
                        ? "text-[#00ff88]"
                        : "text-[#e0e0e0] group-hover:text-[#00ff88]"
                    }`}
                  >
                    {scout.label}
                  </span>
                  <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-mono uppercase text-[#666666]">
                    {scout.sublabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-mono text-[#666666]">
                  {scout.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={`h-4 w-4 transition-all ${
                  activeScout === scout.id
                    ? "text-[#00ff88] translate-x-0"
                    : "text-[#666666] -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              />
            </div>

            {/* Active indicator bar */}
            {activeScout === scout.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent" />
            )}
          </button>
        ))}
      </div>

      {/* Initialize Button */}
      <div className="border-t border-[#1f1f1f] bg-[#0a0a0a] p-5">
        <button
          onClick={handleInitialize}
          disabled={isInitializing}
          className={`relative w-full overflow-hidden rounded-lg border-2 py-5 font-mono text-lg font-bold uppercase tracking-wider transition-all duration-300 ${
            isInitializing
              ? "border-[#ff2222]/50 bg-[#ff2222]/20 text-[#ff2222]"
              : "border-[#ff2222] bg-[#ff2222]/10 text-[#ff2222] hover:bg-[#ff2222]/20 animate-danger-pulse"
          }`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff2222]/10 to-transparent" />

          {/* Content */}
          <div className="relative flex items-center justify-center gap-3">
            {isInitializing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Initialize Autonomous Response</span>
              </>
            )}
          </div>

          {/* Corner accents */}
          <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[#ff2222]" />
          <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-[#ff2222]" />
          <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#ff2222]" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#ff2222]" />
        </button>
      </div>
    </div>
  );
}
