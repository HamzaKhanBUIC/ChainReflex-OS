'use client';

import { useEffect, useRef, useState } from 'react';
import { generateMockThreats, ThreatEntry } from './mock-data';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { GlowingText } from './glowing-text';

function ThreatRow({ threat, index }: { threat: ThreatEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const severityConfig = {
    critical: { color: 'text-neon-red', icon: ShieldAlert, bg: 'bg-red-500/10' },
    high: { color: 'text-red-400', icon: AlertTriangle, bg: 'bg-red-500/5' },
    medium: { color: 'text-yellow-400', icon: AlertCircle, bg: 'bg-yellow-500/5' },
    low: { color: 'text-neon-green', icon: Info, bg: 'bg-green-500/5' },
  };

  const config = severityConfig[threat.severity];
  const Icon = config.icon;

  return (
    <div className={`border-l-2 border-slate-700 pl-3 py-2 ${config.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left hover:bg-slate-800/50 p-2 rounded transition-colors"
      >
        <div className="flex gap-2 items-start">
          <Icon className={`${config.color} flex-shrink-0 mt-0.5`} size={14} />
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 items-baseline flex-wrap">
              <span className="text-xs font-mono text-slate-400">{threat.timestamp.split('T')[1].split('.')[0]}</span>
              <GlowingText color={threat.severity === 'critical' ? 'red' : 'green'} intensity="high">
                {threat.type}
              </GlowingText>
            </div>
            <p className="text-sm font-mono text-slate-300 mt-1">{threat.message}</p>
          </div>
        </div>
      </button>

      {expanded && threat.details.thought_process && (
        <div className="mt-2 ml-6 p-3 bg-slate-800 border-l-2 border-neon-green/50 rounded-sm">
          <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap break-words text-pretty">
            {threat.details.thought_process}
          </pre>
        </div>
      )}
    </div>
  );
}

export function ThreatStream() {
  const [threats, setThreats] = useState<ThreatEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setThreats(generateMockThreats());
    
    const interval = setInterval(() => {
      const newThreat: ThreatEntry = {
        timestamp: new Date().toISOString(),
        severity: 'critical',
        type: 'ORACLE REASONING',
        message: 'Oracle Swarm analyzing anomaly in shipping lane...',
        details: {
          thought_process: `<oracle_reasoning>\nDetecting anomalous density increase at Port of Singapore.\nCalculating impact on MI300X delivery schedule.\nRunning parallel simulation on 8x MI300X nodes.\nConfidence Score: 0.94\nAction: Flag for human review.\n</oracle_reasoning>`
        }
      };
      setThreats(prev => [...prev, newThreat]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new threats appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [threats]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l-4 border-neon-green/50">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-xs font-mono text-slate-300 uppercase tracking-widest">
          Live Threat Stream
        </h2>
        <p className="text-xs text-slate-500 mt-1">Real-time agent threat analysis & oracle reasoning</p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700"
      >
        {threats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm font-mono">Initializing threat stream...</p>
          </div>
        ) : (
          threats.map((threat, idx) => (
            <ThreatRow key={idx} threat={threat} index={idx} />
          ))
        )}
      </div>
    </div>
  );
}
