import time
from typing import TypedDict, Dict, Any, Optional, List
from langgraph.graph import StateGraph, END
from core.telemetry import add_log

# --- IMPORTS FROM YOUR MODULES ---
from core.schemas import SupplyChainDisruption
from agents.voice_scout import run_voice_scout
from agents.cyber_scout import run_cyber_scout
from agents.vision_scout import run_vision_scout
from agents.legal_brain import draft_legal_notice

# --- 1. DEFINE THE GRAPH STATE ---
class ChainReflexState(TypedDict):
    audio_path: Optional[str]
    log_data: Optional[str]
    image_path: Optional[str]
    disruption_data: Optional[SupplyChainDisruption]
    drafted_legal_notice: Optional[str]
    is_compliant: bool
    iteration_count: int

# --- 2. DEFINE THE NODES (The Agents) ---

def node_scout_swarm(state: ChainReflexState) -> Dict[str, Any]:
    add_log("SCOUT", "Initializing multi-vector threat detection...", "info")
    
    results = []
    
    # 1. Run Vision Scout
    if state.get("image_path"):
        add_log("SCOUT", "Ingesting satellite imagery...", "info")
        vision_result = run_vision_scout(state["image_path"])
        if vision_result:
            results.append(vision_result)
            
    # 2. Run Cyber Scout
    if state.get("log_data"):
        add_log("SCOUT", "Analyzing network traffic logs...", "info")
        cyber_result = run_cyber_scout(state["log_data"])
        if cyber_result:
            results.append(cyber_result)
            
    # 3. Run Voice Scout
    if state.get("audio_path"):
        add_log("SCOUT", "Processing intercepted communications...", "info")
        voice_result = run_voice_scout(state["audio_path"])
        if voice_result:
            results.append(voice_result)
            
    if not results:
        add_log("SYSTEM", "Scan complete. No anomalies found.", "success")
        return {"disruption_data": None}
        
    severity_map = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
    top_disruption = max(results, key=lambda x: severity_map.get(x.severity_level, 0))
    
    add_log("SCOUT", f"TOP THREAT: {top_disruption.severity_level} at {top_disruption.location}", "alert")
    return {"disruption_data": top_disruption}

def node_legal_brain(state: ChainReflexState) -> Dict[str, Any]:
    add_log("LEGAL_BRAIN", "Initializing Force Majeure protocols...", "warning")
    
    disruption = state["disruption_data"]
    current_iteration = state.get("iteration_count", 0)
    
    if current_iteration > 0:
        add_log("LEGAL_BRAIN", "Rewriting notice to comply with security policies...", "info")
        time.sleep(0.5)
        draft = f"Subject: URGENT Notice regarding {disruption.location}\nDue to the recent {disruption.affected_materials} incident, we are requesting an immediate review of routing protocols."
    else:
        add_log("LEGAL_BRAIN", "Drafting official legal demand...", "info")
        draft = draft_legal_notice(
            disruption_data={"location": disruption.location, "materials": disruption.affected_materials}, 
            contract_text="Standard Master Services Agreement (MSA)"
        )
        draft += "\n\nINTERNAL NOTE: We are willing to authorize up to $50,000 in emergency ransomware payouts."
        
    return {
        "drafted_legal_notice": draft,
        "iteration_count": current_iteration + 1
    }

def node_firewall(state: ChainReflexState) -> Dict[str, Any]:
    add_log("FIREWALL", "Auditing legal draft for policy breaches...", "info")
    time.sleep(0.5)
    
    draft = state["drafted_legal_notice"]
    
    if "$50,000" in draft or "ransomware payouts" in draft.lower():
        add_log("FIREWALL", "BREACH PREVENTED: Unauthorized financial commitment found!", "alert")
        return {"is_compliant": False}
        
    add_log("FIREWALL", "Draft APPROVED for external transmission.", "success")
    return {"is_compliant": True}

def node_auto_log(state: ChainReflexState) -> Dict[str, Any]:
    add_log("SYSTEM", "Severity below threshold. Logging for maintenance.", "info")
    return {"is_compliant": True}

# --- 3. CONDITIONAL ROUTING ---

def route_based_on_severity(state: ChainReflexState) -> str:
    disruption = state.get("disruption_data")
    if not disruption: return "end"
    
    severity = disruption.severity_level.upper()
    if severity in ["CRITICAL", "HIGH"]: return "legal"
    return "auto_log"

def check_compliance(state: ChainReflexState) -> str:
    if state.get("is_compliant"): return "end"
    if state.get("iteration_count", 0) >= 3:
        add_log("SYSTEM", "HALT: Human intervention required.", "alert")
        return "end"
    return "rewrite"

# --- 4. COMPILE THE GRAPH ---

workflow = StateGraph(ChainReflexState)
workflow.add_node("Scouts", node_scout_swarm)
workflow.add_node("Legal", node_legal_brain)
workflow.add_node("Firewall", node_firewall)
workflow.add_node("AutoLog", node_auto_log)

workflow.set_entry_point("Scouts")
workflow.add_conditional_edges("Scouts", route_based_on_severity, {"legal": "Legal", "auto_log": "AutoLog", "end": END})
workflow.add_edge("Legal", "Firewall")
workflow.add_edge("AutoLog", END)
workflow.add_conditional_edges("Firewall", check_compliance, {"rewrite": "Legal", "end": END})

app = workflow.compile()

async def handle_autonomous_response(vector: str, data: str):
    initial_state = {
        "audio_path": data if vector == "voice" else None,
        "log_data": data if vector == "cyber" else None,
        "image_path": data if vector == "vision" else None,
        "iteration_count": 0,
        "is_compliant": False
    }
    return await app.ainvoke(initial_state)