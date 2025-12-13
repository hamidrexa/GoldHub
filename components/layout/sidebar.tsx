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
import { MenuIcon, Home, User, Settings, LogOut, Wallet, FileText, HelpCircle, Phone, Info, Shield, Package, DollarSign, ShoppingBag, BarChart3, ShoppingCart, Heart, Store } from 'lucide-react';
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

    // Detect role based on current pathname
    const isSupplier = pathname.includes('/supplier');
    const isAdmin = pathname.includes('/admin');
    const isBuyer = pathname.includes('/buyer');

    const adminNavItems = [
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

    const supplierNavItems = [
        {
            title: 'Dashboard',
            href: `${getLinksLang(lang)}/supplier/dashboard`,
            icon: <BarChart3 className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'My Products',
            href: `${getLinksLang(lang)}/supplier/products`,
            icon: <Package className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Pricing',
            href: `${getLinksLang(lang)}/supplier/pricing`,
            icon: <DollarSign className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Orders',
            href: `${getLinksLang(lang)}/supplier/orders`,
            icon: <ShoppingBag className="h-5 w-5" />,
            show: true,
        },
    ];

    const buyerNavItems = [
        {
            title: 'Dashboard',
            href: `${getLinksLang(lang)}/buyer`,
            icon: <Home className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Catalog',
            href: `${getLinksLang(lang)}/buyer/catalog`,
            icon: <Store className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'My Orders',
            href: `${getLinksLang(lang)}/buyer/orders`,
            icon: <ShoppingBag className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Cart',
            href: `${getLinksLang(lang)}/buyer/cart`,
            icon: <ShoppingCart className="h-5 w-5" />,
            show: true,
        },
        {
            title: 'Favorites',
            href: `${getLinksLang(lang)}/buyer/favorites`,
            icon: <Heart className="h-5 w-5" />,
            show: true,
        },
    ];

    const navItems = isBuyer ? buyerNavItems : isSupplier ? supplierNavItems : adminNavItems;

    const footerLinks = [
        { title: dict.help, href: 'https://help.sahmeto.com', icon: <HelpCircle className="h-4 w-4" /> },
        { title: dict.rules, href: `${getLinksLang(lang)}/privacy`, icon: <Shield className="h-4 w-4" /> },
        { title: dict.aboutUs, href: `${getLinksLang(lang)}/about`, icon: <Info className="h-4 w-4" /> },
        { title: dict.contactUs, href: `${getLinksLang(lang)}/contact`, icon: <Phone className="h-4 w-4" /> },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col py-6 bg-sidebar-bg text-white">
            {/* Logo Section at Top */}
            <div className="px-6 mb-6">
                <div className="flex items-center gap-2 font-bold text-xl text-white mb-6">
                    <Icons.logoDark className="h-5 w-5 fill-black" />
                    <span>GoldTrade</span>
                </div>
            </div>

            <Separator className="bg-gold-200/15 mb-4" />

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
                                        ? "bg-gold-200/15 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <Separator className="bg-gold-200/15 mb-4" />

            {/* User Info / Login Section at Bottom */}
            <div className="px-4 py-4 space-y-4">
                {user ? (
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-white">
                                {user.first_name || 'robohamid'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user.email || 'robohamid@gmail.com'}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href={`${getLinksLang(lang)}/login?url=${pathname}`}
                        className="flex h-12 items-center justify-center rounded-md border border-transparent bg-neutral-800 px-10 font-medium text-white hover:bg-neutral-700"
                    >
                        {dict.loginRegister}
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <aside className="hidden md:flex h-screen w-[280px] flex-col border-l border-gray-800 bg-sidebar-bg sticky top-0 shadow-xl z-40">
            <SidebarContent />
        </aside>
    );
}
