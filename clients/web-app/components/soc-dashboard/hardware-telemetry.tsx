'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from './metric-card';
import { GlowingText } from './glowing-text';
import { generateMockHardwareMetrics } from './mock-data';
import { Activity } from 'lucide-react';

export function HardwareTelemetry() {
  const [metrics, setMetrics] = useState(generateMockHardwareMetrics());
  const [tokensDisplay, setTokensDisplay] = useState(0);

  // Animate tokens per second counter
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * (5100 - 4200 + 1)) + 4200;
      setTokensDisplay(newValue);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const vramPercent = ((metrics.vram_used / metrics.vram_total) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* System Status */}
      <div className="bg-slate-900 border-l-4 border-neon-green p-4 rounded-sm">
        <h2 className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-3">
          System Status
        </h2>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Model:</span>
            <GlowingText>{metrics.model}</GlowingText>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Uptime:</span>
            <GlowingText>{metrics.uptime}</GlowingText>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-neon-green">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* VRAM Usage */}
      <div className="bg-slate-900 border-l-4 border-neon-green p-4 rounded-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-mono text-slate-300 uppercase tracking-widest">
            VRAM Usage
          </h3>
          <span className="text-sm font-mono text-neon-green">
            {metrics.vram_used}GB / {metrics.vram_total}GB
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-neon-green to-neon-green_bright h-full transition-all duration-300"
            style={{ width: `${vramPercent}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-400 mt-2 font-mono">{vramPercent}% Utilization</div>
      </div>

      {/* KV Cache */}
      <div className="bg-slate-900 border-l-4 border-neon-green p-4 rounded-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-mono text-slate-300 uppercase tracking-widest">
            KV Cache
          </h3>
          <span className="text-sm font-mono text-neon-green">{metrics.kv_cache_usage.toFixed(2)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-neon-green to-neon-green_bright h-full"
            style={{ width: `${metrics.kv_cache_usage}%` }}
          ></div>
        </div>
      </div>

      {/* Tokens Per Second */}
      <MetricCard
        title="Tokens/Sec"
        value={tokensDisplay}
        unit="tokens/s"
        icon={<Activity size={16} />}
      />
    </div>
  );
}
