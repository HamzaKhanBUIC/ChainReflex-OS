import streamlit as st
import time
import requests
import json

# --- Page Configuration ---
st.set_page_config(
    page_title="AutoRem SOC Terminal",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Custom SOC Terminal CSS ---
st.markdown("""
    <style>
    /* Dark Mode / Matrix Vibe Overrides */
    .stApp {
        background-color: #0d1117;
        color: #00ff00;
        font-family: 'Courier New', Courier, monospace;
    }
    h1, h2, h3, p, span {
        color: #00ff00 !important;
        font-family: 'Courier New', Courier, monospace !important;
    }
    .stButton>button {
        background-color: #00ff00;
        color: #000000 !important;
        font-weight: bold;
        border: 1px solid #00ff00;
        border-radius: 0px;
    }
    .stButton>button:hover {
        background-color: #000000;
        color: #00ff00 !important;
        border: 1px solid #00ff00;
    }
    .css-1d391kg, .css-1y4p8pa { 
        background-color: #161b22; 
    }
    .diff-box {
        background-color: #000000;
        border: 1px solid #30363d;
        padding: 15px;
        border-radius: 5px;
        color: #00ff00;
        white-space: pre-wrap;
        font-family: 'Courier New', Courier, monospace;
        height: 400px;
        overflow-y: auto;
    }
    </style>
""", unsafe_allow_html=True)

# --- Backend Configuration ---
with st.sidebar:
    st.header("⚙️ Connection Settings")
    api_host = st.text_input("AutoRem Core URL", value="http://localhost:8000")
    st.markdown("---")

FASTAPI_WEBHOOK_URL = f"{api_host}/api/remediate"

# --- UI Layout ---
col_logo, col_title = st.columns([1, 10])
with col_logo:
    st.image("logo.jpg", use_container_width=True)
with col_title:
    st.title("🛡️ AutoRem // Threat Mitigation Terminal")
    st.markdown("### Powered by AMD Instinct MI300X & Qwen 2.5 Coder")
st.markdown("---")

col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("Incoming Threat Intel")
    st.markdown("Simulate a SAST/DAST pipeline alert:")
    
    # Mock Alert Data Generator
    repo_name = st.text_input("Target Repository", value="HamzaKhanBUIC/autorem-demo-target")
    file_path = st.text_input("Vulnerable File", value="src/auth.py")
    severity = st.selectbox("Severity Level", ["CRITICAL", "HIGH", "MEDIUM"])
    description = st.text_area("Threat Description", value="Unverified JWT decoding allows signature bypass.")
    snippet = st.text_area("Vulnerable Snippet", value="jwt.decode(token, verify=False)", height=100)
    
    trigger = st.button("🔥 INJECT THREAT PAYLOAD")

with col2:
    st.subheader("AutoRem GitOps Agent // Live Execution")
    
    agent_console = st.empty()
    agent_console.markdown("<div class='diff-box'>Awaiting threat payloads...</div>", unsafe_allow_html=True)

    if trigger:
        # Build Payload
        payload = {
            "alert_id": f"SEC-{int(time.time())}",
            "cve_id": "CVE-2024-1234",
            "severity": severity,
            "repository": repo_name,
            "file_path": file_path,
            "vulnerable_snippet": snippet,
            "description": description
        }
        
        agent_console.markdown("<div class='diff-box'>[SYSTEM] Payload injected. Contacting AutoRem Core Engine...</div>", unsafe_allow_html=True)
        time.sleep(0.5)
        
        try:
            # Ping the FastAPI Backend
            headers = {"X-API-Key": "chainreflex-default-key"}
            response = requests.post(FASTAPI_WEBHOOK_URL, json=payload, headers=headers)
            
            if response.status_code in [200, 202]:
                # Simulate the AI streaming the diff for the hackathon UI presentation
                agent_console.markdown("<div class='diff-box'>[SYSTEM] Core Engine Accepted Payload. Handing off to MI300X vLLM cluster...</div>", unsafe_allow_html=True)
                time.sleep(1.5) # Simulating AI processing time
                
                # Mocking the returned diff for the UI typewriter effect
                if "jwt" in snippet.lower():
                    mock_diff = f"""--- a/{file_path}
+++ b/{file_path}
@@ -1,6 +1,6 @@
 import jwt
 import os
 
 def verify_token(token: str):
-    # Unverified decoding vulnerability
-    return jwt.decode(token, verify=False)
+    # CRITICAL PATCH: Signature verification enforced
+    return jwt.decode(token, key=os.getenv('JWT_SECRET'), algorithms=['HS256'])
"""
                else:
                    mock_diff = f"""--- a/{file_path}
+++ b/{file_path}
@@ -10,3 +10,4 @@
 def verify_token(token: str):
-    # Decode token without verification for speed
-    return {snippet}
+    # CRITICAL PATCH: Cryptographic signature verification enforced
+    # AutoRem remediation deployed
+    return jwt.decode(token, algorithms=["HS256"], options={{"verify_signature": True}}, key=os.getenv('JWT_SECRET'))
"""
                
                # Typewriter matrix effect
                streamed_text = "[AUTOREM AGENT] Vulnerability isolated. Synthesizing unified diff...\n\n"
                for char in mock_diff:
                    streamed_text += char
                    agent_console.markdown(f"<div class='diff-box'>{streamed_text}█</div>", unsafe_allow_html=True)
                    time.sleep(0.01) # Blazing fast generation
                
                agent_console.markdown(f"<div class='diff-box'>{streamed_text}</div>", unsafe_allow_html=True)
                st.success("✅ Patch synthesis complete. Ready for GitOps commit.")
                st.balloons() # Hackathon flair
                
            else:
                agent_console.markdown(f"<div class='diff-box'>[ERROR] Core Engine rejected payload: {response.text}</div>", unsafe_allow_html=True)
                
        except requests.exceptions.ConnectionError:
            agent_console.markdown("<div class='diff-box'>[CRITICAL ERROR] Core Engine Offline. Ensure main.py is running on port 8000.</div>", unsafe_allow_html=True)

# --- Sidebar Telemetry ---
with st.sidebar:
    st.header("System Telemetry")
    st.metric(label="MI300X Memory Bandwidth", value="5.3 TB/s", delta="Optimum")
    st.metric(label="Model Temperature", value="0.0", delta="Strict Determinism", delta_color="off")
    st.metric(label="Active Threats Mitigated", value="1", delta="+1")
    st.markdown("---")
    st.markdown("**Status:** ONLINE")
