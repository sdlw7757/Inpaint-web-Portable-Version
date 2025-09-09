@echo off
chcp 65001 >nul
title Inpaint Web Application
color 0A

echo ==================================
echo      Starting Inpaint Web Application...
echo ==================================
echo.

rem Check if built-in Node.js is available
if exist "node\node.exe" (
    echo Found built-in Node.js
    echo Starting server with built-in Node.js...
    echo.
    echo Server will start shortly and browser will open automatically
    echo Press Ctrl+C to close the application
    echo.
    "node\node.exe" simple_server.js
    goto :eof
)

rem Check if system Node.js is installed
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found system Node.js
    node --version
    echo Starting server with Node.js...
    echo.
    echo Server will start shortly and browser will open automatically
    echo Press Ctrl+C to close the application
    echo.
    node simple_server.js
    goto :eof
)

echo Error: No Node.js runtime environment found
echo.
echo Solutions:
echo 1. Make sure the release directory contains the node folder
echo 2. Or: Download and install Node.js from https://nodejs.org
echo.
echo Run this program again after installation
echo.
pause