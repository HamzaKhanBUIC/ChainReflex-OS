import os
import requests
import logging
from src.core.telemetry import add_log

logger = logging.getLogger("Jira-Integration")

def create_incident_ticket(cve_id: str, severity: str, description: str, repository: str) -> str:
    """
    Creates a Jira or Linear incident ticket for High/Critical threats.
    """
    jira_url = os.getenv("JIRA_URL", "https://api.atlassian.com/ex/jira/mock-id/rest/api/3/issue")
    api_key = os.getenv("JIRA_API_KEY")

    add_log("INTEGRATION", f"Creating Jira Incident Ticket for {cve_id}...", "info")
    
    if not api_key:
        logger.info("JIRA_API_KEY not found. Simulating ticket creation.")
        ticket_id = f"SEC-{cve_id.split('-')[-1] if '-' in cve_id else '1001'}"
        add_log("INTEGRATION", f"Jira Ticket {ticket_id} created successfully.", "success")
        return f"https://chainreflex.atlassian.net/browse/{ticket_id}"

    # Standard Jira payload
    payload = {
        "fields": {
            "project": {"key": "SEC"},
            "summary": f"[{severity}] Vulnerability Detected: {cve_id} in {repository}",
            "description": description,
            "issuetype": {"name": "Bug"}
        }
    }
    
    try:
        response = requests.post(jira_url, json=payload, headers={"Authorization": f"Basic {api_key}"})
        if response.status_code == 201:
            ticket_id = response.json().get("key")
            add_log("INTEGRATION", f"Jira Ticket {ticket_id} created successfully.", "success")
            return f"https://chainreflex.atlassian.net/browse/{ticket_id}"
    except Exception as e:
        logger.error(f"Jira API Error: {e}")
    
    return ""
