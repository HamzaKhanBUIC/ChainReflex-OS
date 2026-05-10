'use client';

export interface ThreatEntry {
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  details: {
    pipeline?: string;
    agent?: string;
    thought_process?: string;
    action?: string;
  };
}

export interface HardwareMetrics {
  vram_used: number;
  vram_total: number;
  kv_cache_usage: number;
  tokens_per_sec: number;
  model: string;
  uptime: string;
}

export function generateMockThreats(): ThreatEntry[] {
  const currentTime = new Date();
  
  return [
    {
      timestamp: new Date(currentTime.getTime() - 45000).toISOString(),
      severity: 'critical',
      type: 'CYBER_SCOUT_DETECTION',
      message: 'Potential supply chain attack detected in CI/CD pipeline',
      details: {
        pipeline: 'main-deploy-prod',
        agent: 'Oracle-Agent-7',
        thought_process: `
<thought_process>
Detected anomalous dependency pull from npm registry. Package signature validation failed for @chainreflex/core@2.1.0. 
Pattern matches known supply chain attack vector.

Decision: Flag for human review.
Confidence: 96.4%
Recommendation: HALT swarm operations, escalate to security team.
</thought_process>
        `,
        action: 'ESCALATED_FOR_REVIEW',
      },
    },
    {
      timestamp: new Date(currentTime.getTime() - 30000).toISOString(),
      severity: 'high',
      type: 'ANOMALY_DETECTED',
      message: 'Unusual GPU memory pattern detected on node-5',
      details: {
        agent: 'Hardware-Monitor-2',
        thought_process: `
<thought_process>
GPU memory allocation spike: 156GB -> 182GB in 2.3 seconds.
Normal allocation rate: 8-12GB/min
Current rate: 26GB/min

Possible causes:
1. Model loading sequence initiated (30% likely)
2. Memory leak in batch processor (15% likely)
3. External process interference (55% likely)

Action: Continue monitoring, alert if exceeds 190GB.
</thought_process>
        `,
      },
    },
    {
      timestamp: new Date(currentTime.getTime() - 15000).toISOString(),
      severity: 'medium',
      type: 'LATENCY_WARNING',
      message: 'Token generation latency increased by 23%',
      details: {
        agent: 'Performance-Analyzer-1',
        thought_process: `
<thought_process>
Current tokens/sec: 847
Previous baseline: 1104
Degradation: 23.2%

Contributing factors:
- Network congestion detected (45%)
- Cache coherency overhead (30%)
- Swarm communication overhead (25%)

No immediate intervention required. Status: MONITORING
</thought_process>
        `,
      },
    },
    {
      timestamp: new Date(currentTime.getTime() - 5000).toISOString(),
      severity: 'low',
      type: 'INFO_LOG',
      message: 'Swarm consensus achieved on batch 7924-B',
      details: {
        agent: 'Consensus-Manager-3',
        thought_process: `
<thought_process>
All 8 agents reached consensus: APPROVED
Computation validity verified across all nodes.
Batch will proceed to deployment.
Time to consensus: 2.4 seconds
</thought_process>
        `,
      },
    },
  ];
}

export function generateMockHardwareMetrics(): HardwareMetrics {
  return {
    vram_used: 156,
    vram_total: 192,
    kv_cache_usage: 81.25,
    tokens_per_sec: 847,
    model: 'AMD MI300X',
    uptime: '14d 7h 23m',
  };
}

export function generateMockROIMetrics() {
  return {
    dead_air_comms: '0.3s avg',
    compute_saved_this_month: '$487,234',
    swarm_status: 'ACTIVE',
    authorization_pending: true,
    last_auth_action: 'Supply chain threat escalated',
  };
}
