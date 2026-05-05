"use client";

import { Activity, Cpu, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-[#00ff88]" />
                <div className="absolute inset-0 animate-pulse-glow rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#e0e0e0]">
                  CHAINREFLEX
                  <span className="ml-2 text-[#00ff88]">OS</span>
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#666666]">
                  Enterprise Supply Chain AI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Status */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 rounded border border-[#1f1f1f] bg-[#111111] px-4 py-2">
            <div className="relative flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#00ff88]">
                System Online
              </span>
            </div>
            <div className="h-4 w-px bg-[#1f1f1f]" />
            <Activity className="h-4 w-4 text-[#00ff88]" />
          </div>
        </div>

        {/* Hardware Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded border border-[#00ff88]/20 bg-[#111111] px-4 py-2">
            <Cpu className="h-4 w-4 text-[#00ff88]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666]">
                Compute Engine
              </span>
              <span className="text-sm font-mono font-semibold text-[#00ff88]">
                AMD MI300X Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span suppressHydrationWarning className="text-xs font-mono text-[#666666]">
              {new Date().toLocaleTimeString("en-US", { hour12: false })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
