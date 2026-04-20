import { NextRequest, NextResponse } from "next/server";
import {jwtDecode} from "jwt-decode";

type TokenPayload = {
  user_id: number;
  role: "user" | "expert" | "admin";
  type: string;
};

const PUBLIC_ROUTES = ["/login", "/signup", "/admin"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value;

  const isFarmerRoute = pathname.startsWith("/farmer");
  const isExpertRoute = pathname.startsWith("/expert");
  const isAdminRoute = pathname.startsWith("/admin");

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!token) {
    if (isPublic) {
      return NextResponse.next();
    }

    if (isFarmerRoute || isExpertRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const role = decoded.role;

    if (role === "user") {
      if (!isFarmerRoute) {
        return NextResponse.redirect(new URL("/farmer/dashboard", req.url));
      }
    }

    if (role === "expert") {
      if (!isExpertRoute) {
        return NextResponse.redirect(new URL("/expert/dashboard", req.url));
      }
    }

    if (role === "admin") {
      if (!isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }

    if (isPublic) {
      if (role === "user") {
        return NextResponse.redirect(new URL("/farmer/dashboard", req.url));
      }
      if (role === "expert") {
        return NextResponse.redirect(new URL("/expert/dashboard", req.url));
      }
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/farmer/:path*",
    "/expert/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
