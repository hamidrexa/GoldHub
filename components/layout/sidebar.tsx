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
            title: dict.navMenuItems?.[0]?.title || 'Services',
            href: dict.navMenuItems?.[0]?.href || '#',
            icon: <FileText className="h-5 w-5" />,
        },
        {
            title: dict.navMenuItems?.[1]?.title || 'Blog',
            href: dict.navMenuItems?.[1]?.href || '#',
            icon: <Info className="h-5 w-5" />,
        },
        // Add dashboard specific links here
        {
            title: 'Dashboard',
            href: `${getLinksLang(lang)}/admin`, // Assuming admin is the main dashboard or we can direct to profile
            icon: <Home className="h-5 w-5" />,
            show: !!user,
        },
        {
            title: 'Profile',
            href: `${getLinksLang(lang)}/profile`,
            icon: <User className="h-5 w-5" />,
            show: !!user,
        },
        {
            title: 'Wallet',
            href: `${getLinksLang(lang)}/wallet`,
            icon: <Wallet className="h-5 w-5" />,
            show: !!user,
        },
    ];

    const footerLinks = [
        { title: dict.help, href: 'https://help.sahmeto.com', icon: <HelpCircle className="h-4 w-4" /> },
        { title: dict.rules, href: `${getLinksLang(lang)}/privacy`, icon: <Shield className="h-4 w-4" /> },
        { title: dict.aboutUs, href: `${getLinksLang(lang)}/about`, icon: <Info className="h-4 w-4" /> },
        { title: dict.contactUs, href: `${getLinksLang(lang)}/contact`, icon: <Phone className="h-4 w-4" /> },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col gap-4 py-4 bg-[#111827] text-white">
            <div className="px-6 flex items-center gap-2 font-bold text-xl text-white">
                <Icons.logo className="h-8 w-8 fill-white" />
                <span>طلانو</span>
            </div>
            <Separator className="bg-gray-800" />
            <ScrollArea className="flex-1 px-4">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item, index) => {
                        if (item.show === false) return null;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-white/10 text-white shadow-sm backdrop-blur-sm"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>
            <Separator className="bg-gray-800" />
            <div className="px-4 py-2">
                {user ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-white truncate">
                                    {user.first_name ? `${user.first_name} ${user.last_name}` : dict.sahmetoUser}
                                </span>
                                <span className="text-xs text-gray-400 truncate">
                                    {user.email || user.phone_number}
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                            {dict.logout || 'Logout'}
                        </Button>
                    </div>
                ) : (
                    <Link href={`${getLinksLang(lang)}/login`}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            {dict.loginRegister}
                        </Button>
                    </Link>
                )}
            </div>
            <div className="px-4 py-2 text-xs text-gray-500">
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {footerLinks.map((link, i) => (
                        <Link key={i} href={link.href} className="hover:text-gray-300 transition-colors flex items-center gap-1">
                            {link.icon}
                            {link.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <aside className="hidden md:flex h-screen w-[280px] flex-col border-l border-gray-800 bg-[#111827] sticky top-0 shadow-xl z-40">
            <SidebarContent />
        </aside>
    );
}
