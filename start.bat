@echo off
echo ========================================================
echo Zap Mudra - Local Server (Port 8080)
echo ========================================================
echo Killing any stuck processes on port 8080 to prevent errors...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo Starting the web server...
echo --------------------------------------------------------
echo Server is running! Open your browser and go to:
echo http://localhost:8080
echo --------------------------------------------------------
echo Keep this window open. Closing it will stop the server.
python -m http.server 8080
pause
