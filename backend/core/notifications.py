import os
import requests
import logging

logger = logging.getLogger(__name__)

def send_discord_alert(pr_url: str, cve_id: str, repo: str):
    """
    Sends a high-fidelity Discord notification using Rich Embeds.
    Triggered when the MI300X Remediation Swarm successfully opens a PR.
    """
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    
    if not webhook_url:
        logger.warning("🔔 ALERT: DISCORD_WEBHOOK_URL not set. Skipping notification.")
        return

    # Discord Embed Payload for a professional security alert
    payload = {
        "username": "ChainReflex OS // Remediation Swarm",
        "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1200px-AMD_Logo.svg.png",
        "embeds": [
            {
                "title": "🛡️ THREAT MITIGATED: Autonomous Remediation Success",
                "description": f"The **MI300X Remediation Swarm** has successfully synthesized and deployed a security patch for **{cve_id}**.",
                "color": 65280,  # Green
                "fields": [
                    {
                        "name": "📦 Target Repository",
                        "value": f"`{repo}`",
                        "inline": True
                    },
                    {
                        "name": "🚩 Vulnerability",
                        "value": f"`{cve_id}`",
                        "inline": True
                    },
                    {
                        "name": "🚀 Pull Request Link",
                        "value": f"[View Autonomous Fix on GitHub]({pr_url})",
                        "inline": False
                    }
                ],
                "footer": {
                    "text": "Powered by AMD MI300X // ChainReflex-OS Agentic Swarm"
                }
            }
        ]
    }

    try:
        response = requests.post(webhook_url, json=payload, timeout=10)
        response.raise_for_status()
        logger.info(f"✅ Discord alert dispatched for {cve_id}")
    except Exception as e:
        logger.error(f"❌ Failed to dispatch Discord alert: {str(e)}")
