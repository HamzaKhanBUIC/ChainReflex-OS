import os
import sys
from dotenv import load_dotenv

# Ensure we can import from core
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from core.github_integration import open_remediation_pr

repo = "HamzaKhanBUIC/autorem-demo-target"
file_path = "README.md"
patched_code = "# ChainReflex-OS Test\nThis is a test PR created by the AI assistant to verify connectivity."
pr_title = "Test PR from AI Assistant"

print("Starting GitHub PR test...")
print(f"Target Repo: {repo}")
print(f"File: {file_path}")

pr_url = open_remediation_pr(repo, file_path, patched_code, pr_title)

if pr_url:
    print(f"\n✅ SUCCESS! PR created at: {pr_url}")
else:
    print("\n❌ Failed to create PR. Check for error messages above.")
