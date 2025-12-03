'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getLinksLang } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/ui/icons';
import { useGlobalContext } from '@/contexts/store';
import { MenuIcon, Home, User, Settings, LogOut, Wallet, FileText, HelpCircle, Phone, Info, Shield } from 'lucide-react';
import Cookies from 'js-cookie';
import { googleLogout } from '@react-oauth/google';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
    dict: any;
    lang: any;
}

export function Sidebar({ dict, lang }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useGlobalContext();
    const [open, setOpen] = useState(false);

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('token-refresh');
        location.href = `/login`;
        googleLogout();
    };

    const navItems = [
        {
            title: 'Dashboard',
            href: `${getLinksLang(lang)}/admin`,
            icon: <Home className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Users & KYC',
            href: `${getLinksLang(lang)}/admin/users-kyc`,
            icon: <User className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Audit Logs',
            href: `${getLinksLang(lang)}/admin/audit-logs`,
            icon: <FileText className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'All Orders',
            href: `${getLinksLang(lang)}/admin/orders`,
            icon: <FileText className="h-5 w-5" />,
            show: true,
        },
    ];

    const footerLinks = [
        { title: dict.help, href: 'https://help.sahmeto.com', icon: <HelpCircle className="h-4 w-4" /> },
        { title: dict.rules, href: `${getLinksLang(lang)}/privacy`, icon: <Shield className="h-4 w-4" /> },
        { title: dict.aboutUs, href: `${getLinksLang(lang)}/about`, icon: <Info className="h-4 w-4" /> },
        { title: dict.contactUs, href: `${getLinksLang(lang)}/contact`, icon: <Phone className="h-4 w-4" /> },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col py-6 bg-[#111827] text-white">
            {/* Logo and User Profile Section at Top */}
            <div className="px-6 mb-6">
                <div className="flex items-center gap-2 font-bold text-xl text-white mb-6">
                    <div className="bg-yellow-500 rounded-lg p-2">
                        <Icons.logo className="h-5 w-5 fill-black" />
                    </div>
                    <span>GoldTrade</span>
                </div>

                {user && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-white">
                            {user.first_name || 'robohamid'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user.email || 'robohamid@gmail.com'}
                        </p>
                        <div className="mt-2">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-red-500 text-white rounded">
                                Administrator
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <Separator className="bg-gray-800 mb-4" />

            {/* Navigation Menu */}
            <ScrollArea className="flex-1 px-4">
                <nav className="flex flex-col gap-1">
                    {navItems.map((item, index) => {
                        if (item.show === false) return null;
                        const isActive = pathname.includes(item.href) || (index === 0 && pathname.includes('/admin'));
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-gray-700 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Settings and Logout at Bottom */}
            <div className="px-4 py-4 space-y-1">
                <Link
                    href={`${getLinksLang(lang)}/settings`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <aside className="hidden md:flex h-screen w-[280px] flex-col border-l border-gray-800 bg-[#111827] sticky top-0 shadow-xl z-40">
            <SidebarContent />
        </aside>
    );
}
