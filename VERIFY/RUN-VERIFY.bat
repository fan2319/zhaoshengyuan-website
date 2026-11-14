@echo off
chcp 65001 >nul
title Zhaoshengyuan Site - File Integrity Check
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0verify.ps1"
echo.
pause
