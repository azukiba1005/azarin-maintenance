@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ========================================================
echo    AZARIN 工事中案内サイト ローカルサーバー (Windows)
echo ========================================================
echo.
echo   [サイトURL] http://localhost:8000/index.html
echo   [管理画面] http://localhost:8000/admin.html
echo.
echo   ※ ブラウザでサイトを自動で開きます。
echo   ※ 終了したいときは [Ctrl + C] を押してください。
echo ========================================================
echo.

start "" "http://localhost:8000/index.html"
python -m http.server 8000
pause
