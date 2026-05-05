from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import time
import json # Make sure this is at the very top of your file

# Import your existing LangGraph setup from main.py
# Assuming your compiled graph is named 'app' in main.py
from main import app as langgraph_app

# 1. Initialize the API
api = FastAPI(title="ChainReflex OS API", version="1.0")

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allows your React app to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the expected incoming data from the frontend
class ThreatTrigger(BaseModel):
    threat_vector: str  # e.g., "cyber", "vision", "voice"
    payload_data: str   # The mock log file, image path, or audio path

# 3. Create the Endpoint
@api.post("/api/trigger-response")
async def trigger_autonomous_response(trigger: ThreatTrigger):
    print("\n" + "="*50)
    print(f"📥 INCOMING SIGNAL FROM REACT: {trigger.threat_vector.upper()} SCOUT")
    # This prints the exact data React sent you
    print(json.dumps(trigger.dict(), indent=2)) 
    print("="*50 + "\n")
    
    initial_state = {
        "audio_path": None,
        "log_data": None,
        "iteration_count": 0,
        "is_compliant": False
    }
    
    if trigger.threat_vector == "cyber":
        initial_state["log_data"] = trigger.payload_data
    elif trigger.threat_vector == "voice":
        initial_state["audio_path"] = trigger.payload_data

    try:
        final_state = langgraph_app.invoke(initial_state)
        
        response_data = {
            "status": "success",
            "disruption_found": final_state.get("disruption_data"),
            "final_legal_action": final_state.get("drafted_legal_notice"),
            "firewall_approved": final_state.get("is_compliant"),
            "iterations_required": final_state.get("iteration_count")
        }

        print("\n" + "="*50)
        print("📤 OUTGOING AI RESPONSE TO REACT:")
        # This prints the massive data object LangGraph generated
        print(json.dumps(response_data, indent=2, default=str))
        print("="*50 + "\n")
        
        return response_data
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🌐 Starting ChainReflex FastAPI Server on Port 8000...")
    uvicorn.run(api, host="0.0.0.0", port=8000)
