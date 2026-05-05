import time
from typing import TypedDict, Dict, Any, Optional, List
from langgraph.graph import StateGraph, END

# --- IMPORTS FROM YOUR MODULES ---
from core.schemas import SupplyChainDisruption
from agents.voice_scout import run_voice_scout
from agents.cyber_scout import run_cyber_scout
from agents.legal_brain import draft_legal_notice

# --- 1. DEFINE THE GRAPH STATE ---
class ChainReflexState(TypedDict):
    audio_path: Optional[str]
    log_data: Optional[str]
    disruption_data: Optional[SupplyChainDisruption]
    drafted_legal_notice: Optional[str]
    is_compliant: bool
    iteration_count: int

# --- 2. DEFINE THE NODES (The Agents) ---

def node_scout_swarm(state: ChainReflexState) -> Dict[str, Any]:
    print("\n🌐 [SWARM ORCHESTRATOR] Initializing multi-vector threat detection...")
    time.sleep(1)
    
    # In a real cloud environment, these would run asynchronously in parallel.
    # For this local demo, we run them sequentially.
    
    # Run Cyber Scout
    if state.get("log_data"):
        cyber_result = run_cyber_scout(state["log_data"])
        if cyber_result.severity_level == "CRITICAL":
            return {"disruption_data": cyber_result}
            
    # Run Voice Scout (Fallback if Cyber is clear)
    if state.get("audio_path"):
        voice_result = run_voice_scout(state["audio_path"])
        if voice_result.severity_level == "CRITICAL":
            return {"disruption_data": voice_result}
            
    return {"disruption_data": None}

def node_legal_brain(state: ChainReflexState) -> Dict[str, Any]:
    print("\n⚖️ [LEGAL BRAIN] Disruption confirmed. Initializing Force Majeure protocols...")
    
    disruption = state["disruption_data"]
    current_iteration = state.get("iteration_count", 0)
    
    # If the firewall sent it back, the Legal Brain rewrites it
    if current_iteration > 0:
        print("   ↳ [REWRITE] Adjusting legal demand to comply with security policies...")
        time.sleep(1.5)
        draft = f"Subject: URGENT Notice regarding {disruption.location}\nDue to the recent {disruption.affected_materials} incident, we are requesting an immediate review of routing protocols per standard security measures."
    else:
        # First attempt: Aggressive and leaks internal budget (to trigger firewall)
        draft = draft_legal_notice(
            disruption_data={"location": disruption.location, "materials": disruption.affected_materials}, 
            contract_text="Standard MSA"
        )
        # Injecting a security violation for the demo
        draft += "\nINTERNAL NOTE: We are willing to authorize up to $50,000 in emergency ransomware payouts."
        
    return {
        "drafted_legal_notice": draft,
        "iteration_count": current_iteration + 1
    }

def node_firewall(state: ChainReflexState) -> Dict[str, Any]:
    print("\n🛡️ [ZERO-TRUST FIREWALL] Auditing legal draft for data leakage...")
    time.sleep(1.5)
    
    draft = state["drafted_legal_notice"]
    
    if "$50,000" in draft or "ransomware payouts" in draft.lower():
        print("   ❌ [BREACH PREVENTED] Draft contains unauthorized financial commitments!")
        return {"is_compliant": False}
        
    print("   ✅ [APPROVED] Draft is secure and complies with corporate policy.")
    return {"is_compliant": True}

# --- 3. CONDITIONAL ROUTING ---
def check_compliance(state: ChainReflexState) -> str:
    if state["is_compliant"]:
        return "end"
    
    if state["iteration_count"] >= 3:
        print("\n⚠️ [SYSTEM HALT] Max iterations reached. Human intervention required.")
        return "end"
        
    return "rewrite"

# --- 4. COMPILE THE GRAPH ---
workflow = StateGraph(ChainReflexState)

workflow.add_node("Scouts", node_scout_swarm)
workflow.add_node("Legal", node_legal_brain)
workflow.add_node("Firewall", node_firewall)

workflow.set_entry_point("Scouts")
workflow.add_edge("Scouts", "Legal")
workflow.add_edge("Legal", "Firewall")
workflow.add_conditional_edges(
    "Firewall",
    check_compliance,
    {
        "rewrite": "Legal",
        "end": END
    }
)

app = workflow.compile()

# --- 5. EXECUTE THE DEMO ---
if __name__ == "__main__":
    print("🚀 BOOTING CHAINREFLEX AI SYSTEM...")
    
    # The Mock Data to trigger the Cyber Scout
    mock_nginx_logs = """
    192.168.1.50 - - [05/May/2026:14:10:00 +0000] "GET /api/logistics HTTP/1.1" 200
    10.0.0.5 - - [05/May/2026:14:10:05 +0000] "POST /api/v1/encrypt_payload HTTP/1.1" 403
    10.0.0.5 - - [05/May/2026:14:10:06 +0000] "WARN: Ransomware signature matched in payload"
    """
    
    initial_state = {
        "audio_path": "panic_voicemail.wav",
        "log_data": mock_nginx_logs,
        "iteration_count": 0,
        "is_compliant": False
    }
    
    # Run the graph
    app.invoke(initial_state)
    
    print("\n🎉 [SUCCESS] Autonomous threat neutralized and legal response finalized.")