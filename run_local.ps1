Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting SBI Financial Inclusion Agent (S-FIA)   " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "[1/2] Launching FastAPI Backend on Port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Launching Next.js Frontend on Port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd sbi-frontend; npm run dev"

Write-Host "S-FIA is booting up." -ForegroundColor Green
Write-Host "- API Backend: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "- Web Dashboard: http://localhost:3000" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
