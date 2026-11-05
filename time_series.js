export async function onRequestGet({ request, env }) {
  const apiKey = env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    return Response.json({ status: "error", message: "Servern saknar API-nyckeln TWELVE_DATA_API_KEY. Lägg till den som Secret i Cloudflare." }, { status: 500 });
  }

  const incoming = new URL(request.url);
  const symbol = (incoming.searchParams.get("symbol") || "").trim();
  const interval = incoming.searchParams.get("interval") || "1day";
  const requestedOutput = Number.parseInt(incoming.searchParams.get("outputsize") || "200", 10);
  const allowedIntervals = new Set(["1day", "1week", "1month"]);

  if (!symbol || symbol.length > 40) {
    return Response.json({ status: "error", message: "Ange en giltig aktiesymbol." }, { status: 400 });
  }
  if (!allowedIntervals.has(interval)) {
    return Response.json({ status: "error", message: "Ogiltigt intervall." }, { status: 400 });
  }
  const outputsize = Number.isFinite(requestedOutput)
    ? Math.min(Math.max(requestedOutput, 1), 1250)
    : 200;

  const upstream = new URL("https://api.twelvedata.com/time_series");
  upstream.searchParams.set("symbol", symbol);
  upstream.searchParams.set("interval", interval);
  upstream.searchParams.set("outputsize", String(outputsize));
  upstream.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(upstream.toString(), { headers: { "Accept": "application/json" } });
    const body = await response.text();
    return new Response(body, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return Response.json({ status: "error", message: "Kunde inte nå Twelve Data från servern. Försök igen senare." }, { status: 502 });
  }
}
