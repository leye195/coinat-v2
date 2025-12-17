import { FetchJsonError, fetchJson } from "../../lib/fetchJson";
import { getSupabaseClient } from "../../lib/supabase";

const API_URL = "https://api.upbit.com/v1/market/all?isDetails=true";
const SUPABASE_TABLE = "upbit_market";

type UpbitMarket = {
  market: string;
  korean_name?: string | null;
  english_name?: string | null;
  market_warning?: string | null;
  [key: string]: unknown;
};

export async function GET() {
  // Try Supabase first (e.g., if you store a cached copy of the market list).
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from(SUPABASE_TABLE)
      .select("*")
      .order("market", { ascending: true });
    return new Response(JSON.stringify(data));
  } catch (err) {
    console.error("Supabase client error:", err);

    // Supabase empty/unavailable: fetch fresh from Upbit (no write; cron should persist).
    try {
      const data = await fetchJson<UpbitMarket[]>(API_URL);

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
}
