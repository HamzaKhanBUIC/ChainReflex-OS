import os
import json
from typing import Optional
from huggingface_hub import InferenceClient
from core.schemas import SupplyChainDisruption
from dotenv import load_dotenv

load_dotenv()

def run_voice_scout(audio_path: str) -> SupplyChainDisruption:
    """
    The Voice Scout analyzes transcribed audio intercepts to detect 
    ground-level disruptions using Hugging Face (Whisper + Llama 3).
    """
    print(f"\n[VOICE SCOUT] Transcribing and analyzing audio: {audio_path}...")
    
    hf_token = os.getenv("HF_TOKEN")
    
    # Predefined transcripts for simulation/fallback
    mock_transcripts = {
        "panic_voicemail.wav": "This is driver 42 at the Alpine Pass! The bridge just gave way, it's a total collapse. I'm seeing trucks piled up and the road is completely gone. We need to reroute everything immediately!",
        "port_chatter.wav": "Security at Port terminal 4 reported a sudden strike by the crane operators. Nothing is moving. They've blocked the main exit gate with containers.",
    }
    
    system_prompt = """Role:
You are the Voice Scout for ChainReflex OS. Your primary directive is to analyze transcribed audio intercepts from drivers, port authorities, and logistics personnel to detect on-the-ground disruptions.

Task:
Examine the provided audio transcript and identify any physical or logistical threats mentioned by the speakers (e.g., riots, road closures, accidents, cargo theft).

Output Format:
You must respond STRICTLY with a valid JSON object. Use the exact schema below:
{
"threat_detected": boolean,
"threat_type": "Short string (e.g., Road Blockade, Vehicle Accident, Strike, None)",
"severity": "CRITICAL, HIGH, MEDIUM, or LOW",
"location_context": "The geographical location or transit route mentioned in the audio",
"analysis": "A concise 1-sentence explanation of the situation described in the transcript."
}"""

    try:
        if not hf_token:
            raise Exception("HF_TOKEN not found.")

        client = InferenceClient(api_key=hf_token)
        transcript = ""

        # Step 1: Transcribe if it's a real file
        if os.path.exists(audio_path):
            print(f"   -> Real audio file detected. Running Whisper-v3 Transcription...")
            with open(audio_path, "rb") as f:
                audio_data = f.read()
            # Note: Serverless Whisper can be slow or hit size limits
            whisper_result = client.automatic_speech_recognition(audio_data, model="openai/whisper-large-v3")
            transcript = whisper_result.text
        else:
            print(f"   -> Audio file not found. Using simulation transcript for: {audio_path}")
            transcript = mock_transcripts.get(audio_path, "Ground report: Unconfirmed reports of road blockades near the coastal facility.")

        # Step 2: Analyze transcript with Llama 3
        print(f"   -> Analyzing transcript with Llama-3-8B-Instruct...")
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Audio Transcript:\n{transcript}"}
            ],
            max_tokens=500,
        )
        content = response.choices[0].message.content
        
        # Clean and parse JSON
        json_str = content.strip().replace("```json", "").replace("```", "")
        data = json.loads(json_str)
        
        severity = data.get("severity", "LOW").upper()
        
        print(f"   [ALERT] {data.get('threat_type')} detected in audio at {data.get('location_context')}!")
        
        return SupplyChainDisruption(
            location=data.get("location_context", "Transit Route"),
            severity_level=severity.capitalize(),
            affected_materials=["Transport Logistics", "Freight Operations"],
            description=f"[{data.get('threat_type')}] {data.get('analysis')}"
        )

    except Exception as e:
        print(f"   [!] Voice Scout failed: {e}")
        print("   -> Falling back to simulation data...")
        
        return SupplyChainDisruption(
            location="Alpine Pass",
            severity_level="Critical",
            affected_materials=["Transport Vehicles", "Perishable Goods"],
            description="Frantic voicemail: Driver reports bridge collapse due to earthquake. All forward routes are completely blocked."
        )

if __name__ == "__main__":
    print("--- Testing Voice Scout ---")
    disruption = run_voice_scout("panic_voicemail.wav")
    print(disruption.model_dump_json(indent=2))
