import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = ["https://www.coinat.xyz", "https://coinat.xyz"];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const response =
    request.method === "OPTIONS"
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

  if (
    origin &&
    (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:"))
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
