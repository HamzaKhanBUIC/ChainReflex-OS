"use client";

import React, { useState } from "react";
import { Header } from "@/components/command-center/header";
import { MetricsRow } from "@/components/command-center/metrics-row";
import { ControlPanel } from "@/components/command-center/control-panel";
import { LiveTerminal } from "@/components/command-center/live-terminal";

export type LogEntry = {
  agent: string;
  message: string;
  type: "system" | "info" | "warning" | "alert" | "success";
};

export default function CommandCenter() {
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([
    { agent: "SYSTEM", message: "ChainReflex OS v4.2.1 initialized", type: "system" },
    { agent: "SYSTEM", message: "Awaiting manual override or swarm trigger...", type: "system" }
  ]);

  const triggerAI = async (vectorType: string) => {
    setTerminalLogs(prev => [...prev, { agent: "SYSTEM", message: `Triggering ${vectorType} Scout...`, type: "info" }]);
    
    try {
      const response = await fetch('http://localhost:8000/api/trigger-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          threat_vector: vectorType,
          payload_data: vectorType === 'cyber' ? "WARN: Ransomware signature matched in payload" : "mock_data_payload" 
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Server returned an error");
      }

      const aiData = await response.json();
      
      if (aiData.status === "success" && aiData.disruption_found) {
        setTerminalLogs(prev => [
          ...prev,
          { agent: "SCOUT", message: `Disruption Found: ${aiData.disruption_found.location}`, type: "alert" },
          { agent: "SCOUT", message: `Severity: ${aiData.disruption_found.severity_level}`, type: "warning" },
          { agent: "LEGAL_BRAIN", message: `Drafting Force Majeure...`, type: "info" },
          { agent: "FIREWALL", message: `Approved: ${aiData.firewall_approved}`, type: "success" },
          { agent: "SYSTEM", message: `Action taken after ${aiData.iterations_required} iterations.`, type: "success" },
          { agent: "LEGAL_BRAIN", message: `FINAL EMAIL DRAFT:\n${aiData.final_legal_action}`, type: "info" }
        ]);
      } else {
         setTerminalLogs(prev => [...prev, { agent: "SYSTEM", message: "No critical threats detected or pipeline failed.", type: "warning" }]);
      }
      
    } catch (error: any) {
      setTerminalLogs(prev => [...prev, { agent: "SYSTEM", message: `API Error: ${error.message || "Connection to AMD MI300X Engine Failed."}`, type: "alert" }]);
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Metrics Row */}
        <MetricsRow />

        {/* Split View */}
        <div className="flex-1 grid grid-cols-1 gap-6 p-6 pt-0 lg:grid-cols-5">
          {/* Control Panel - Left Column */}
          <div className="lg:col-span-2">
            <ControlPanel onTriggerAI={triggerAI} />
          </div>

          {/* Live Terminal - Right Column */}
          <div className="lg:col-span-3 min-h-[500px]">
            <LiveTerminal logs={terminalLogs} />
          </div>
        </div>
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
