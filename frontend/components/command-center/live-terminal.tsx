"use client";

import { Terminal, Circle, Minus, X } from "lucide-react";
import { LogEntry } from "@/app/page";

const agentColors: Record<string, string> = {
  SYSTEM: "#00ccff",
  SCOUT: "#00ff88",
  LEGAL_BRAIN: "#ffaa00",
  FIREWALL: "#ff2222",
};

const typeColors: Record<string, string> = {
  system: "#00ccff",
  info: "#e0e0e0",
  warning: "#ffaa00",
  alert: "#ff2222",
  success: "#00ff88",
};

export function LiveTerminal({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-[#1f1f1f] bg-[#050505] overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] bg-[#0a0a0a] px-4 py-3">
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-[#00ff88]" />
          <span className="text-sm font-mono font-semibold text-[#e0e0e0]">
            LIVE TERMINAL
          </span>
          <span className="rounded bg-[#00ff88]/20 px-2 py-0.5 text-[10px] font-mono text-[#00ff88]">
            STREAMING
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded p-1 text-[#666666] hover:bg-[#1a1a1a] hover:text-[#e0e0e0]">
            <Minus className="h-3 w-3" />
          </button>
          <button className="rounded p-1 text-[#666666] hover:bg-[#1a1a1a] hover:text-[#e0e0e0]">
            <Circle className="h-3 w-3" />
          </button>
          <button className="rounded p-1 text-[#666666] hover:bg-[#ff2222]/20 hover:text-[#ff2222]">
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="relative flex-1 overflow-hidden">
        {/* Scanline effect overlay */}
        <div className="scanlines absolute inset-0 pointer-events-none z-10" />

        {/* Glow effect at top */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#00ff88]/5 to-transparent pointer-events-none z-10" />

        {/* Scrollable content */}
        <div className="h-full overflow-y-auto p-4 font-mono text-sm scrollbar-thin">
          {logs.map((log, index) => (
            <div
              key={index}
              className="mb-2 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <span className="text-[#666666] shrink-0">
                {String(index + 1).padStart(3, "0")}
              </span>
              <span className="text-[#666666] shrink-0">│</span>
              <span
                className="shrink-0 font-bold"
                style={{ color: agentColors[log.agent] }}
              >
                [{log.agent}]
              </span>
              <span
                className="terminal-text whitespace-pre-wrap"
                style={{ color: typeColors[log.type] }}
              >
                {log.message}
              </span>
            </div>
          ))}

          {/* Cursor */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#666666]">
              {String(logs.length + 1).padStart(3, "0")}
            </span>
            <span className="text-[#666666]">│</span>
            <span className="text-[#00ff88]">{">"}</span>
            <span className="h-4 w-2 bg-[#00ff88] animate-terminal-blink" />
          </div>
        </div>

        {/* Glow effect at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[10px] font-mono text-[#666666]">
              4 AGENTS ONLINE
            </span>
          </div>
          <div className="h-3 w-px bg-[#1f1f1f]" />
          <span className="text-[10px] font-mono text-[#666666]">
            LATENCY: 12ms
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#666666]">
          BUFFER: {logs.length}/{logs.length}
        </span>
      </div>
    </div>
  );
}
