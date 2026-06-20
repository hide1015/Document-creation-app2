// 証憑書類作成アプリ用 Cloudflare Worker（データ同期 KVストレージ）
//
// 【セットアップ】
// 1. https://dash.cloudflare.com に登録 → Workers & Pages → Create Worker → Deploy
// 2. Edit code にこの内容を貼り付け → Deploy
// 3. KVストレージ作成: Storage & Databases → KV → Create namespace（名前: edogawa_data）
// 4. Worker の Settings → Bindings → Add → KV namespace
//    Variable name: EDOGAWA_KV / KV namespace: edogawa_data
// 5. WorkerのURL(https://xxxx.workers.dev)をアプリ設定の「プロキシURL」に入力
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);
    if (url.pathname === "/sync") {
      if (!env.EDOGAWA_KV) return new Response(JSON.stringify({ error: "KV未設定" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
      try {
        if (request.method === "GET") {
          const data = await env.EDOGAWA_KV.get("shared-docs");
          return new Response(data || "[]", { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (request.method === "POST") {
          const body = await request.text();
          await env.EDOGAWA_KV.put("shared-docs", body);
          return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
      }
    }
    return new Response("Not Found", { status: 404, headers: cors });
  },
};
