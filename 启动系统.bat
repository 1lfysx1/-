@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "FRONTEND_URL=http://127.0.0.1:5173/#/login"
set "BACKEND_URL=http://127.0.0.1:8000/"
set "DEEPSEEK_PROXY=http://127.0.0.1:7897"

if not exist "%BACKEND_DIR%\app\main.py" (
  echo Backend directory not found: %BACKEND_DIR%
  pause
  exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
  echo Frontend directory not found: %FRONTEND_DIR%
  pause
  exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found in PATH.
  echo Please install Python or add it to PATH, then run this file again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm.cmd was not found in PATH.
  echo Please install Node.js or add it to PATH, then run this file again.
  pause
  exit /b 1
)

call :CheckPort 8000 BACKEND_PID
if defined BACKEND_PID (
  echo Backend already running, PID=%BACKEND_PID%
) else (
  echo Starting backend...
  start "Backend FastAPI" cmd /k "cd /d ""%BACKEND_DIR%"" && set HTTP_PROXY=%DEEPSEEK_PROXY%&& set HTTPS_PROXY=%DEEPSEEK_PROXY%&& set ALL_PROXY=%DEEPSEEK_PROXY%&& python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 || pause"
)

call :CheckPort 5173 FRONTEND_PID
if defined FRONTEND_PID (
  echo Frontend already running, PID=%FRONTEND_PID%
) else (
  echo Starting frontend...
  start "Frontend Vite" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm.cmd run dev -- --host 127.0.0.1 || pause"
)

echo Waiting for backend...
call :WaitUrl "%BACKEND_URL%" 45
if errorlevel 1 (
  echo Backend did not become ready. Please check the Backend FastAPI window.
  pause
  exit /b 1
)

echo Waiting for frontend...
call :WaitUrl "http://127.0.0.1:5173/" 45
if errorlevel 1 (
  echo Frontend did not become ready. Please check the Frontend Vite window.
  pause
  exit /b 1
)

start "" "%FRONTEND_URL%"

echo.
echo Frontend: %FRONTEND_URL%
echo Backend:  %BACKEND_URL%
echo.
pause
exit /b 0

:CheckPort
set "%~2="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%~1 .*LISTENING"') do (
  set "%~2=%%P"
  goto :eof
)
goto :eof

:WaitUrl
powershell -NoProfile -ExecutionPolicy Bypass -Command "$url = '%~1'; $seconds = [int]'%~2'; $ready = $false; for ($i = 0; $i -lt $seconds; $i++) { try { $res = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2; if ($res.StatusCode -ge 200) { $ready = $true; break } } catch { Start-Sleep -Seconds 1 } }; if (-not $ready) { exit 1 }"
goto :eof
