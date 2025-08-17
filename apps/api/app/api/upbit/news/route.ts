import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

const API_URL = "https://api-manager.upbit.com/api/v1/coin_news";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const url = new URL(API_URL);

    if (category) {
      url.searchParams.set("category", category);
    }

    const data = await fetchJson(url.toString());

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    const status = err instanceof FetchJsonError ? err.status : 400;
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
