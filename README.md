<div align="center">

# 🛡️ ChainReflex-OS
**The Autonomous, Event-Driven AI Security Orchestrator**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.0%2B-black.svg)](https://nextjs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Security Audit](https://img.shields.io/badge/security-A%2B-success.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ChainReflex-OS is an enterprise-grade, low-latency framework designed for senior engineering leads. It bridges LLM capabilities with rigorous zero-trust security guardrails, orchestrating autonomous responses to system events in real-time.

</div>

---

## 🏗️ System Architecture

ChainReflex-OS maps incoming triggers through a hardened pipeline: event ingestion, zero-trust validation, AI reflex routing, and final output generation.

```text
       [ EVENT TRIGGER ]
              │
              ▼
   ┌───────────────────────┐
   │    API Gateway (src/) │
   └──────────┬────────────┘
              │
              ▼
   ╔═══════════════════════╗
   ║  Security Guardrail   ║ (Zero-Trust / Auditor)
   ╚══════════╦════════════╝
              │ (Valid)
              ▼
   ┌───────────────────────┐
   │    Reflex Router      │ (LangGraph / Chains)
   └──────────┬────────────┘
              │
        ┌─────┴─────┐
        ▼           ▼
   [Reflex 1]   [Reflex 2]   (Agents: Cyber Scout, Remediator, etc.)
        │           │
        └─────┬─────┘
              ▼
        [ OUTPUT ]
```

---

## 🔐 Security Posture

ChainReflex-OS is built with a **Zero-Trust first** mindset.
- **Air-gapped Secrets:** No hardcoded tokens. All configurations are injected securely at runtime via environment variables.
- **Role-Based Reflexes:** Triggers are strictly bound to identity assertions (`src/security/permissions.py`).
- **Audit Logging:** Every AI decision is traced and mapped within the memory core for full enterprise accountability.

---

## 🚀 Quick Start (Local Docker)

Deploying ChainReflex-OS is streamlined for modern environments. The orchestrator encompasses the core Python engine and two frontends located in the `clients/` directory.

### 1. Clone & Structure
```bash
git clone https://github.com/your-org/ChainReflex-OS.git
cd ChainReflex-OS
```
*Note: The Next.js web app is located at `clients/web-app/` and the Streamlit admin dashboard at `clients/admin-dashboard/`.*

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your specific HF_TOKEN, GITHUB_TOKEN, and target LLM endpoints
```

### 3. Boot & Orchestrate
Using Docker Compose, spin up the unified stack (Gateway, Web App, Admin Dashboard):
```bash
docker-compose -f deploy/docker-compose.yml up --build -d
```
The OS Engine will be available on `localhost:8000`, the Web App on `3000`, and the Admin Dashboard on `8501`.

---

## ☁️ Live Production Cloud Deployment (100% Free, No Credit Card)

We have configured Infrastructure-as-Code for an entirely free, multi-platform cloud stack without needing a credit card.

### 1. The Core Engine (Render)
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository. The `render.yaml` file will automatically configure the Python FastAPI backend.
4. Set your `HF_TOKEN` in the Environment Variables tab.
5. Deploy. You will receive a URL like `https://chainreflex-core.onrender.com`.

### 2. The Web App Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** -> **Project** and select this repository.
3. **CRITICAL STEP**: Click `Edit` on the **Root Directory** setting and select `clients/web-app`. (This tells Vercel where the Next.js app lives).
4. In the Environment Variables section, add:
   - `NEXT_PUBLIC_API_URL` = `[YOUR_RENDER_URL]`
5. Deploy.

### 3. The Admin Dashboard (Streamlit Community Cloud)
1. Go to [Streamlit Share](https://share.streamlit.io/) and log in with GitHub.
2. Click **New App**.
3. Set the repository, and set the **Main file path** to `clients/admin-dashboard/soc_dashboard.py`.
4. Deploy. Once live, enter your Render URL into the sidebar configuration.

---

<div align="center">
<i>Engineered for resilience. Designed for scale.</i>
</div>
