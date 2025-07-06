const API_URL =
  "https://crix-api-cdn.upbit.com/v1/crix/trends/daily_volume_power";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = searchParams.get("count") || "220";
    const code = searchParams.get("code") || "KRW";
    const orderBy = searchParams.get("orderBy");

    const url = new URL(`${API_URL}`);

    if (count) url.searchParams.set("count", count);

    if (code) url.searchParams.set("code", code);

    if (orderBy) url.searchParams.set("orderBy", orderBy);

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
