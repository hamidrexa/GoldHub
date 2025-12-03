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
        <div className="flex h-full flex-col gap-4 py-4">
            <div className="px-6 flex items-center gap-2 font-bold text-xl">
                <Icons.logo className="h-8 w-8" />
                <span>طلانو</span>
            </div>
            <Separator />
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
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>
            <Separator />
            <div className="px-4 py-2">
                {user ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {user.first_name ? `${user.first_name} ${user.last_name}` : dict.sahmetoUser}
                                </span>
                                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {user.email || user.phone_number}
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                            {dict.logout || 'Logout'}
                        </Button>
                    </div>
                ) : (
                    <Link href={`${getLinksLang(lang)}/login`}>
                        <Button className="w-full">
                            {dict.loginRegister}
                        </Button>
                    </Link>
                )}
            </div>
            <div className="px-4 py-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {footerLinks.map((link, i) => (
                        <Link key={i} href={link.href} className="hover:underline flex items-center gap-1">
                            {link.icon}
                            {link.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 right-4 z-50">
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-[300px]">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-screen w-[280px] flex-col border-l bg-background sticky top-0">
                <SidebarContent />
            </aside>
        </>
    );
}
