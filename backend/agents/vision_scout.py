import base64
import os
from typing import Optional
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from core.schemas import SupplyChainDisruption
from dotenv import load_dotenv

load_dotenv()

def encode_image(image_path: str) -> str:
    """Base64 encode an image file for the vision model."""
    if not os.path.exists(image_path):
        return ""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def run_vision_scout(image_path: str) -> Optional[SupplyChainDisruption]:
    base64_image = encode_image(image_path)
    
    vllm_api_base = os.getenv("VLLM_API_BASE", "http://localhost:8000/v1")
    api_key = os.getenv("MOCK_API_KEY", "dummy-rocm-key")
    model_name = os.getenv("VISION_MODEL_NAME", "meta-llama/Llama-3.2-11B-Vision-Instruct")

    llm = ChatOpenAI(model=model_name, openai_api_key=api_key, openai_api_base=vllm_api_base, temperature=0.1, max_tokens=1024, request_timeout=3)
    structured_llm = llm.with_structured_output(SupplyChainDisruption)
    
    message = HumanMessage(
        content=[
            {"type": "text", "text": "Analyze this image and identify the supply chain disruption."},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
        ]
    )
    
    try:
        print(f"Connecting to AMD ROCm Server at {vllm_api_base}...")
        result = structured_llm.invoke([message])
        return result
    except Exception as e:
        print("\n[!] Connection to LLM failed. Using Hackathon Simulation Data...")
        return SupplyChainDisruption(
            location="Los Angeles Port",
            severity_level="Critical",
            affected_materials=["Semiconductors", "Rare Earth Metals"],
            description="Satellite feed shows massive logistical blockage halting all freight operations."
        )
