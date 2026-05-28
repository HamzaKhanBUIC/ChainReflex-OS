# --- CHAINREFLEX OS TELEMETRY HUB ---
# This module centralizes logs for the Next.js frontend

system_logs = [
    {"agent": "SYSTEM", "message": "ChainReflex OS v4.2.1 initialized", "type": "system"},
    {"agent": "SYSTEM", "message": "AMD MI300X Bare-Metal Cluster: ONLINE", "type": "success"}
]

def add_log(agent: str, message: str, log_type: str = "info"):
    global system_logs
    system_logs.append({"agent": agent, "message": message, "type": log_type})
    # Keep the last 50 logs to prevent memory bloat
    if len(system_logs) > 50:
        system_logs.pop(0)

def get_logs():
    return system_logs
