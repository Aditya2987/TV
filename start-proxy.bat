@echo off
echo.
echo ========================================
echo   Starting Channel Proxy Server
echo ========================================
echo.
echo This allows HTTP channels to work on your HTTPS website
echo.
echo Getting your network IP address...
node get-proxy-url.js > temp-ip.txt
set /p PROXY_URL=<temp-ip.txt
del temp-ip.txt
echo.
echo ========================================
echo   YOUR PROXY URL: %PROXY_URL%
echo ========================================
echo.
echo On your TV browser, enter this when prompted:
echo %PROXY_URL%
echo.
echo Keep this window open while watching channels
echo.
echo Starting proxy server...
echo.
node proxy-server.js
pause
