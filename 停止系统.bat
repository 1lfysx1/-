@echo off
setlocal EnableExtensions

echo Stopping services on ports 8000 and 5173...
call :KillPort 8000
call :KillPort 5173
echo Stop commands sent.
echo.
pause
exit /b 0

:KillPort
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%~1 .*LISTENING"') do (
  taskkill /PID %%P /F >nul 2>nul
)
goto :eof
