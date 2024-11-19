'use client';

import { cn, getDirection, getLinksLang, isRtl } from '@/libs/utils';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    InstagramIcon,
    LinkedinIcon,
    MenuIcon,
    TwitterIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/contexts/store';
import { getProfile } from '@/services/getProfile';
import { refreshToken } from '@/services/refreshToken';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { googleLogout, useGoogleOneTapLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { loginWithGoogle } from '@/app/[lang]/(auth)/login/services/loginWithGoogle';
import { Icons } from '@/components/ui/icons';

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';

export function MobileMenu({ dict, lang, googleLogin = true }) {
    const [open, setOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [openSuggestion, setOpenSuggestion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, isUserLoading, setIsUserLoading, isReadingMode, setUser } =
        useGlobalContext();
    const path = usePathname();

    const items = [
        {
            key: 'home',
            title: 'خانه',
            icon: <Icons.home />,
            href: '/app'
        },
        {
            key: 'home',
            title: 'معامله',
            icon: <Icons.fire />,
            href: '/transaction'
        },
        {
            key: 'home',
            title: 'دارایی',
            icon: <Icons.graph />,
            href: '/wallet'
        },
        {
            key: 'home',
            title: 'خدمات',
            icon: <Icons.category />,
            href: '/services'
        }
    ]
    useGoogleOneTapLogin({
        disabled:
            isUserLoading ||
            !!user?.id ||
            path === '/profile' ||
            path === '/login',
        onSuccess: async (credentialResponse) => {
            try {
                const { data, status } = await loginWithGoogle(
                    lang,
                    credentialResponse.credential
                );
                Cookies.set('token', data.access, { expires: 7 });
                Cookies.set('token-refresh', data.refresh, {
                    expires: 365,
                });
                if (status === 201)
                    location.href = `${getLinksLang(lang)}/profile`;
                else location.reload();
            } catch (e) {
                toast.error(
                    e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.params?.non_field_errors?.[0]
                );
            }
        },
        onError: () => {
            toast.error('مشکلی پیش آمده.');
        },
    });

    useEffect(() => {
        getUser();
    }, []);
    useEffect(() => {
        setOpen(false);
    }, [path]);

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('token-refresh');
        location.href = `/login`;
        googleLogout();
    };
    const getUser = async () => {
        if (!Cookies.get('token') && !Cookies.get('token-refresh')) {
            setIsUserLoading(false);
            return;
        }
        setIsUserLoading(true);
        try {
            const { data, status } = await getProfile();
            setUser(data);
        } catch (e) {
            if (e?.status === 403 || e?.status === 401) {
                const token = await refreshToken(Cookies.get('token-refresh'));
                Cookies.set('token', token.access, { expires: 7 });
                Cookies.set('token-refresh', token.refresh, { expires: 365 });
                const { data, status } = await getProfile();
                setUser(data);
            }
        }
        setIsUserLoading(false);
    };

    return (
        <header
            className={cn(
                'fixed w-full bottom-0 z-[60] md:hidden items-center h-[70px] items-center justify-between text-sm text-black transition-transform md:h-[95px]',
                // path === '/'
                //     ? 'bg-neutral-700 text-white'
                // : 
                'bg-white text-black shadow-[10px_0px_12px_rgba(0,0,0,0.1)]',
                isReadingMode
                    ? '-translate-y-full md:translate-y-0'
                    : 'translate-y-0'
            )}
        >
            <div className="flex w-full items-center h-full justify-evenly flex-row">
                {items.map((item) => {
                    const isActive = path === item.href;
                    return (
                        <Link key={item.key} href={item.href} className='flex justify-center flex-col items-center gap-1 h-[30px]'>
                            <div
                                className={cn(
                                    'flex items-center justify-center p-2 rounded-lg', // Add padding and border radius if needed
                                    {
                                        'bg-[#0C0E3C]': isActive, // Set your active background color here
                                        'bg-[white]': !isActive, // Default background color
                                    }
                                )}
                            >
                                <div
                                    className={cn(
                                        {
                                            'stroke-white fill-white': isActive, // Set active icon colors
                                            'stroke-[#0C0E3C] fill-[#0C0E3C]': !isActive, // Set inactive icon colors
                                        }
                                    )}
                                >
                                    {item.icon}
                                </div>
                            </div>
                            {item.title}
                        </Link>
                    );
                })}
            </div>
        </header>
    );
}
