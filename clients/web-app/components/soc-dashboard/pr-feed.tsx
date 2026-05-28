'use client';

import { useEffect, useState } from 'react';
import { GlowingText } from './glowing-text';
import { ExternalLink, GitPullRequest } from 'lucide-react';

type PR = {
  id: string;
  prNumber: string;
  vulnerability: string;
  status: string;
  timestamp: string;
  repository: string;
  url: string;
};

export function PRFeed() {
  const [prs, setPrs] = useState<PR[]>([]);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const fetchPRs = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/remediations`);
        const data = await response.json();
        if (Array.isArray(data)) setPrs(data);
      } catch (err) {
        console.error("PR Sync Failed:", err);
      }
    };
    
    fetchPRs();
    const interval = setInterval(fetchPRs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-slate-900 border-l-4 border-neon-green/50 p-4 rounded-sm">
      <div className="border-b border-slate-700 pb-2 mb-3">
        <h2 className="text-xs font-mono text-slate-300 uppercase tracking-widest">
          Live GitOps PR Feed
        </h2>
        <p className="text-xs text-slate-500 mt-1">Real-time status of AI-generated Pull Requests</p>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
        {prs.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-slate-500 text-xs font-mono">No active PRs found.</p>
          </div>
        ) : (
          prs.map((pr) => (
            <div key={pr.id} className="bg-slate-800 p-2 rounded-sm border border-slate-700 hover:border-neon-green transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="text-neon-green" size={14} />
                  <span className="text-xs font-mono font-bold text-neon-green">PR #{pr.prNumber}</span>
                </div>
                <span className={`text-xs font-mono ${pr.status === 'MERGED' ? 'text-blue-400' : 'text-neon-green'}`}>
                  {pr.status}
                </span>
              </div>
              <p className="text-sm font-mono text-slate-300 mt-1 truncate">{pr.vulnerability}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-mono text-slate-500">{pr.repository}</span>
                <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-green hover:underline flex items-center gap-1">
                  View on GitHub <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
