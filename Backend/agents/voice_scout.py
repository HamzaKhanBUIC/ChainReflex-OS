import time
from core.schemas import SupplyChainDisruption

def run_voice_scout(audio_path: str) -> SupplyChainDisruption:
    """
    Simulates an Audio AI Agent (like OpenAI Whisper) transcribing a voicemail 
    and extracting supply chain disruption data.
    
    Args:
        audio_path (str): The path to the simulated audio recording.
        
    Returns:
        SupplyChainDisruption: A strictly typed Pydantic object containing the extracted crisis data.
    """
    print(f"Transcribing and analyzing audio stream from: {audio_path}...")
    
    # Simulate the heavy compute required for audio transcription and NLP analysis
    time.sleep(2)
    
    # Return the extracted disruption data packaged directly into our Pydantic schema
    return SupplyChainDisruption(
        location="Alpine Pass",
        severity_level="CRITICAL",
        affected_materials=["Transport Vehicles", "Perishable Goods"],
        description="Frantic voicemail: Driver reports bridge collapse due to earthquake. All forward routes are completely blocked."
    )

# Simple testing block
if __name__ == "__main__":
    print("--- Testing Voice Scout ---")
    
    test_audio = "voicemail_driver_042.wav"
    
    print("\nInitializing Voice Agent...")
    disruption = run_voice_scout(test_audio)
    
    print("\n[!] Emergency Transcript Data Extracted:")
    print(disruption.model_dump_json(indent=2))
