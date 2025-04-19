import { NextResponse, NextRequest } from 'next/server';
export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const url = req.nextUrl    

    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')       
    )) {
        return NextResponse.redirect(new URL('/jobs', req.url));
    }

    if (!token && (
        url.pathname.startsWith('/jobs') ||
        url.pathname.startsWith('/resume') ||
        url.pathname.startsWith('/saved-jobs') ||
        url.pathname.startsWith('/profile')        
    )) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
    
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/verify/:path*',
        '/jobs',
        '/resume',
        '/saved-jobs',
        '/profile']
}
