======================================================
証憑書類作成アプリ — Android APK化 / 公開用 PWA一式
======================================================
【ファイル】
- index.html / manifest.json / sw.js / icon-*.png / apple-touch-icon.png
- cloudflare-worker.js（データ同期用・GitHubには不要）

【GitHub Pages公開】
1. GitHubでPublicリポジトリ作成
2. index.html等をアップロード → Commit
3. Settings → Pages → Branch: main → Save
4. 公開URL（https://ユーザー名.github.io/リポジトリ名/）取得

【APK化】PWABuilder(https://www.pwabuilder.com)に公開URLを入力 → Android → Generate

【データ同期(複数端末共有)】
cloudflare-worker.js をCloudflare Workerにデプロイし、KVストレージ(EDOGAWA_KV)を
バインド。WorkerのURLをアプリ設定「プロキシURL」に入力。詳細はworker冒頭コメント参照。
======================================================
