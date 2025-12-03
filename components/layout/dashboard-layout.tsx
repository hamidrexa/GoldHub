'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MobileMenu } from '@/components/mobileMenu';
import { cn } from '@/libs/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
    dict: any;
    lang: any;
}

export function DashboardLayout({ children, dict, lang }: DashboardLayoutProps) {
    const pathname = usePathname();

    // Check if we are on the home page. 
    // pathname might be "/" or "/en" or "/fa" etc.
    // We can check if it matches `/${lang}` or just `/` if lang is missing (though middleware handles that).
    const isHomePage = pathname === `/${lang}` || pathname === '/' || pathname === `/${lang}/`;

    if (isHomePage) {
        return (
            <>
                <Header dict={dict} lang={lang} />
                {children}
                <MobileMenu dict={dict} lang={lang} />
                <Footer dict={dict} lang={lang} />
            </>
        );
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar dict={dict} lang={lang} />
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Mobile Header Placeholder if needed, or Sidebar handles it via fixed button */}
                {/* The Sidebar component has a fixed mobile trigger button. */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
