@echo off
title FinTrack - MongoDB Local Server
echo Starting MongoDB Community Server on port 27017...
echo Data directory: %USERPROFILE%\mongodb-data
echo.
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="%USERPROFILE%\mongodb-data" --bind_ip 127.0.0.1
pause
