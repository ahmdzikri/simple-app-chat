import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Setting cookies on the response using the `ResponseCookies` API
  if(!req.cookies.has('guid')){
    const response = NextResponse.next();
  const getGuid = "User" + Math.random().toString(36).substring(2, 15);
  const expirationDate = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );
  response.cookies.set({
    name: "guid",
    value: getGuid,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires: expirationDate,
  });
  console.log('response', response.cookies); // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

  return response;
  }
  
  
}
export const config = {
  matcher: '/',
}
