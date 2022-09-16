@echo off
if not exist "./Code/node_modules" (
  start /wait /D "./Code" Install.bat
)
node ./Code/index.js