import { FetchJsonError, fetchJson } from "../../lib/fetchJson";

const API_URL = "https://crix-api-cdn.upbit.com/v1/crix/marketcap?currency=KRW";

export async function GET(request: Request) {
    try {
        const data = await fetchJson(API_URL);
        return Response.json(data);
    } catch (err) {
        console.error(err);
        const status = err instanceof FetchJsonError ? err.status : 500;
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
