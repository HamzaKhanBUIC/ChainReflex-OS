@echo off
set PYTHONIOENCODING=utf-8
echo ====================================================
echo   Starting ChainReflex OS Backend Server
echo ====================================================
echo.

cd backend
call .venv\Scripts\activate.bat
python api.py
pause
