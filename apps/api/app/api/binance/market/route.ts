import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

const API_URL = "https://api.binance.com/api/v3/exchangeInfo";

export const config = {
  api: {
    responseLimit: false,
  },
};

export async function GET() {
  try {
    const data = await fetchJson(API_URL);

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
