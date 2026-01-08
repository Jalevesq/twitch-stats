import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const invalidated = request.cookies.get("session_invalid")?.value;

  if (invalidated) {
    const response = NextResponse.next();
    response.cookies.delete("session_id");
    response.cookies.delete("session_invalid");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
