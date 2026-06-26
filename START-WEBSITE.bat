@echo off
cd /d "%~dp0"
title Noufal Constructions - local server (keep open)
echo ===============================================
echo   Noufal Constructions - starting local server
echo.
echo   KEEP THIS WINDOW OPEN while viewing the site.
echo   Close this window (or press Ctrl+C) to stop.
echo ===============================================
echo.
echo   Opening http://localhost:8080 in your browser...
start "" http://localhost:8080
echo.
py -m http.server 8080 || python -m http.server 8080
pause
