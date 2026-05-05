🛠️ Current Project Status: Local Prototype & Simulation Mode
Due to the time constraints of the hackathon, this repository currently contains the Local Simulation Version of ChainReflex OS.

What is functioning: The full-stack architecture (Next.js UI -> FastAPI -> LangGraph Orchestrator), the multi-agent feedback loops, the compliance firewall logic, and the UI state management.

Simulated Components: The heavy LLM/Vision/Audio inferences are currently mocked to allow for rapid local testing on standard hardware.

AMD Deployment Roadmap: The architecture is specifically designed to be lifted and shifted to an AMD Developer Cloud MI300X Instance. The mock nodes in main.py are built to be replaced 1:1 with vLLM endpoints running Llama-3 and Whisper natively on ROCm, utilizing the 192GB VRAM to run the Vision, Voice, and Cyber agents in parallel without bottlenecks.
