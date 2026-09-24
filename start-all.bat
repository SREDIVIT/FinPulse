@echo off
title FinTrack - Full Stack Launcher
echo ==============================================
echo       FinTrack Application Launcher
echo ==============================================
echo.

echo [1/2] Launching Backend Server on port 5000...
start "FinTrack Backend (Port 5000)" cmd /k "npm run server"

echo [2/2] Launching Frontend on port 5173...
start "FinTrack Frontend (Port 5173)" cmd /k "npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Once ready, your browser will be available at: http://localhost:5173
echo.
timeout /t 5
