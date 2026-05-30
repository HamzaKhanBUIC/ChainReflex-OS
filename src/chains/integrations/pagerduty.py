import os
import requests
import logging
from src.core.telemetry import add_log

logger = logging.getLogger("PagerDuty-Integration")

def trigger_sev1_alarm(cve_id: str, repository: str, details: str):
    """
    Triggers a PagerDuty Sev-1 alarm to wake up on-call engineers.
    """
    routing_key = os.getenv("PAGERDUTY_ROUTING_KEY")
    url = "https://events.pagerduty.com/v2/enqueue"
    
    add_log("INTEGRATION", f"⚠️ INITIATING PAGERDUTY SEV-1 ALARM FOR {cve_id}...", "alert")
    
    if not routing_key:
        logger.info("PAGERDUTY_ROUTING_KEY not found. Simulating physical alarm.")
        add_log("INTEGRATION", "PagerDuty call dispatched to on-call engineers.", "alert")
        return True

    payload = {
        "routing_key": routing_key,
        "event_action": "trigger",
        "payload": {
            "summary": f"CRITICAL: {cve_id} detected in {repository}",
            "severity": "critical",
            "source": "ChainReflex-OS",
            "custom_details": {"description": details}
        }
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 202:
            add_log("INTEGRATION", "PagerDuty call dispatched to on-call engineers.", "alert")
            return True
    except Exception as e:
        logger.error(f"PagerDuty API Error: {e}")
    
    return False
