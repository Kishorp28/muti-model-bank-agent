@echo off
echo ===================================================
echo   Starting SBI Financial Inclusion Agent (S-FIA)   
echo ===================================================

echo [1/2] Launching FastAPI Backend on Port 8000...
start "S-FIA Backend" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Next.js Frontend on Port 3000...
start "S-FIA Frontend" cmd /k "cd sbi-frontend && npm run dev"

echo S-FIA is booting up.
echo - API Backend: http://127.0.0.1:8000
echo - Web Dashboard: http://localhost:3000
echo ===================================================
pause
