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
        <div className="flex flex-col min-h-screen w-full bg-gray-50">
            {/* Header - Mobile Only for dashboard pages */}
            <div className="md:hidden">
                <Header dict={dict} lang={lang} />
            </div>

            <div className="flex flex-1 min-h-screen transition-all duration-300">
                {/* Sidebar - Desktop Only */}
                <Sidebar dict={dict} lang={lang} />

                <div className="flex flex-col flex-1 min-h-screen transition-all duration-300">

                    {/* Main Content - Light Gradient Background */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                        {children}
                    </main>

                    {/* Mobile Menu - Mobile Only */}
                    <MobileMenu dict={dict} lang={lang} />
                </div>
            </div>
        </div>
    );
}
