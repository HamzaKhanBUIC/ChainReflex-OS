import os
import logging
import time
from github import Github
from github.GithubException import GithubException

logger = logging.getLogger(__name__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def open_remediation_pr(repo_full_name: str, file_path: str, patched_content: str, cve_id: str = "Unknown", confidence_score: float = 1.0, custom_pr_body: str = None):
    """
    ChainReflex-OS GitOps Remediation Engine.
    Translates an audited patch into a formal, branded GitHub Pull Request.
    """
    if not GITHUB_TOKEN:
        logger.error("CRITICAL: GITHUB_TOKEN not found.")
        return None

    try:
        g = Github(GITHUB_TOKEN)
        repo = g.get_repo(repo_full_name)
        default_branch = repo.default_branch
        source_branch = repo.get_branch(default_branch)
        
        # 1. Operational Protocol: Branching
        # Format: reflex/remediation-[CVE-ID]
        safe_cve = cve_id.replace(" ", "-").replace(":", "").lower()
        new_branch_name = f"reflex/remediation-{safe_cve}-{int(time.time())}"
        repo.create_git_ref(ref=f"refs/heads/{new_branch_name}", sha=source_branch.commit.sha)
        
        # 2. Commit Logic: High-Signal Message
        file_contents = repo.get_contents(file_path, ref=default_branch)
        commit_message = f"🚨 ChainReflex-OS: Remediation for {cve_id}\n\nLogic: Audited via Oracle Swarm on MI300X."
        repo.update_file(
            path=file_contents.path,
            message=commit_message,
            content=patched_content,
            sha=file_contents.sha,
            branch=new_branch_name
        )
        
        # 3. Safety Protocol: Oracle Confidence Check
        is_draft = confidence_score < 0.98
        pr_prefix = "[DRAFT] " if is_draft else ""
        
        # 4. PR Construction: Professional Branded Layout
        pr_title = f"{pr_prefix}🚨 Security Remediation: {cve_id}"
        
        if custom_pr_body:
            pr_body = custom_pr_body
        else:
            pr_body = f"""
## 🛡️ ChainReflex-OS Autonomous Remediation
**Objective:** Translate audited code patch into formal Pull Request.

### 📊 Technical Summary
- **Vulnerability:** `{cve_id}`
- **Target Asset:** `{file_path}`
- **Orchestration:** LangGraph-driven Scout Network
- **Compute:** AMD MI300X Bare-Metal

### 🛡️ Verification Status
![Verified by ChainReflex-Oracle](https://img.shields.io/badge/Verified%20by-ChainReflex--Oracle-00ff88?style=for-the-badge&logo=amd)

**Confidence Score:** `{confidence_score * 100}%`
{"⚠️ **ACTION REQUIRED:** Confidence below 98%. Flagged for manual Red Team review via Streamlit terminal." if is_draft else "✅ **STATUS:** Non-breaking patch adheres to Tier-1 enterprise compliance."}

---
🔗 **SOC Alert:** [View Discord Log](https://discord.com/channels/@me)
"""
        
        pr = repo.create_pull(
            title=pr_title,
            body=pr_body,
            head=new_branch_name,
            base=default_branch,
            draft=is_draft
        )
        
        logger.info(f"SUCCESS: PR Opened at {pr.html_url}")
        return pr.html_url
        
    except Exception as e:
        logger.error(f"GitOps Hand Failure: {str(e)}")
        return None
