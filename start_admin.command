#!/bin/bash
# ----------------------------------------------------------------------
# azarin.me 管理画面（admin.html）直接起動スクリプト (macOS用)
# ダブルクリックするだけでサーバーが立ち上がり、直接管理画面が開きます。
# ----------------------------------------------------------------------

cd "$(dirname "$0")"

PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    PORT=$((PORT + 1))
done

URL="http://localhost:${PORT}"

echo ""
echo "========================================================"
echo "   ⚙️  AZARIN 工事中案内サイト [管理者コンソール]"
echo "========================================================"
echo ""
echo "  [管理画面URL] ${URL}/admin.html"
echo "  [パスコード]  azarin2026"
echo ""
echo "  ※ ブラウザで管理画面を開きます。"
echo "  ※ 終了したいときは、このウィンドウで [Control + C] を押してください。"
echo "========================================================"
echo ""

(sleep 1 && open "${URL}/admin.html") &

python3 -m http.server $PORT
