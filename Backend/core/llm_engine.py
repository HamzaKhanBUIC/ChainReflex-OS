import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def get_llm(temperature: float = 0.1, timeout: float = 3.0):
    """
    Initializes and returns the LLM engine connected to the local AMD ROCm vLLM server.
    
    Default timeout is set to 3.0 seconds to allow for rapid hackathon simulation
    failover if the local ROCm server is not running.
    """
    vllm_api_base = os.getenv("VLLM_API_BASE", "http://localhost:8000/v1")
    api_key = os.getenv("MOCK_API_KEY", "rocm-vllm-key")
    model_name = os.getenv("LLM_MODEL_NAME", "meta-llama/Meta-Llama-3-8B-Instruct")
    
    # Initialize the LangChain wrapper with the specific timeout
    llm = ChatOpenAI(
        model=model_name,
        openai_api_key=api_key,
        openai_api_base=vllm_api_base,
        temperature=temperature,
        max_tokens=2048,
        timeout=timeout, # Use the timeout parameter here
    )
    
    return llm