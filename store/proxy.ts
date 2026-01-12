import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./quries/auth.query";

const PRIVATE_PATHS = ["/store"];
const PUBLIC_PATHS = ["/auth"];

export async function proxy(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();


  // if (nextUrl.pathname === "/" || PRIVATE_PATHS.some((path) => nextUrl.pathname.startsWith(path))) {
  //   const auth = await checkAuth(request);
  //   if (!auth) {
  //     return NextResponse.rewrite(new URL("/auth", request.url));
  //   }
  // }

  // if (PUBLIC_PATHS.some((path) => nextUrl.pathname.startsWith(path))) {
  //   const auth = await checkAuth(request);
  //   if (auth) {
  //     return NextResponse.rewrite(new URL("/", request.url));
  //   }
  // }


  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",

};
