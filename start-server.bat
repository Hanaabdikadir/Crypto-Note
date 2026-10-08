@echo off
chcp 65001 >nul
title Crypto Note - Local Server
cd /d "%~dp0"

echo.
echo ========================================
echo   CRYPTO NOTE - Local Server
echo ========================================
echo.
echo  Folder: %cd%
echo  URL:    http://127.0.0.1:8080
echo.
echo  Ha xirin window-gan inta aad isticmaalayso.
echo  Jooji: Ctrl + C
echo ========================================
echo.

where python >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8080/index.html"
  python -m http.server 8080 --bind 127.0.0.1
  goto end
)

where py >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8080/index.html"
  py -m http.server 8080 --bind 127.0.0.1
  goto end
)

where node >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:8080/index.html"
  node -e "const http=require('http'),fs=require('fs'),path=require('path');const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webmanifest':'application/manifest+json','.json':'application/json'};http.createServer((req,res)=>{let f=path.join(process.cwd(),decodeURIComponent(req.url.split('?')[0]));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');}else{res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(data);}});}).listen(8080,'127.0.0.1',()=>console.log('Server running at http://127.0.0.1:8080/'));"
  goto end
)

echo [INFO] Python ama Node lama helin, waxaan browser-ka ku furaynaa toos faylka...
start "" "index.html"
goto end

:end
echo.
echo Server wuu istaagay.
pause
