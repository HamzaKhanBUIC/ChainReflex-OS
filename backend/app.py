import streamlit as st
import time

# --- MUST BE THE VERY FIRST COMMAND ---
st.set_page_config(page_title="ChainReflex OS | Command Center", page_icon="🌐", layout="wide")

# --- CUSTOM ENTERPRISE CSS ---
st.markdown("""
    <style>
    /* Dark mode corporate aesthetic */
    .stApp {
        background-color: #0E1117;
        color: #C9D1D9;
    }
    /* Metric Cards */
    div[data-testid="metric-container"] {
        background-color: #161B22;
        border: 1px solid #30363D;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    /* Terminal Box for AI Output */
    .terminal-box {
        background-color: #000000;
        color: #00FF00;
        font-family: 'Courier New', Courier, monospace;
        padding: 20px;
        border-radius: 5px;
        border: 1px solid #333;
        height: 400px;
        overflow-y: auto;
    }
    /* Hide Streamlit Branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1200px-AMD_Logo.svg.png", width=150)
    st.title("ChainReflex OS")
    st.markdown("### AMD MI300X Powered")
    st.divider()
    page = st.radio("Navigation", ["🛡️ Command Center", "ℹ️ About the System", "⚙️ Hardware Metrics"])
    
    st.divider()
    st.markdown("**System Status:** 🟢 ONLINE")
    st.markdown("**Active Agents:** 4")

# --- PAGE: ABOUT THE SYSTEM ---
if page == "ℹ️ About the System":
    st.title("System Architecture")
    st.markdown("### Built for the AMD Developer Hackathon")
    st.write("""
    **ChainReflex** is an autonomous, multi-agent Supply Chain Defense system.
    Unlike standard chatbots, ChainReflex acts as a digital Chief Operations Officer, bridging physical disasters and digital cybersecurity.
    
    **Under the Hood:**
    * **Compute:** AMD Developer Cloud (MI300X Instances)
    * **Orchestration:** LangGraph state-machine for autonomous feedback loops.
    * **Swarm Intelligence:** * 📸 **Vision Scout:** Llama-3.2-Vision (Multimodal infrastructure damage assessment)
        * 🎤 **Voice Scout:** Whisper-large-v3 (Audio ingestion for field reports)
        * 💻 **Cyber Scout:** High-context log parsing for Zero-Day threat detection
        * ⚖️ **Legal Brain:** 70B parameter model for Force Majeure contract negotiation
        * 🛡️ **Zero-Trust Firewall:** Internal compliance agent to prevent data leakage
    """)

# --- PAGE: HARDWARE METRICS ---
elif page == "⚙️ Hardware Metrics":
    st.title("AMD MI300X Accelerator Status")
    st.markdown("*(Simulated Telemetry)*")
    
    col1, col2, col3 = st.columns(3)
    col1.metric("VRAM Utilization", "142 / 192 GB", "+12GB (Heavy Load)")
    col2.metric("GPU Temperature", "62°C", "-2°C")
    col3.metric("vLLM Inference Speed", "114 tokens/s", "Optimal")
    
    st.progress(74) # VRAM Progress bar

# --- PAGE: COMMAND CENTER (THE MAIN DEMO) ---
elif page == "🛡️ Command Center":
    st.title("Global Threat Radar")
    
    # Top Metrics
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Global Routes Monitored", "1,204")
    c2.metric("Active Suppliers", "342")
    c3.metric("Threat Level", "ELEVATED", "-")
    c4.metric("Autonomy Confidence", "98.4%")
    
    st.divider()
    
    # The Trigger Area
    st.subheader("Data Ingestion Swarm")
    col_input, col_terminal = st.columns([1, 2])
    
    with col_input:
        st.markdown("**Trigger Disaster Scenario:**")
        event_type = st.selectbox("Select Threat Vector", ["Select...", "Upload Drone Image (Vision)", "Upload Driver Voicemail (Audio)", "Upload Nginx Server Logs (Cyber)"])
        
        trigger_btn = st.button("🚀 INITIALIZE AUTONOMOUS RESPONSE", type="primary", use_container_width=True)
        
    with col_terminal:
        st.markdown("**LangGraph Orchestrator Output:**")
        terminal_placeholder = st.empty()
        
        # Initial empty terminal
        terminal_placeholder.markdown('<div class="terminal-box">Waiting for system trigger...</div>', unsafe_allow_html=True)
        
        if trigger_btn and event_type != "Select...":
            # --- SIMULATING THE MAIN.PY EXECUTION ---
            output_lines = []
            
            def add_to_terminal(text):
                output_lines.append(text)
                html_content = "<br>".join(output_lines)
                terminal_placeholder.markdown(f'<div class="terminal-box">{html_content}</div>', unsafe_allow_html=True)
            
            add_to_terminal("🚀 BOOTING CHAINREFLEX MULTI-AGENT SYSTEM...")
            time.sleep(1)
            add_to_terminal("🌐 [SWARM ORCHESTRATOR] Initializing multi-vector threat detection...")
            time.sleep(1.5)
            
            if "Cyber" in event_type:
                add_to_terminal("🖥️ [CYBER SCOUT] Ingesting raw network logs (14,204 lines)...")
                time.sleep(1)
                add_to_terminal('   <span style="color:red;">⚠️ [ALERT] Cryptographic anomalies detected (Ransomware signature)!</span>')
            else:
                add_to_terminal("📸 [VISION SCOUT] Analyzing physical infrastructure data...")
                time.sleep(1)
                add_to_terminal('   <span style="color:orange;">⚠️ [ALERT] Port Flooding detected. Critical delay.</span>')
                
            time.sleep(1.5)
            add_to_terminal("⚖️ [LEGAL BRAIN] Drafting Force Majeure response to supplier...")
            time.sleep(1.5)
            add_to_terminal('🛡️ [ZERO-TRUST FIREWALL] Auditing legal draft...')
            time.sleep(1)
            add_to_terminal('   <span style="color:red;">❌ [BREACH PREVENTED] Draft leaked $50,000 internal budget limit. Routing back to Legal Brain.</span>')
            time.sleep(2)
            add_to_terminal("⚖️ [LEGAL BRAIN] Rewriting draft to comply with strict security protocols...")
            time.sleep(1)
            add_to_terminal('🛡️ [ZERO-TRUST FIREWALL] Auditing revised draft...')
            add_to_terminal('   ✅ [APPROVED] Draft is secure. Executing transmission.')
            
            time.sleep(0.5)
            st.success("Autonomous threat neutralized successfully.")
            st.balloons()