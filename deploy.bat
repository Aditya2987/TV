@echo off
echo.
echo ========================================
echo   Deploying TV Channels to Firebase
echo ========================================
echo.
echo Deploying to Firebase Hosting...
firebase deploy --only hosting
echo.
echo ========================================
echo   Deployment Complete!
echo   Visit: https://tv-channels-f64ae.web.app
echo ========================================
echo.
pause
