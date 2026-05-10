'use client';

import { HardwareTelemetry } from '@/components/soc-dashboard/hardware-telemetry';
import { ThreatStream } from '@/components/soc-dashboard/threat-stream';
import { ActionCenter } from '@/components/soc-dashboard/action-center';
import { PRFeed } from '@/components/soc-dashboard/pr-feed';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-slate-50 p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-neon-green mb-1">
          ChainReflex OS
        </h1>
        <p className="text-sm text-slate-400 font-mono">
          Security Operations Center • Real-time Threat Analysis & Oracle Agent Reasoning
        </p>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column: Hardware & Telemetry (30%) */}
        <div className="md:col-span-1">
          <HardwareTelemetry />
        </div>

        {/* Center Column: Threat Stream & PR Feed (40%) */}
        <div className="md:col-span-1 space-y-4">
          <div className="h-[400px]">
            <ThreatStream />
          </div>
          <PRFeed />
        </div>

        {/* Right Column: HITL Controls & ROI (30%) */}
        <div className="md:col-span-1">
          <ActionCenter />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-700 text-center">
        <p className="text-xs text-slate-500 font-mono">
          ChainReflex OS v2.1 • Powered by AMD MI300X • Last Update: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </main>
  );
}
