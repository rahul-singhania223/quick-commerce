import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./quries/auth.query";

const PRIVATE_PATHS = ["store"];
const PUBLIC_PATHS = ["auth"];

export async function proxy(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  const home = nextUrl.pathname === "/";
  const basePath = nextUrl.pathname.split("/")[1];

  if (home) {
    const auth = await checkAuth(request);
    if (!auth) {
      return NextResponse.rewrite(new URL("/auth", request.url));
    }

    return NextResponse.rewrite(new URL("/store", request.url));
  }

  if (PRIVATE_PATHS.includes(basePath)) {
    const auth = await checkAuth(request);
    if (!auth) {
      return NextResponse.rewrite(new URL("/auth", request.url));
    }

    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(basePath)) {
    const auth = await checkAuth(request);
    if (auth) {
      return NextResponse.rewrite(new URL("/store", request.url));
    }

    return NextResponse.next();
  }

  // handle unknown paths

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
};
