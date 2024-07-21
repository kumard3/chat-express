import { withAuth } from "next-auth/middleware";
import { type NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // console.log(req.nextauth, "req.nextauth");
    if (!req.nextauth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // dashboard middleware
    if (req.nextUrl.pathname === "/") {
      if (!req.nextauth?.token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/"],
};
