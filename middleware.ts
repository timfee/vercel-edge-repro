import { getAll, digest } from "@vercel/edge-config";
import { NextConfig } from "next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/((?!api|_next/static|favicon.ico).*)",
};

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const config: NextConfig = await getAll();

  console.log("\nMiddleware: ", url.pathname);
  console.log(url, config, await digest());
  console.log("---------------------------");

  const redirects = config.redirects;
  if (!isRedirects(redirects)) {
    return NextResponse.next();
  }

  for (const redirect of redirects) {
    if (redirect.source === url.pathname) {
      url.pathname = redirect.destination;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Assuming NextConfig is defined elsewhere in your application
// For example: type NextConfig = { redirects: Array<{ source: string, destination: string }> };

function isRedirects(
  obj: any
): obj is Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const redirects = obj["redirects"];
  if (!Array.isArray(redirects)) {
    return false;
  }

  return redirects.every(
    (
      redirect: Awaited<
        ReturnType<NonNullable<NextConfig["redirects"]>>
      >[number]
    ) =>
      typeof redirect === "object" &&
      redirect !== null &&
      "source" in redirect &&
      "destination" in redirect &&
      typeof redirect.source === "string" &&
      typeof redirect.destination === "string"
  );
}
