'use client';

import { useEffect, useState } from 'react';
import { generateMockROIMetrics } from './mock-data';
import { GlowingText } from './glowing-text';
import { AlertTriangle, CheckCircle2, Lock } from 'lucide-react';

export function ActionCenter() {
  const metrics = generateMockROIMetrics();
  const [computeSaved, setComputeSaved] = useState(0);
  const [swarmHalted, setSwarmHalted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Initializing Swarm...",
    "Engaging Cyber Scout...",
    "Analyzing repository diffs...",
    "Synthesizing patch via MI300X...",
    "Auditing via Compliance Oracle...",
    "Deploying PR to GitHub...",
    "Dispatching Discord alert..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [loading]);
  
  const [repoName, setRepoName] = useState('HamzaKhanBUIC/autorem-demo-target');
  const [filePath, setFilePath] = useState('src/auth/jwt_handler.py');
  const [severity, setSeverity] = useState('CRITICAL');
  const [description, setDescription] = useState('Unverified JWT decoding allows signature bypass.');
  const [snippet, setSnippet] = useState('jwt.decode(token, verify=False)');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInjectThreat = async () => {
    setStatusMessage('');
    setLoading(true);
    const payload = {
      alert_id: `SEC-${Date.now()}`,
      cve_id: "CVE-2024-1234",
      severity: severity,
      repository: repoName,
      file_path: filePath,
      vulnerable_snippet: snippet,
      description: description
    };
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${apiBaseUrl}/api/remediate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setLoading(false);
      if (response.ok) {
        setStatusMessage('✅ Threat payload injected successfully!');
      } else {
        setStatusMessage('❌ Failed to inject threat payload.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error injecting threat:', error);
      setStatusMessage('❌ Error connecting to backend.');
    }
  };

  // Animate compute savings counter
  useEffect(() => {
    let currentValue = 450000;
    const interval = setInterval(() => {
      currentValue += Math.random() * 10 + 5;
      setComputeSaved(Math.floor(currentValue));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Status Indicator */}
      <div className="bg-slate-900 border-l-4 border-neon-green p-4 rounded-sm">
        <h3 className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-3">
          Swarm Status
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {swarmHalted ? (
            <>
              <Lock className="text-neon-red animate-pulse" size={20} />
              <GlowingText color="red">HALTED</GlowingText>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              <GlowingText>{metrics.swarm_status}</GlowingText>
            </>
          )}
        </div>
        {metrics.authorization_pending && (
          <div className="flex items-center gap-2 text-sm font-mono text-yellow-400 bg-yellow-500/10 p-2 rounded">
            <AlertTriangle size={14} />
            <span>{metrics.last_auth_action}</span>
          </div>
        )}
      </div>

      {/* HALT SWARM Button */}
      <button
        onClick={() => setSwarmHalted(!swarmHalted)}
        className={`
          w-full py-4 px-4 font-mono font-bold text-lg uppercase tracking-widest
          transition-all duration-300 rounded-sm
          border-2
          ${
            swarmHalted
              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-neon-red/10 border-neon-red text-neon-red hover:bg-neon-red/20 hover:shadow-neon-red active:scale-95'
          }
        `}
        disabled={swarmHalted}
      >
        {swarmHalted ? '⊘ SWARM HALTED' : '⊘ HALT SWARM'}
      </button>

      {/* AUTHORIZE PR Button */}
      <button
        className={`
          w-full py-4 px-4 font-mono font-bold text-lg uppercase tracking-widest
          transition-all duration-300 rounded-sm
          border-2 bg-neon-green/10 border-neon-green text-neon-green
          hover:bg-neon-green/20 hover:shadow-neon-green active:scale-95
          ${metrics.authorization_pending ? '' : 'opacity-50 cursor-not-allowed'}
        `}
        disabled={!metrics.authorization_pending}
      >
        ✓ AUTHORIZE PR
      </button>

      {/* Metrics Cards */}
      <div className="space-y-2">
        {/* Dead Air Comms */}
        <div className="bg-slate-900 border-l-4 border-neon-green/50 p-3 rounded-sm">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
            Dead Air Comms
          </div>
          <div className="text-xl font-mono font-bold text-neon-green">
            {metrics.dead_air_comms}
          </div>
        </div>

        {/* Compute Saved */}
        <div className="bg-slate-900 border-l-4 border-neon-green p-3 rounded-sm">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
            Compute Saved (This Month)
          </div>
          <div className="text-2xl font-mono font-bold">
            <GlowingText intensity="high">${computeSaved.toLocaleString()}</GlowingText>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            of $487,234 target
          </div>
        </div>
      </div>

      {/* Authorization Status */}
      <div className="bg-slate-800 border-l-4 border-yellow-500 p-3 rounded-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-yellow-400" size={16} />
          <div>
            <div className="text-xs font-mono text-yellow-400 uppercase tracking-widest">
              Authorization Required
            </div>
            <div className="text-sm font-mono text-yellow-200 mt-1">
              Review threat and approve GitHub PR merge
            </div>
          </div>
        </div>
      </div>

      {/* Inject Threat Form */}
      <div className="bg-slate-900 border-l-4 border-neon-red p-4 rounded-sm space-y-3">
        <h3 className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-1 text-neon-red">
          Simulate Threat (SOC Terminal)
        </h3>
        
        <div>
          <label className="text-xs text-slate-500 font-mono">Target Repository</label>
          <input 
            type="text" 
            value={repoName} 
            onChange={(e) => setRepoName(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm font-mono p-1 rounded border border-slate-700"
          />
        </div>
        
        <div>
          <label className="text-xs text-slate-500 font-mono">Vulnerable File</label>
          <input 
            type="text" 
            value={filePath} 
            onChange={(e) => setFilePath(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm font-mono p-1 rounded border border-slate-700"
          />
        </div>
        
        <div>
          <label className="text-xs text-slate-500 font-mono">Severity</label>
          <select 
            value={severity} 
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm font-mono p-1 rounded border border-slate-700"
          >
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs text-slate-500 font-mono">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm font-mono p-1 rounded border border-slate-700 h-16"
          />
        </div>
        
        <div>
          <label className="text-xs text-slate-500 font-mono">Snippet</label>
          <textarea 
            value={snippet} 
            onChange={(e) => setSnippet(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm font-mono p-1 rounded border border-slate-700 h-16"
          />
        </div>
        
        <button
          onClick={handleInjectThreat}
          disabled={loading}
          className={`w-full py-2 bg-neon-green text-black font-mono font-bold text-sm rounded-sm hover:bg-neon-green/80 transition-colors uppercase ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Inject Threat Payload'}
        </button>
          
        {statusMessage && (
          <div className="mt-2 text-xs font-mono text-center text-white bg-slate-800 p-2 rounded">
            {statusMessage}
          </div>
        )}
          
        {loading && (
          <div className="mt-2 text-xs font-mono text-neon-green animate-pulse text-center">
            [SYSTEM]: {loadingSteps[loadingStep]}
          </div>
        )}
      </div>
    </div>
  );
}
