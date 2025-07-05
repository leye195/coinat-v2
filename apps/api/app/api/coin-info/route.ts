const API_URL = "https://api-manager.upbit.com/api/v1/coin_info/pub/";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      throw new Error("code parameter is required.");
    }

    const response = await fetch(`${API_URL}${code}.json`);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(null, { status: 400 });
  }
}
