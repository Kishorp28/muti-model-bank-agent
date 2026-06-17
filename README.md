# 🏦 S-FIA — SBI Financial Inclusion Agent

**Banking that listens, understands, and acts — in the language of every Indian.**

S-FIA is a multi-model financial inclusion system featuring a voice-driven AI agent console (Professor S-FIA), a stateful banking decision engine, automated security & geolocation monitoring, financial health auditing, and simulated WhatsApp integrations — built to bridge the literacy and language gap in everyday banking.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://muti-model-bank-agent.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?logo=render&logoColor=white)](https://muti-model-bank-agent.onrender.com)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-YouTube-FF0000?logo=youtube&logoColor=white)](https://youtu.be/fftYry5-rC8)
[![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Made with FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini Powered](https://img.shields.io/badge/AI-Gemini%20Pro-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 **Live App (Frontend)** | [muti-model-bank-agent.vercel.app](https://muti-model-bank-agent.vercel.app/) |
| ⚙️ **Backend API (FastAPI)** | [muti-model-bank-agent.onrender.com](https://muti-model-bank-agent.onrender.com) |
| 🎥 **Demo Video Walkthrough** | [youtu.be/fftYry5-rC8](https://youtu.be/fftYry5-rC8) |

> ⚠️ **Note:** The backend is hosted on Render's free tier, which spins down when idle. The very first request after inactivity may take **30–60 seconds** to respond while the service wakes up — this is expected, not a bug.

---

## ✨ Key Features

- 🎙️ **Voice-first, multilingual console** — speak naturally in **English, Hindi, or Tamil**; the agent listens for silence and auto-submits, then replies back by voice.
- 🧠 **Stateful 8-node agent engine** — Transaction Signal → Life Event → Entitlement → Financial Health → Product Discovery → Trust Veto → Compliance → Conversation.
- 🛡️ **Built-in guardrails** — blocks risky loans when DTI exceeds 50%, pauses FD Auto-Sweeps below a liquidity floor, and halts any action without active DPDP consent.
- 🏛️ **Government scheme matching** — automatically checks eligibility for PMSBY, Mudra Loan (Shishu), and PMJDY-linked benefits.
- 📊 **Financial health & analytics dashboards** — radar charts, AUM tracking, and digital-adoption metrics, all theme-aware (light/dark via CSS variables).
- 🔐 **Security & geolocation audit logging** — every login attempt is IP-tracked, geolocated via ipapi.co, and permanently logged for compliance review.
- 💬 **WhatsApp simulation layer** — dispatches Meta Cloud API template alerts and lets you inspect raw request/response logs in real time.
- 🗄️ **Multi-database resilience** — SQLite as the primary store, mirrored to Firestore and Supabase to simulate enterprise-grade disaster recovery.

---

## 🧩 How the Agent Thinks

Each request flows through a shared `AgentState` object as it passes across eight specialized nodes:

```
Transaction Signal → Life Event → Entitlement → Financial Health
        ↓
Product Discovery → Trust Veto → Compliance → Conversation
```

The **Trust Veto** node is the safety backbone — it can halt any unsafe action *before* execution (e.g., blocking a loan if DTI > 50%, or pausing an FD sweep if liquid balance < ₹10,000), and every decision — proceed or block — is written to an audit log.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python**: 3.11+
- **Node.js**: 20+ (with npm)
- **Docker** *(Optional - for containerized execution)*

### Option A: Automatic Startup Scripts
Run the pre-configured scripts in the root directory to boot both frontend and backend concurrently:
- **Windows (CMD)**: Double-click or run `run_local.bat`
- **Windows (PowerShell)**: Run `.\run_local.ps1`

### Option B: Manual Setup

#### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server (starts on http://localhost:8000)
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup (Next.js)
```bash
# Navigate to frontend directory
cd sbi-frontend

# Install dependencies
npm install

# Run dev server (starts on http://localhost:3000)
npm run dev
```

---

## 🛠️ Environment Configuration

Environment files (`.env`) are located in both the project root and the frontend folder.

### Root `.env` (Backend & General Configuration)
Create a `.env` in the root folder (automatically loaded by FastAPI):
```env
# Gemini API Key (Required for S-FIA NLP)
GEMINI_API_KEY=your_gemini_api_key

# CORS Allowed Origins
ALLOWED_ORIGINS=*

# Meta Cloud WhatsApp API credentials (Optional)
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
```

### Frontend `.env` (`sbi-frontend/.env`)
Create a `.env` in the `sbi-frontend` folder:
```env
# Dynamic endpoint of your hosted FastAPI backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For the **live deployment**, the frontend's `NEXT_PUBLIC_API_URL` points to:
```env
NEXT_PUBLIC_API_URL=https://muti-model-bank-agent.onrender.com/api
```

---

## 🐳 Docker Compose Setup

To build and run both modules in isolated container environments:
```bash
# Start all services
docker-compose up --build
```
- **Backend API**: `http://localhost:8000`
- **Frontend App**: `http://localhost:3000`

---

## ☁️ Hosting & Production Deployment Guide

### 1. Frontend (Next.js)
The frontend is built with Next.js App Router and is deployed on **Vercel**:
🌐 **[muti-model-bank-agent.vercel.app](https://muti-model-bank-agent.vercel.app/)**
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: `NEXT_PUBLIC_API_URL` is set to the Render-hosted backend URL above.

### 2. Backend (FastAPI)
The backend is a lightweight FastAPI web service deployed on **Render**:
⚙️ **[muti-model-bank-agent.onrender.com](https://muti-model-bank-agent.onrender.com)**
- **Runtime**: Python 3.11+
- **Build/Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Gemini API credentials.
  - `ALLOWED_ORIGINS`: Set this to your frontend URL (e.g. `https://muti-model-bank-agent.vercel.app`) to restrict CORS access.
  - `DATASETS_DIR` *(Optional)*: Override path to the datasets directory.

> Both services also support **Netlify / AWS Amplify** (frontend) and **Railway / Koyeb / AWS ECS / GCP Cloud Run** (backend) as drop-in alternatives.

---

## 📁 Repository Structure
```
├── backend/               # FastAPI application, agent engine, database logic
│   └── datasets/          # CSV database records for system modeling & simulation
├── sbi-frontend/          # Next.js web interface and interactive dashboard
├── docker-compose.yml     # Multi-container service definitions
├── run_local.bat          # One-click startup script for CMD
└── run_local.ps1          # One-click startup script for PowerShell
```

---

## 🎥 Demo

Watch the full walkthrough — login & security, the voice console in three languages, financial health audit, analytics dashboard, and the WhatsApp simulator:

▶️ **[https://youtu.be/fftYry5-rC8](https://youtu.be/fftYry5-rC8)**

---

## 🧾 License

This project was built as a hackathon submission for the **SBI Hackathon 2026**. Add your preferred license (MIT, Apache-2.0, etc.) here if you intend to open-source it.

---

## 🙌 Team

Built with ❤️ by **Team S-FIA** for the SBI Hackathon 2026 — National Finalist Submission.
