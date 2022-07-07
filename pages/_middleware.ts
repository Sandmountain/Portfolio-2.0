// pages/_middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.search.includes("?name=")) {
    const projectName = url.searchParams.get("name");
    return NextResponse.redirect(`${url.origin}/projects/${projectName}`);
  }
}
