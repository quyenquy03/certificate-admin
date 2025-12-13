import {
  ACCESS_TOKEN_KEY,
  ADMIN_PAGE_URLS,
  AUTH_PAGE_URLS,
  ORG_PAGE_URLS,
  PAGE_URLS,
  PUBLISH_PAGE_URLS,
} from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "@/enums";

export function withAuth(request: NextRequest) {
  try {
    const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
    const pathname = request.nextUrl.pathname;

    const isHomePage = pathname === PAGE_URLS.HOME;

    const isPublicPage = PUBLISH_PAGE_URLS.some((item) =>
      pathname.includes(item)
    );
    const isAuthPage = AUTH_PAGE_URLS.some((item) => item === pathname);

    if (isPublicPage || isHomePage || (isAuthPage && !token))
      return NextResponse.next();

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL(PAGE_URLS.HOME, request.url));
    }

    if (!token) {
      const loginUrl = new URL(PAGE_URLS.LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded: any = jwt.decode(token);
    const isAdminPage = ADMIN_PAGE_URLS.some((item) => pathname.includes(item));
    const isOrganizationPage = ORG_PAGE_URLS.some((item) =>
      pathname.includes(item)
    );

    if (
      (decoded?.role !== USER_ROLES.ADMIN && isAdminPage) ||
      (decoded?.role !== USER_ROLES.ORGANIZATION &&
        decoded?.role !== USER_ROLES.MANAGER &&
        isOrganizationPage)
    ) {
      return NextResponse.rewrite(new URL(PAGE_URLS.FORBIDDEN, request.url));
    }
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL(PAGE_URLS.HOME, request.url));
  }
}
