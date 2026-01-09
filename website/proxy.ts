import {auth} from "@/app/_server/auth";
import {NextRequest, NextResponse} from "next/server";

export async function proxy(request: NextRequest) {
    const session = await auth();

    if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/?error=not_logged", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};