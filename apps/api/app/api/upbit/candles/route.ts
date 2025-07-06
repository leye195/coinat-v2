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

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(null, { status: 400 });
  }
}
