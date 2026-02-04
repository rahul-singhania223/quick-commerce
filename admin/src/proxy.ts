import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./lib/utils";

const PRIVATE_PATHS = ["dashboard"];
const PUBLIC_PATHS = ["auth"];

export async function proxy(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  const home = nextUrl.pathname === "/";
  const basePath = nextUrl.pathname.split("/")[1];

  // if (home) {
  //   const authenticated = await checkAuth(request);

  //   if (!authenticated)
  //     return NextResponse.redirect(new URL("/auth", request.url));
  // }

  // if (basePath === "auth") {
  //   const authenticated = await checkAuth(request);

  //   if (authenticated)
  //     return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
};
