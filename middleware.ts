import { type NextRequest, NextResponse } from 'next/server';

import { i18n } from '@/i18n-config';

function getLocale(request: NextRequest): string | undefined {
    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales;

    const localeFromPath = request.nextUrl.pathname.split('/')[1];

    if (locales.includes(localeFromPath)) {
        return localeFromPath;
    }

    return i18n.defaultLocale;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;

    const protectedRoutes = ['/app', '/admin', '/supplier', '/buyer'];
    const isProtected = protectedRoutes.some((route) =>
        pathname.includes(route)
    );

    if (isProtected && !token) {
        const locale = getLocale(request);
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('redirect', pathname + search);
        return NextResponse.redirect(loginUrl);
    }

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        if (locale === i18n.defaultLocale)
            return NextResponse.rewrite(
                new URL(
                    `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`,
                    request.url
                )
            );

        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`,
                request.url
            )
        );
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)'],
};
