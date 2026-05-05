# ChainReflex

An intelligent, autonomous agentic system for mitigating supply chain disruptions. Built for the AMD Developer Hackathon.

## Tech Stack
- **Hardware**: AMD Developer Cloud (MI300X Accelerators)
- **Engine**: ROCm with vLLM
- **LLM**: Meta Llama-3 (Served locally)
- **Orchestration**: LangGraph
- **Validation**: Pydantic V2 & LangChain Structured Outputs

## Project Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Boot the AMD ROCm vLLM Server**
   Follow the Docker command provided in `ROCM Requisites.txt` to start the local LLM server.

3. **Run the Autonomous Agent**
   ```bash
   python main.py
   ```
