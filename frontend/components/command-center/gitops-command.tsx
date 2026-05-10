"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Cpu, Activity, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

type PRStatus = "APPROVED" | "PENDING" | "REJECTED" | "MERGED";

interface RemediationAction {
  id: string;
  prNumber: string;
  vulnerability: string;
  status: PRStatus;
  timestamp: string;
  repository: string;
  url?: string;
}

export function GitOpsCommand() {
  const [activeAgent, setActiveAgent] = useState<"DRAFTER" | "ORACLE" | "IDLE">("IDLE");
  const [drafterProgress, setDrafterProgress] = useState(0);
  const [oracleScan, setOracleScan] = useState(0);
  const [recentPRs, setRecentPRs] = useState<RemediationAction[]>([]);
  
  // Real GitHub PR Polling
  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/remediations");
        const data = await response.json();
        if (Array.isArray(data)) setRecentPRs(data);
      } catch (err) {
        console.error("Failed to sync GitHub feed:", err);
      }
    };
    
    fetchPRs();
    const interval = setInterval(fetchPRs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Simulation loop for the high-tech swarm telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeAgent === "IDLE") {
        setActiveAgent("DRAFTER");
      } else if (activeAgent === "DRAFTER") {
        setDrafterProgress(prev => {
          if (prev >= 100) {
            setActiveAgent("ORACLE");
            return 0;
          }
          return prev + 2;
        });
      } else if (activeAgent === "ORACLE") {
        setOracleScan(prev => {
          if (prev >= 100) {
            setActiveAgent("IDLE");
            return 0;
          }
          return prev + 5;
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [activeAgent]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Swarm Telemetry Section */}
      <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#00ff8815] p-2">
              <Cpu className="h-5 w-5 text-[#00ff88]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Autonomous Swarm Telemetry</h3>
              <p className="text-xs text-[#666666]">AMD MI300X Bare-Metal Cluster</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#00ff8830] bg-[#00ff8805] px-3 py-1">
            <Activity className="h-3 w-3 animate-pulse text-[#00ff88]" />
            <span className="text-[10px] font-mono font-bold text-[#00ff88]">LIVE SWARM ACTIVE</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Drafter Agent Visual */}
          <div className={`rounded-lg border p-4 transition-all duration-500 ${activeAgent === "DRAFTER" ? "border-[#00ff8850] bg-[#00ff8805]" : "border-[#1f1f1f] bg-transparent opacity-40"}`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00ff88]">AGENT_DRAFTER_01</span>
              <span className="text-xs font-mono text-[#666666]">{activeAgent === "DRAFTER" ? "SYNTHESIZING PATCH..." : "AWAITING TASK"}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f1f1f]">
              <div 
                className="h-full bg-gradient-to-r from-[#00ff88] to-[#00ffee] transition-all duration-300"
                style={{ width: `${activeAgent === "DRAFTER" ? drafterProgress : 0}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-[#444444]">
              <span>VECTOR_MAP_VRAM_LOADED</span>
              <span>{drafterProgress}%</span>
            </div>
          </div>

          {/* Oracle Agent Visual */}
          <div className={`rounded-lg border p-4 transition-all duration-500 ${activeAgent === "ORACLE" ? "border-[#00ffee50] bg-[#00ffee05]" : "border-[#1f1f1f] bg-transparent opacity-40"}`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00ffee]">AGENT_ORACLE_QA</span>
              <span className="text-xs font-mono text-[#666666]">{activeAgent === "ORACLE" ? "FORMULATING CONSENSUS..." : "READY"}</span>
            </div>
            <div className="flex gap-1">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className={`h-4 flex-1 rounded-sm transition-all duration-300 ${activeAgent === "ORACLE" && (i / 20) * 100 < oracleScan ? "bg-[#00ffee]" : "bg-[#1f1f1f]"}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-[#444444]">
              <span>ZERO_TRUST_VERIFICATION</span>
              <span>{oracleScan}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Remediation Feed */}
      <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#f0ab1415] p-2">
              <Shield className="h-5 w-5 text-[#f0ab14]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Live Remediation Feed</h3>
              <p className="text-xs text-[#666666]">Autonomous GitOps Audit Log</p>
            </div>
          </div>
          <Terminal className="h-4 w-4 text-[#444444]" />
        </div>

        <div className="space-y-4">
          {recentPRs.map((pr) => (
            <a 
              key={pr.id} 
              href={pr.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-start gap-4 rounded-lg border border-[#1f1f1f] bg-[#050505] p-4 transition-all hover:border-[#f0ab1450] hover:bg-[#f0ab1405]"
            >
              <div className="mt-1">
                {pr.status === "APPROVED" ? (
                  <CheckCircle2 className="h-4 w-4 text-[#00ff88]" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-[#f0ab14]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">PR #{pr.prNumber}</span>
                  <span className="text-[10px] font-mono text-[#444444]">{pr.timestamp}</span>
                </div>
                <h4 className="mt-1 text-sm font-medium text-[#cccccc] group-hover:text-[#f0ab14] line-clamp-1">
                  {pr.vulnerability}
                </h4>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#666666]">{pr.repository}</span>
                  <div className="h-1 w-1 rounded-full bg-[#1f1f1f]" />
                  <span className="text-[10px] font-mono font-bold text-[#00ff88]">{pr.status} BY ORACLE</span>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 translate-x-2 translate-y--2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 text-[#f0ab14]" />
            </a>
          ))}
          {recentPRs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
               <Shield className="h-8 w-8 mb-2" />
               <p className="text-xs font-mono">AWAITING GITOPS SIGNALS...</p>
            </div>
          )}
        </div>

        <button className="mt-6 w-full rounded-lg border border-[#1f1f1f] py-3 text-center text-xs font-mono font-bold text-[#666666] transition-all hover:border-[#f0ab14] hover:text-[#f0ab14]">
          VIEW ALL GIT MONITORING ACTIVITY
        </button>
      </div>
    </div>
  );
}
