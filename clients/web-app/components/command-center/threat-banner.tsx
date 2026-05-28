"use client";

import React from "react";
import { AlertCircle, ShieldAlert, Zap } from "lucide-react";

interface ThreatBannerProps {
  threat: {
    location: string;
    severity_level: string;
    description: string;
  } | null;
  onClear: () => void;
}

export function ThreatBanner({ threat, onClear }: ThreatBannerProps) {
  if (!threat) return null;

  const isCritical = threat.severity_level.toUpperCase() === "CRITICAL" || threat.severity_level.toUpperCase() === "HIGH";

  return (
    <div 
      className={`relative mb-6 overflow-hidden border ${
        isCritical 
          ? "border-[#ff2222] bg-[#ff2222]/10 animate-danger-pulse" 
          : "border-[#ffaa00] bg-[#ffaa00]/10"
      } p-4 md:p-6`}
    >
      <div className="absolute top-0 left-0 h-full w-1 bg-current" />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
            isCritical ? "bg-[#ff2222] text-white" : "bg-[#ffaa00] text-black"
          }`}>
            {isCritical ? <ShieldAlert size={24} /> : <Zap size={24} />}
          </div>
          
          <div>
            <div className="flex items-center gap-3">
              <h2 className={`font-mono text-lg font-bold tracking-wider ${
                isCritical ? "text-[#ff2222]" : "text-[#ffaa00]"
              }`}>
                {isCritical ? "CRITICAL SYSTEM ALERT" : "THREAT ADVISORY"}
              </h2>
              <span className={`px-2 py-0.5 font-mono text-xs font-bold uppercase rounded ${
                isCritical ? "bg-[#ff2222] text-white" : "bg-[#ffaa00] text-black"
              }`}>
                {threat.severity_level}
              </span>
            </div>
            
            <p className="mt-1 font-mono text-sm text-[#e0e0e0]">
              <span className="font-bold text-[#666666]">LOCATION:</span> {threat.location}
            </p>
            <p className="mt-1 font-mono text-sm leading-relaxed text-[#666666]">
              {threat.description}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClear}
          className="self-start px-4 py-2 font-mono text-xs font-bold tracking-tighter uppercase transition-colors border border-current hover:bg-white/10 md:self-center"
        >
          Acknowledge & Clear
        </button>
      </div>
      
      {/* Scanline effect for that military feel */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
