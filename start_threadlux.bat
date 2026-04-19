@echo off
echo ============================================
echo   Threadlux - Starting Development Servers
echo ============================================

echo.
echo [1/2] Starting Backend (FastAPI)...
start "Threadlux - Backend :8000" /D "C:\Users\HISHAM SHAMSUDHEEN\newecommerce-project\backend" cmd /k "venv\Scripts\uvicorn.exe main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (Vite)...
start "Threadlux - Frontend :5173" /D "C:\Users\HISHAM SHAMSUDHEEN\newecommerce-project\frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo   Servers launching in separate windows!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo ============================================
echo.
echo You can close this window.
timeout /t 3
