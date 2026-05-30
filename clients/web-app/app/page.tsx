"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/command-center/header";
import { MetricsRow } from "@/components/command-center/metrics-row";
import { ControlPanel } from "@/components/command-center/control-panel";
import { LiveTerminal } from "@/components/command-center/live-terminal";
import { ThreatBanner } from "@/components/command-center/threat-banner";
import { GitOpsCommand } from "@/components/command-center/gitops-command";

export type LogEntry = {
  agent: string;
  message: string;
  type: "system" | "info" | "warning" | "alert" | "success";
};

export type Disruption = {
  location: string;
  severity_level: string;
  description: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CommandCenter() {
  const [activeThreat, setActiveThreat] = useState<Disruption | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([
    { agent: "SYSTEM", message: "ChainReflex OS v4.2.1 initialized", type: "system" },
    { agent: "SYSTEM", message: "Awaiting manual override or swarm trigger...", type: "system" }
  ]);

  // Real-Time WebSocket Log Streaming
  useEffect(() => {
    // Convert HTTP URL to WS URL
    const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws/stream';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) setTerminalLogs(data);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const triggerAI = async (vectorType: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trigger-response`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': 'chainreflex-default-key'
        },
        body: JSON.stringify({ 
          threat_vector: vectorType,
          payload_data: vectorType === 'cyber' 
            ? "WARN: Ransomware signature matched in payload" 
            : vectorType === 'vision' ? 'flood.jpg' : 'panic_voicemail.wav'
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Server returned an error");
      }

      const data = await response.json();
      
      if (data.status === "success" && data.disruption) {
        setActiveThreat(data.disruption);
      }
      
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 flex-col p-6 pt-0">
        {/* Threat Alert Banner */}
        <ThreatBanner threat={activeThreat} onClear={() => setActiveThreat(null)} />

        {/* Metrics Row */}
        <MetricsRow />

        {/* Split View */}
        <div className="flex-1 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Control Panel - Left Column */}
          <div className="lg:col-span-2">
            <ControlPanel onTriggerAI={triggerAI} />
          </div>

          {/* Live Terminal - Right Column */}
          <div className="lg:col-span-3 min-h-[500px]">
            <LiveTerminal logs={terminalLogs} />
          </div>
        </div>

        {/* Autonomous GitOps Command - Full Width Row */}
        <GitOpsCommand />
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-[#1f1f1f] bg-[#0a0a0a] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-xs font-mono text-[#666666]">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
            <div className="h-4 w-px bg-[#1f1f1f]" />
            <span className="text-xs font-mono text-[#666666]">
              UPTIME: 99.97%
            </span>
            <div className="h-4 w-px bg-[#1f1f1f]" />
            <span className="text-xs font-mono text-[#666666]">
              NODES: 847/850
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#666666]">
              CHAINREFLEX OS v4.2.1
            </span>
            <span className="text-xs font-mono text-[#00ff88]">
              CLASSIFIED // TOP SECRET
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
