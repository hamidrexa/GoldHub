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
    Shield,
    Store,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-selector';

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

export function Header({ dict, lang, googleLogin = true }) {
    const [open, setOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [openSuggestion, setOpenSuggestion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, isUserLoading, setIsUserLoading, isReadingMode, setUser } =
        useGlobalContext();
    const path = usePathname();

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
                'sticky top-0 z-[60] grid h-16 grid-cols-[auto_1fr_auto] items-center justify-between px-6 text-sm transition-transform md:flex md:h-[90px] md:px-14',
                'bg-navy-900 text-white',
                isReadingMode
                    ? '-translate-y-full md:translate-y-0'
                    : 'translate-y-0'
            )}
        >
            <div className="flex items-center gap-3 md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <MenuIcon
                            className="md:hidden"
                            strokeWidth={1.5}
                            opacity={1}
                            color="#fff"
                        />
                    </SheetTrigger>
                    <SheetContent side={isRtl(lang) ? 'right' : 'left'}>
                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                        <div className="flex h-full flex-col justify-between pt-10">
                            <div>
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-lg">
                                            {user.first_name
                                                ? `${user.first_name} ${user.last_name}`
                                                : dict.sahmetoUser}{' '}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-lg">
                                            <Link
                                                href={`${getLinksLang(lang)}/login?url=${path}`}
                                            >
                                                {dict.loginToAccount}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-4 flex flex-col gap-2">
                                    {user?.groups?.some(
                                        (g: any) => g.name === 'admin'
                                    ) &&
                                        !path.includes('/admin') && (
                                            <Link
                                                href={`${getLinksLang(lang)}/admin`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start gap-2 border-gold-600 bg-transparent text-black hover:bg-gold-600 hover:text-white"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    {dict.switchToAdmin ||
                                                        'Switch to Admin'}
                                                </Button>
                                            </Link>
                                        )}
                                    {user?.groups?.some(
                                        (g: any) =>
                                            g.name === 'supplier_approved'
                                    ) &&
                                        !path.includes('/supplier') && (
                                            <Link
                                                href={`${getLinksLang(lang)}/supplier/dashboard`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start gap-2 border-gold-600 bg-transparent text-black hover:bg-gold-600 hover:text-white"
                                                >
                                                    <Store className="h-4 w-4" />
                                                    {dict.switchToSupplier ||
                                                        'Switch to Supplier'}
                                                </Button>
                                            </Link>
                                        )}
                                    {user?.groups?.some(
                                        (g: any) => g.name === 'buyer_approved'
                                    ) &&
                                        !path.includes('/buyer') && (
                                            <Link
                                                href={`${getLinksLang(lang)}/buyer/dashboard`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start gap-2 border-gold-600 bg-transparent text-black hover:bg-gold-600 hover:text-white"
                                                >
                                                    <Store className="h-4 w-4" />
                                                    {dict.switchToBuyer ||
                                                        'Switch to Buyer'}
                                                </Button>
                                            </Link>
                                        )}
                                </div>
                                <div className="mt-8 flex flex-col items-start gap-4 text-lg font-medium">
                                    {/* Dynamic Role-Based Menu Items */}
                                    {(path.includes('/buyer')
                                        ? [
                                              {
                                                  title: 'Dashboard',
                                                  href: `${getLinksLang(lang)}/buyer`,
                                              },
                                              {
                                                  title: 'Catalog',
                                                  href: `${getLinksLang(lang)}/buyer/catalog`,
                                              },
                                              {
                                                  title: 'My Orders',
                                                  href: `${getLinksLang(lang)}/buyer/orders`,
                                              },
                                              {
                                                  title: 'Cart',
                                                  href: `${getLinksLang(lang)}/buyer/cart`,
                                              },
                                              {
                                                  title: 'Favorites',
                                                  href: `${getLinksLang(lang)}/buyer/favorites`,
                                              },
                                          ]
                                        : path.includes('/supplier')
                                          ? [
                                                {
                                                    title: 'Dashboard',
                                                    href: `${getLinksLang(lang)}/supplier/dashboard`,
                                                },
                                                {
                                                    title: 'My Products',
                                                    href: `${getLinksLang(lang)}/supplier/products`,
                                                },
                                                {
                                                    title: 'Pricing',
                                                    href: `${getLinksLang(lang)}/supplier/pricing`,
                                                },
                                                {
                                                    title: 'Orders',
                                                    href: `${getLinksLang(lang)}/supplier/orders`,
                                                },
                                            ]
                                          : path.includes('/admin')
                                            ? [
                                                  {
                                                      title: 'Dashboard',
                                                      href: `${getLinksLang(lang)}/admin`,
                                                  },
                                                  {
                                                      title: 'Users & KYC',
                                                      href: `${getLinksLang(lang)}/admin/users-kyc`,
                                                  },
                                                  {
                                                      title: 'Audit Logs',
                                                      href: `${getLinksLang(lang)}/admin/audit-logs`,
                                                  },
                                                  {
                                                      title: 'All Orders',
                                                      href: `${getLinksLang(lang)}/admin/orders`,
                                                  },
                                              ]
                                            : dict.navMenuItems
                                    ).map((item: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            className="flex items-center gap-3 transition-colors hover:text-violet-900"
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="my-6 flex items-center justify-between">
                                    <LanguageSwitcher
                                        currentLang={lang}
                                        lang={lang}
                                        isMobile={true}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-start justify-center gap-8">
                                    <Link
                                        href="https://www.instagram.com/talanowir"
                                        rel="nofollow"
                                    >
                                        <InstagramIcon strokeWidth={1.125} />
                                    </Link>
                                    <Link
                                        href="https://www.linkedin.com/company/talanowir"
                                        rel="nofollow"
                                    >
                                        <LinkedinIcon strokeWidth={1.125} />
                                    </Link>
                                    <Link href="#twitter" rel="nofollow">
                                        <TwitterIcon strokeWidth={1.125} />
                                    </Link>
                                </div>
                                <div className="mt-7 flex items-start justify-center gap-8 text-xs">
                                    <Link
                                        href="https://help.sahmeto.com"
                                        legacyBehavior
                                        passHref
                                    >
                                        <a className="flex items-center justify-center gap-3">
                                            {dict.help}
                                        </a>
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/privacy`}
                                        legacyBehavior
                                        passHref
                                    >
                                        <a className="flex items-center justify-center gap-3">
                                            {dict.rules}
                                        </a>
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/about`}
                                        legacyBehavior
                                        passHref
                                    >
                                        <a className="flex items-center justify-center gap-3">
                                            {dict.aboutUs}
                                        </a>
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/contact`}
                                        legacyBehavior
                                        passHref
                                    >
                                        <a className="flex items-center justify-center gap-3">
                                            {dict.contactUs}
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex items-center justify-center gap-1">
                <div className="flex justify-between">
                    <div className="flex shrink-0 items-center gap-2">
                        <Link
                            href={`${getLinksLang(lang)}/`}
                            className="flex items-center gap-2 text-lg font-black text-white"
                        >
                            <Icons.logoDark className="h-7 w-24 md:h-9 md:w-32" />
                            <span className="hidden whitespace-nowrap sm:inline">
                                GoldHub
                            </span>
                        </Link>
                    </div>
                    {/* RIGHT: Language Selector */}
                    {/*<div className="flex items-center">*/}
                    {/*    <LanguageSwitcher currentLang={lang} />*/}
                    {/*</div>*/}
                </div>

                <hr className="hidden h-7 w-px bg-navy-700 md:flex ltr:ml-3 rtl:mr-3" />
                <NavigationMenu
                    className="hidden md:block"
                    dir={getDirection(lang)}
                >
                    <NavigationMenuList>
                        {dict.navMenuItems.map((navMenuItem) => (
                            <NavigationMenuItem
                                key={navMenuItem.title}
                                title={navMenuItem.title}
                            >
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                    href={navMenuItem.href}
                                    rel={navMenuItem.rel}
                                >
                                    {navMenuItem.title}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex shrink-0 justify-end md:hidden">
                {user ? (
                    <Link
                        href={`${getLinksLang(lang)}/profile`}
                        legacyBehavior
                        passHref
                    >
                        <svg
                            width="17"
                            height="21"
                            viewBox="0 0 17 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g filter="url(#filter0_b_288_2942)">
                                <path
                                    d="M6.67623 20.8679C6.55562 20.8679 6.47012 20.867 6.39182 20.8652L6.24783 20.8598C6.06873 20.8508 5.91033 20.8328 5.84462 20.813C5.05442 20.759 4.26962 20.6456 3.51182 20.4746L3.25622 20.4206C1.70732 20.0777 0.733525 19.4549 0.280825 18.5189C0.0963248 18.1283 -0.000875228 17.6954 2.4772e-05 17.267C-0.00177523 16.8305 0.0945248 16.4057 0.287125 16.0034C0.754225 15.0656 1.86212 14.3924 3.49112 14.0558C4.26152 13.8902 5.04812 13.7795 5.83022 13.7246C6.54842 13.6616 7.27833 13.6301 8.00012 13.6301C8.72192 13.6301 9.45183 13.6616 10.17 13.7246L10.6308 13.7633C11.2617 13.8263 11.8917 13.9244 12.5037 14.0549C14.2308 14.4104 15.2523 15.0341 15.7185 16.0169C16.0956 16.8125 16.0956 17.7251 15.7185 18.5207C15.255 19.499 14.2065 20.1371 12.5154 20.4701L12.0474 20.5673C11.4255 20.687 10.7928 20.7689 10.1673 20.8121C9.45183 20.8733 8.72552 20.9039 8.00912 20.9039C7.56273 20.9039 7.11363 20.8922 6.67623 20.8679ZM5.94272 15.1682C5.21642 15.2195 4.49102 15.3221 3.78632 15.4733C2.65412 15.7064 1.83062 16.1429 1.58132 16.6415C1.48772 16.8368 1.44092 17.0465 1.44182 17.2652C1.44092 17.483 1.48862 17.6999 1.58042 17.8925C1.83512 18.4199 2.60552 18.8222 3.80792 19.0571L4.16073 19.1318C4.75023 19.2488 5.36312 19.3307 6.03452 19.3811C6.12092 19.3991 6.21273 19.409 6.32162 19.4144L6.71492 19.4207C7.14423 19.4441 7.58073 19.4558 8.01093 19.4558C8.68863 19.4558 9.37712 19.427 10.0575 19.3685C10.7838 19.319 11.4912 19.2155 12.2193 19.0535L12.4443 19.0058C13.5054 18.7655 14.1876 18.3821 14.4171 17.8979C14.607 17.4974 14.607 17.0384 14.4171 16.6388C14.1723 16.1231 13.4091 15.719 12.2085 15.4715C11.4993 15.3203 10.7757 15.2186 10.0566 15.1682L10.044 15.1664C9.36903 15.107 8.68322 15.0773 8.00642 15.0773C7.32242 15.0773 6.62762 15.1079 5.94272 15.1682ZM2.69192 6.23925C2.69192 3.29715 5.07512 0.904053 8.00463 0.904053C10.9341 0.904053 13.3173 3.29715 13.3173 6.23925C13.3173 9.18135 10.9341 11.5745 8.00463 11.5745C5.07512 11.5745 2.69192 9.18135 2.69192 6.23925ZM4.13372 6.23925C4.13372 8.38305 5.86982 10.1264 8.00463 10.1264C10.1385 10.1264 11.8755 8.38305 11.8755 6.23925C11.8755 4.09635 10.1385 2.35215 8.00463 2.35215C5.86982 2.35215 4.13372 4.09635 4.13372 6.23925Z"
                                    fill="currentColor"
                                />
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_288_2942"
                                    x="-9.98147"
                                    y="-9.07742"
                                    width="35.9643"
                                    height="39.9627"
                                    filterUnits="userSpaceOnUse"
                                    colorInterpolationFilters="sRGB"
                                >
                                    <feFlood
                                        floodOpacity="0"
                                        result="BackgroundImageFix"
                                    />
                                    <feGaussianBlur
                                        in="BackgroundImageFix"
                                        stdDeviation="4.99073"
                                    />
                                    <feComposite
                                        in2="SourceAlpha"
                                        operator="in"
                                        result="effect1_backgroundBlur_288_2942"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_288_2942"
                                        result="shape"
                                    />
                                </filter>
                            </defs>
                        </svg>
                    </Link>
                ) : (
                    <Link
                        href={`${getLinksLang(lang)}/login?url=${path}`}
                        legacyBehavior
                        passHref
                    >
                        <a className="flex items-center rounded-md bg-gold-600 px-3 py-2 font-medium text-black">
                            {dict.auth.loginRegister}
                        </a>
                    </Link>
                )}
            </div>
            <div className="hidden items-center gap-5 md:flex">
                {isUserLoading ? (
                    <Skeleton className="h-12 w-12" />
                ) : user ? (
                    <Link href={`${getLinksLang(lang)}/profile`}>
                        <svg
                            width="17"
                            height="21"
                            viewBox="0 0 17 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g filter="url(#filter0_b_288_2942)">
                                <path
                                    d="M6.67623 20.8679C6.55562 20.8679 6.47012 20.867 6.39182 20.8652L6.24783 20.8598C6.06873 20.8508 5.91033 20.8328 5.84462 20.813C5.05442 20.759 4.26962 20.6456 3.51182 20.4746L3.25622 20.4206C1.70732 20.0777 0.733525 19.4549 0.280825 18.5189C0.0963248 18.1283 -0.000875228 17.6954 2.4772e-05 17.267C-0.00177523 16.8305 0.0945248 16.4057 0.287125 16.0034C0.754225 15.0656 1.86212 14.3924 3.49112 14.0558C4.26152 13.8902 5.04812 13.7795 5.83022 13.7246C6.54842 13.6616 7.27833 13.6301 8.00012 13.6301C8.72192 13.6301 9.45183 13.6616 10.17 13.7246L10.6308 13.7633C11.2617 13.8263 11.8917 13.9244 12.5037 14.0549C14.2308 14.4104 15.2523 15.0341 15.7185 16.0169C16.0956 16.8125 16.0956 17.7251 15.7185 18.5207C15.255 19.499 14.2065 20.1371 12.5154 20.4701L12.0474 20.5673C11.4255 20.687 10.7928 20.7689 10.1673 20.8121C9.45183 20.8733 8.72552 20.9039 8.00912 20.9039C7.56273 20.9039 7.11363 20.8922 6.67623 20.8679ZM5.94272 15.1682C5.21642 15.2195 4.49102 15.3221 3.78632 15.4733C2.65412 15.7064 1.83062 16.1429 1.58132 16.6415C1.48772 16.8368 1.44092 17.0465 1.44182 17.2652C1.44092 17.483 1.48862 17.6999 1.58042 17.8925C1.83512 18.4199 2.60552 18.8222 3.80792 19.0571L4.16073 19.1318C4.75023 19.2488 5.36312 19.3307 6.03452 19.3811C6.12092 19.3991 6.21273 19.409 6.32162 19.4144L6.71492 19.4207C7.14423 19.4441 7.58073 19.4558 8.01093 19.4558C8.68863 19.4558 9.37712 19.427 10.0575 19.3685C10.7838 19.319 11.4912 19.2155 12.2193 19.0535L12.4443 19.0058C13.5054 18.7655 14.1876 18.3821 14.4171 17.8979C14.607 17.4974 14.607 17.0384 14.4171 16.6388C14.1723 16.1231 13.4091 15.719 12.2085 15.4715C11.4993 15.3203 10.7757 15.2186 10.0566 15.1682L10.044 15.1664C9.36903 15.107 8.68322 15.0773 8.00642 15.0773C7.32242 15.0773 6.62762 15.1079 5.94272 15.1682ZM2.69192 6.23925C2.69192 3.29715 5.07512 0.904053 8.00463 0.904053C10.9341 0.904053 13.3173 3.29715 13.3173 6.23925C13.3173 9.18135 10.9341 11.5745 8.00463 11.5745C5.07512 11.5745 2.69192 9.18135 2.69192 6.23925ZM4.13372 6.23925C4.13372 8.38305 5.86982 10.1264 8.00463 10.1264C10.1385 10.1264 11.8755 8.38305 11.8755 6.23925C11.8755 4.09635 10.1385 2.35215 8.00463 2.35215C5.86982 2.35215 4.13372 4.09635 4.13372 6.23925Z"
                                    fill="currentColor"
                                />
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_288_2942"
                                    x="-9.98147"
                                    y="-9.07742"
                                    width="35.9643"
                                    height="39.9627"
                                    filterUnits="userSpaceOnUse"
                                    colorInterpolationFilters="sRGB"
                                >
                                    <feFlood
                                        floodOpacity="0"
                                        result="BackgroundImageFix"
                                    />
                                    <feGaussianBlur
                                        in="BackgroundImageFix"
                                        stdDeviation="4.99073"
                                    />
                                    <feComposite
                                        in2="SourceAlpha"
                                        operator="in"
                                        result="effect1_backgroundBlur_288_2942"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_288_2942"
                                        result="shape"
                                    />
                                </filter>
                            </defs>
                        </svg>
                    </Link>
                ) : (
                    <Link
                        href={`${getLinksLang(lang)}/login?url=${path}`}
                        className="flex h-12 items-center justify-center rounded-md border border-transparent bg-gold-600 px-10 font-medium text-black"
                    >
                        {dict.auth.loginRegister}
                    </Link>
                )}
            </div>
        </header>
    );
}
