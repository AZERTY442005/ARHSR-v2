@echo on
if not exist "./Code/node_modules" (
  echo Installation des Modules necessaire au fonctionnement du Programme
  start /wait /D "./Code" Install.bat
)
node ./Code/index.js

pause