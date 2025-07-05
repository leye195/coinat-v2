const API_URL = "https://api.upbit.com/v1/market/all?isDetails=true";

export async function GET() {
  try {
    const response = await fetch(API_URL);

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
