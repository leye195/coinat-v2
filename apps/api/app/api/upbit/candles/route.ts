import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

const API_URL = "https://api.upbit.com/v1/candles/";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get("market");
    const type = searchParams.get("type") || "months";
    const count = searchParams.get("count") || "200";
    const minute = searchParams.get("minute") || "3";
    const to = searchParams.get("to");

    const endpoint = type === "minutes" ? `minutes/${minute}` : type;

    const url = new URL(`${API_URL}${endpoint}`);

    if (market) url.searchParams.set("market", market);

    if (to) url.searchParams.set("to", to);

    if (count) url.searchParams.set("count", count);

    const data = await fetchJson(url.toString());

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    const status = err instanceof FetchJsonError ? err.status : 400;
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
