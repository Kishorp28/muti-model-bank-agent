# SBI Financial Inclusion Agent (S-FIA)

S-FIA is a multi-model financial inclusion system featuring an AI-driven agent console (Professor S-FIA), dynamic banking workflows, automated security monitoring, financial health auditing, and simulated WhatsApp integrations.

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

---

## 🐳 Docker Compose setup

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
The frontend is built with Next.js App Router and can be easily hosted on **Vercel** (recommended), **Netlify**, or **AWS Amplify**.
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: Make sure to set `NEXT_PUBLIC_API_URL` to point to your hosted FastAPI backend URL (e.g. `https://your-backend.onrender.com/api`).

### 2. Backend (FastAPI)
The backend is a lightweight FastAPI web service and can be hosted on **Render** (recommended), **Railway**, **Koyeb**, or **AWS ECS/GCP Cloud Run**.
- **Runtime**: Python 3.11+
- **Build/Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Gemini API credentials.
  - `ALLOWED_ORIGINS`: Set this to your frontend URL (e.g. `https://your-frontend.vercel.app`) to restrict CORS access.
  - `DATASETS_DIR` *(Optional)*: Override path to the datasets directory.

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
