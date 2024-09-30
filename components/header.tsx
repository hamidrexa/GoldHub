'use client';

import { cn, getDirection, getLinksLang, isRtl } from '@/libs/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    InstagramIcon,
    LinkedinIcon,
    MenuIcon,
    SearchIcon,
    TwitterIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/contexts/store';
import { Suggestion } from '@/components/suggestion';
import { getProfile } from '@/services/getProfile';
import { refreshToken } from '@/services/refreshToken';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { googleLogout, useGoogleOneTapLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { loginWithGoogle } from '@/app/[lang]/(auth)/login/services/loginWithGoogle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import PublishSignal from '@/components/publish-modal';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { isMobileOnly } from 'react-device-detect';

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
            path === '/user/login',
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
        location.href = `/user/login`;
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
            if (e?.status === 403) {
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
                'sticky top-0 z-[60] grid h-16 grid-cols-3 items-center justify-between bg-white px-6 text-sm transition-transform md:flex md:h-[90px] md:px-14',
                path === '/copytrade'
                    ? ''
                    : 'shadow-[0px_5px_30px_0px_rgba(12,_14,_60,_0.1)]',
                isReadingMode
                    ? '-translate-y-full md:translate-y-0'
                    : 'translate-y-0'
            )}
        >
            <div className="flex items-center gap-3 md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <MenuIcon className="md:hidden" strokeWidth={1.2} />
                    </SheetTrigger>
                    <SheetContent side={isRtl(lang) ? 'right' : 'left'}>
                        <div className="flex h-full flex-col justify-between pt-10">
                            <div>
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-lg">
                                            {`${user.first_name} ${user.last_name}` ??
                                                dict.sahmetoUser}{' '}
                                            <Link
                                                href={`${getLinksLang(lang)}/profile`}
                                                className="text-neutral-300 underline underline-offset-2"
                                            >
                                                ({dict.edit})
                                            </Link>
                                        </div>
                                        <div className="text-xs">
                                            {user.active_plan
                                                ? user.active_plan.plan.name
                                                : dict.planFinished}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-lg">
                                            <Link
                                                href={`${getLinksLang(lang)}/user/login?url=${path}`}
                                            >
                                                {dict.loginToAccount}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-14 flex flex-col items-start gap-8 text-xl font-black">
                                    <Link
                                        href={`${getLinksLang(lang)}/pricing`}
                                        legacyBehavior
                                        passHref
                                    >
                                        <a className="flex items-center justify-center gap-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="21"
                                                fill="none"
                                                viewBox="0 0 20 21"
                                            >
                                                <g filter="url(#filter0_b_288_2301)">
                                                    <path
                                                        stroke="#200E32"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M5.422 17.724a.766.766 0 010 1.53.764.764 0 110-1.53z"
                                                    ></path>
                                                </g>
                                                <g filter="url(#filter1_b_288_2301)">
                                                    <path
                                                        stroke="#200E32"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M16.675 17.724a.766.766 0 11-.002 1.532.766.766 0 01.002-1.532z"
                                                    ></path>
                                                </g>
                                                <g filter="url(#filter2_b_288_2301)">
                                                    <path
                                                        stroke="#200E32"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M.75 1.154l2.08.36.963 11.473A1.802 1.802 0 005.59 14.64h10.912c.896 0 1.656-.658 1.785-1.546l.949-6.558a1.34 1.34 0 00-1.327-1.533H3.164"
                                                    ></path>
                                                </g>
                                                <g filter="url(#filter3_b_288_2301)">
                                                    <path
                                                        stroke="#200E32"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="M12.126 8.7h2.773"
                                                    ></path>
                                                </g>
                                                <defs>
                                                    <filter
                                                        id="filter0_b_288_2301"
                                                        width="24.082"
                                                        height="24.082"
                                                        x="-6.618"
                                                        y="6.448"
                                                        colorInterpolationFilters="sRGB"
                                                        filterUnits="userSpaceOnUse"
                                                    >
                                                        <feFlood
                                                            floodOpacity="0"
                                                            result="BackgroundImageFix"
                                                        ></feFlood>
                                                        <feGaussianBlur
                                                            in="BackgroundImageFix"
                                                            stdDeviation="5.263"
                                                        ></feGaussianBlur>
                                                        <feComposite
                                                            in2="SourceAlpha"
                                                            operator="in"
                                                            result="effect1_backgroundBlur_288_2301"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_288_2301"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                    <filter
                                                        id="filter1_b_288_2301"
                                                        width="24.083"
                                                        height="24.082"
                                                        x="4.633"
                                                        y="6.448"
                                                        colorInterpolationFilters="sRGB"
                                                        filterUnits="userSpaceOnUse"
                                                    >
                                                        <feFlood
                                                            floodOpacity="0"
                                                            result="BackgroundImageFix"
                                                        ></feFlood>
                                                        <feGaussianBlur
                                                            in="BackgroundImageFix"
                                                            stdDeviation="5.263"
                                                        ></feGaussianBlur>
                                                        <feComposite
                                                            in2="SourceAlpha"
                                                            operator="in"
                                                            result="effect1_backgroundBlur_288_2301"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_288_2301"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                    <filter
                                                        id="filter2_b_288_2301"
                                                        width="41.053"
                                                        height="36.039"
                                                        x="-10.526"
                                                        y="-10.122"
                                                        colorInterpolationFilters="sRGB"
                                                        filterUnits="userSpaceOnUse"
                                                    >
                                                        <feFlood
                                                            floodOpacity="0"
                                                            result="BackgroundImageFix"
                                                        ></feFlood>
                                                        <feGaussianBlur
                                                            in="BackgroundImageFix"
                                                            stdDeviation="5.263"
                                                        ></feGaussianBlur>
                                                        <feComposite
                                                            in2="SourceAlpha"
                                                            operator="in"
                                                            result="effect1_backgroundBlur_288_2301"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_288_2301"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                    <filter
                                                        id="filter3_b_288_2301"
                                                        width="25.326"
                                                        height="22.553"
                                                        x="0.849"
                                                        y="-2.577"
                                                        colorInterpolationFilters="sRGB"
                                                        filterUnits="userSpaceOnUse"
                                                    >
                                                        <feFlood
                                                            floodOpacity="0"
                                                            result="BackgroundImageFix"
                                                        ></feFlood>
                                                        <feGaussianBlur
                                                            in="BackgroundImageFix"
                                                            stdDeviation="5.263"
                                                        ></feGaussianBlur>
                                                        <feComposite
                                                            in2="SourceAlpha"
                                                            operator="in"
                                                            result="effect1_backgroundBlur_288_2301"
                                                        ></feComposite>
                                                        <feBlend
                                                            in="SourceGraphic"
                                                            in2="effect1_backgroundBlur_288_2301"
                                                            result="shape"
                                                        ></feBlend>
                                                    </filter>
                                                </defs>
                                            </svg>
                                            {dict.buySubscription}
                                        </a>
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/signals`}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="20"
                                            fill="none"
                                            viewBox="0 0 22 20"
                                        >
                                            <g filter="url(#filter0_b_288_3054)">
                                                <path
                                                    stroke="#200E32"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M11.714 1.345l2.316 4.659c.116.235.34.399.6.437l5.185.749c.21.028.4.138.528.306a.77.77 0 01-.085 1.032L16.5 12.162a.762.762 0 00-.226.7l.9 5.129a.787.787 0 01-.652.892.868.868 0 01-.516-.08l-4.618-2.421a.776.776 0 00-.742 0l-4.652 2.434a.812.812 0 01-1.077-.33.796.796 0 01-.08-.5l.9-5.128a.788.788 0 00-.227-.7L1.732 8.525a.786.786 0 01-.003-1.112l.003-.004a.91.91 0 01.452-.222l5.186-.75A.812.812 0 007.97 6l2.314-4.655a.787.787 0 01.458-.4.798.798 0 01.61.044.82.82 0 01.362.356z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_288_3054"
                                                    width="41.555"
                                                    height="40.553"
                                                    x="-9.776"
                                                    y="-10.372"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_288_3054"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_288_3054"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {dict.selectedIcons}
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/feed`}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="20"
                                            fill="none"
                                            viewBox="0 0 22 20"
                                        >
                                            <g filter="url(#filter0_b_288_2147)">
                                                <path
                                                    stroke="#200E32"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M10.761 18.758a34.84 34.84 0 01-6.022-4.689A11.99 11.99 0 011.873 9.5c-1.076-3.345.18-7.174 3.698-8.307a5.978 5.978 0 015.425.914 5.987 5.987 0 015.425-.914c3.517 1.133 4.783 4.962 3.707 8.307a11.99 11.99 0 01-2.866 4.57 34.84 34.84 0 01-6.022 4.689l-.235.146-.244-.146z"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter1_b_288_2147)">
                                                <path
                                                    stroke="#200E32"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M14.74 4.957a2.782 2.782 0 011.916 2.422"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_288_2147"
                                                    width="41.546"
                                                    height="40.553"
                                                    x="-9.773"
                                                    y="-10.372"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_288_2147"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_288_2147"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter1_b_288_2147"
                                                    width="24.47"
                                                    height="24.975"
                                                    x="3.463"
                                                    y="-6.319"
                                                    colorInterpolationFilters="sRGB"
                                                    filterUnits="userSpaceOnUse"
                                                >
                                                    <feFlood
                                                        floodOpacity="0"
                                                        result="BackgroundImageFix"
                                                    ></feFlood>
                                                    <feGaussianBlur
                                                        in="BackgroundImageFix"
                                                        stdDeviation="5.263"
                                                    ></feGaussianBlur>
                                                    <feComposite
                                                        in2="SourceAlpha"
                                                        operator="in"
                                                        result="effect1_backgroundBlur_288_2147"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_288_2147"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {dict.feed}
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/leaderboard`}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <svg
                                            width="20"
                                            height="19"
                                            viewBox="0 0 20 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g filter="url(#filter0_b_288_2626)">
                                                <path
                                                    d="M14.3963 18.6734C14.396 18.6732 14.3957 18.6729 14.3954 18.6727C14.3945 18.6721 14.3936 18.6714 14.3926 18.6707C14.3637 18.6491 14.3359 18.6252 14.3103 18.5998L14.308 18.5978L10.2301 14.501C9.93762 14.2076 9.93942 13.7333 10.2328 13.4408C10.4992 13.1753 10.9159 13.1519 11.2093 13.3706L11.293 13.4435L14.0893 16.2518V4.45068C14.0893 4.03668 14.425 3.70098 14.8399 3.70098C15.2197 3.70098 15.5329 3.98268 15.5824 4.34898L15.5896 4.45068V16.2511L18.3859 13.4435C18.6775 13.1492 19.1527 13.1483 19.4461 13.4408C19.7134 13.7063 19.7386 14.123 19.5217 14.4173L19.4488 14.501L15.3709 18.5978C15.3708 18.5979 15.3711 18.5976 15.3709 18.5978C15.3696 18.5991 15.3677 18.6009 15.3664 18.6022C15.2205 18.7467 15.03 18.819 14.8396 18.819C14.6836 18.819 14.5276 18.7704 14.3963 18.6734ZM4.16772 15.4568L4.16142 15.3551V3.55249L1.36512 6.36228C1.09962 6.62868 0.682919 6.65388 0.388619 6.43698L0.304019 6.36498C0.0376194 6.09858 0.0124194 5.68278 0.229319 5.38848L0.302219 5.30388L4.38012 1.20708C4.46917 1.11772 4.57512 1.05557 4.68771 1.02053C4.6881 1.0204 4.68847 1.02029 4.68886 1.02017C4.69383 1.01863 4.69882 1.01714 4.70382 1.0157C4.70532 1.01527 4.7068 1.01486 4.70831 1.01443C4.71239 1.01329 4.71652 1.01216 4.72062 1.01109C4.72281 1.01052 4.72505 1.00994 4.72725 1.00939C4.73056 1.00855 4.7339 1.00773 4.73722 1.00694C4.74017 1.00624 4.74315 1.00555 4.74611 1.00489C4.74891 1.00426 4.75174 1.00364 4.75455 1.00304C4.7579 1.00233 4.7613 1.00163 4.76467 1.00096C4.76704 1.00049 4.76939 1.00004 4.77177 0.999593C4.77546 0.998897 4.77913 0.998222 4.78283 0.99758C4.7852 0.997172 4.78755 0.996789 4.78992 0.996403C4.79359 0.995805 4.7973 0.995213 4.80099 0.994668C4.80338 0.994314 4.80577 0.993991 4.80817 0.99366C4.81175 0.993167 4.81537 0.992673 4.81897 0.992231C4.82177 0.991885 4.82453 0.991587 4.82734 0.991273C4.83058 0.990912 4.83379 0.990547 4.83704 0.990227C4.84038 0.989898 4.84374 0.989617 4.84708 0.989332C4.84973 0.989108 4.85235 0.988863 4.855 0.988666C4.85949 0.988331 4.86395 0.988068 4.86845 0.987812C4.87007 0.987721 4.87168 0.987604 4.8733 0.987524C4.8918 0.986591 4.91031 0.986347 4.92883 0.986779C4.92876 0.986777 4.9289 0.98678 4.92883 0.986779C4.93429 0.986907 4.93995 0.987108 4.94541 0.987355C4.94632 0.987397 4.94725 0.987445 4.94816 0.987489C4.95275 0.987714 4.95734 0.987981 4.96192 0.988289C4.96322 0.988376 4.96455 0.988465 4.96585 0.988559C4.97034 0.988885 4.97482 0.989251 4.97931 0.989658C4.9803 0.989748 4.98131 0.989827 4.98231 0.989921C4.98735 0.990398 4.99241 0.990927 4.99744 0.991506C4.998 0.99157 4.99851 0.991617 4.99908 0.991683C5.00447 0.992315 5.00989 0.993012 5.01527 0.993761C5.01701 0.994003 5.01878 0.994285 5.02051 0.994539C5.02388 0.995032 5.02728 0.995536 5.03064 0.996074C5.03312 0.996473 5.03559 0.996898 5.03806 0.997321C5.04102 0.997825 5.04396 0.998335 5.04691 0.998875C5.04917 0.99929 5.05141 0.999713 5.05367 1.00015C5.05678 1.00075 5.05989 1.00137 5.063 1.00201C5.06514 1.00245 5.06728 1.00289 5.06941 1.00335C5.07285 1.00408 5.07628 1.00486 5.07971 1.00565C5.08145 1.00604 5.08318 1.00643 5.0849 1.00684C5.18182 1.02979 5.27505 1.07223 5.35842 1.13418L5.36232 1.13753C5.38845 1.15724 5.41322 1.1786 5.43654 1.20149L5.44302 1.20708L9.52092 5.30388C9.81252 5.59728 9.81162 6.07248 9.51822 6.36498C9.25092 6.63048 8.83422 6.65388 8.54172 6.43518L8.45712 6.36228L5.66082 3.55249V15.3551C5.66082 15.7691 5.32512 16.1048 4.91112 16.1048C4.53132 16.1048 4.21812 15.8222 4.16772 15.4568Z"
                                                    fill="#200E32"
                                                />
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_288_2626"
                                                    x="-9.89797"
                                                    y="-8.9949"
                                                    width="39.5469"
                                                    height="37.7953"
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
                                                        result="effect1_backgroundBlur_288_2626"
                                                    />
                                                    <feBlend
                                                        mode="normal"
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_288_2626"
                                                        result="shape"
                                                    />
                                                </filter>
                                            </defs>
                                        </svg>
                                        {dict.bests}
                                    </Link>
                                    <Link
                                        href={`${getLinksLang(lang)}/notifications`}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <g>
                                                <g
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12 17.848c5.64 0 8.248-.724 8.5-3.627 0-2.902-1.819-2.716-1.819-6.276C18.681 5.165 16.045 2 12 2S5.319 5.164 5.319 7.945c0 3.56-1.819 3.374-1.819 6.276.253 2.914 2.862 3.627 8.5 3.627z"
                                                        clipRule="evenodd"
                                                    />
                                                    <path d="M14.389 20.857c-1.364 1.515-3.492 1.533-4.87 0" />
                                                </g>
                                            </g>
                                        </svg>
                                        {dict.notification}
                                    </Link>
                                    <Link
                                        href={`${dict.navMenuItems[1].href}`}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-file-pen-line"
                                        >
                                            <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                                            <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                                            <path d="M8 18h1" />
                                        </svg>
                                        {dict.navMenuItems[1].title}
                                    </Link>
                                    <div className="relative inline-block w-48">
                                        {/*<Link*/}
                                        {/*    className={cn(*/}
                                        {/*        buttonVariants({*/}
                                        {/*            variant: 'info',*/}
                                        {/*        }),*/}
                                        {/*        'w-full text-xl font-normal hover:no-underline'*/}
                                        {/*    )}*/}
                                        {/*    href="/invest"*/}
                                        {/*>*/}
                                        {/*    سرمایه گذاری آسان*/}
                                        {/*</Link>*/}
                                    </div>
                                    {process.env.NEXT_PUBLIC_ENVIRONMENT ===
                                        'BETA' && (
                                        <div className="relative inline-block w-48">
                                            <Dialog
                                                open={isOpen}
                                                onOpenChange={setIsOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <div className="relative flex">
                                                        <Badge className="absolute -right-1.5 top-1.5 h-4 w-fit rotate-45 border border-neutral-700 bg-white p-2 py-3 text-base text-neutral-700">
                                                            بزودی
                                                        </Badge>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                            }}
                                                            className="w-full text-xl font-normal hover:no-underline"
                                                            variant="info"
                                                        >
                                                            + {dict.publish}
                                                        </Button>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="w-full px-8 md:max-w-5xl">
                                                    <PublishSignal
                                                        setIsOpen={setIsOpen}
                                                        lang={lang}
                                                        dict={dict}
                                                        onEnd={() => {
                                                            setIsOpen(false);
                                                        }}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-start justify-center gap-8">
                                    <Link
                                        href="https://www.instagram.com/sahmeto_com"
                                        rel="nofollow"
                                    >
                                        <InstagramIcon strokeWidth={1.125} />
                                    </Link>
                                    <Link
                                        href="https://www.linkedin.com/company/sahmeto"
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
                                        href={`${getLinksLang(lang)}/about-us`}
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
                <SearchIcon
                    strokeWidth={1.125}
                    onClick={() => setOpenSuggestion((open) => !open)}
                />
            </div>
            <div className="flex items-center justify-center gap-5">
                <Link href={`${getLinksLang(lang)}/`}>
                    <Icons.logo className="h-7 w-24 cursor-pointer md:h-9 md:w-32" />
                </Link>
                <hr className="hidden h-6 w-px bg-neutral-100 md:flex ltr:ml-3 rtl:mr-3" />
                <div
                    className="hidden h-11 min-w-fit cursor-pointer items-center gap-1.5 rounded-full bg-gray-50 px-4 md:flex"
                    onClick={() => setOpenSuggestion((open) => !open)}
                >
                    <SearchIcon strokeWidth={1.125} />
                    <div className="flex h-full w-full min-w-[270px] max-w-[270px] items-center bg-transparent text-xs text-gray-700">
                        {dict.searchPlaceholder}
                    </div>
                </div>
                <Suggestion
                    dict={dict}
                    lang={lang}
                    open={openSuggestion}
                    setOpen={setOpenSuggestion}
                />
                <NavigationMenu
                    className="hidden md:block"
                    dir={getDirection(lang)}
                >
                    <NavigationMenuList>
                        <NavigationMenuItem className="hidden 2xl:block">
                            <Link
                                href={`${getLinksLang(lang)}/signals`}
                                className={navigationMenuTriggerStyle()}
                            >
                                {dict.productNav.signals}
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden 2xl:block">
                            <Link
                                href={`${getLinksLang(lang)}/leaderboard`}
                                legacyBehavior
                                passHref
                            >
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    {dict.productNav.bestTraders}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden 2xl:block">
                            <Link
                                href={`${getLinksLang(lang)}/feed`}
                                legacyBehavior
                                passHref
                            >
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    {dict.productNav.feeds}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="block 2xl:hidden">
                            <NavigationMenuTrigger>
                                {dict.products}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    <Link
                                        href={`${getLinksLang(lang)}/signals`}
                                        className={cn(
                                            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors'
                                        )}
                                    >
                                        <div className="text-sm font-medium leading-none">
                                            {dict.selectedIcons}
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug"></p>
                                    </Link>
                                    <ListItem title={dict.feed} href="/feed" />
                                    <ListItem
                                        title={dict.bestTraders}
                                        href={`${getLinksLang(lang)}/leaderboard`}
                                    />
                                    {/*<ListItem*/}
                                    {/*    href={`${getLinksLang(lang)}/invest`}*/}
                                    {/*>*/}
                                    {/*    <span className="text-sm font-medium ltr:mr-2 rtl:ml-2">*/}
                                    {/*        سرمایه گذاری آسان*/}
                                    {/*    </span>*/}
                                    {/*    <Badge size="ssm" rounded="md">*/}
                                    {/*        جدید*/}
                                    {/*    </Badge>*/}
                                    {/*</ListItem>*/}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                onClick={(event) => {
                                    event.preventDefault();
                                }}
                                className="font-medium"
                            >
                                {dict.more}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {dict.navMenuItems.map((navMenuItem) => (
                                        <ListItem
                                            key={navMenuItem.title}
                                            title={navMenuItem.title}
                                            href={navMenuItem.href}
                                            rel={navMenuItem.rel}
                                        >
                                            {navMenuItem.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden 2xl:block">
                            <Link
                                href={`${getLinksLang(lang)}/pricing`}
                                legacyBehavior
                                passHref
                            >
                                <NavigationMenuLink
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        'relative overflow-hidden'
                                    )}
                                >
                                    <span>{dict.buySubscription}</span>
                                    <div className="animationbgShimmer absolute top-0 flex h-full w-full" />
                                </NavigationMenuLink>
                            </Link>
                            {/*<Link*/}
                            {/*    href={`${getLinksLang(lang)}/invest`}*/}
                            {/*    className="hidden 2xl:block"*/}
                            {/*    legacyBehavior*/}
                            {/*    passHref*/}
                            {/*>*/}
                            {/*    <NavigationMenuLink*/}
                            {/*        className={cn(*/}
                            {/*            navigationMenuTriggerStyle(),*/}
                            {/*            'gap-1'*/}
                            {/*        )}*/}
                            {/*    >*/}
                            {/*        <span>سرمایه گذاری آسان</span>*/}
                            {/*        <Badge size="ssm" rounded="md">*/}
                            {/*            جدید*/}
                            {/*        </Badge>*/}
                            {/*    </NavigationMenuLink>*/}
                            {/*</Link>*/}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex justify-end md:hidden">
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
                                    fill="#200E32"
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
                        href={`${getLinksLang(lang)}/user/login?url=${path}`}
                        legacyBehavior
                        passHref
                    >
                        <a className="flex items-center rounded-md bg-neutral-300 px-3 py-2 font-medium">
                            {dict.loginRegister}
                        </a>
                    </Link>
                )}
            </div>
            <div className="hidden items-center gap-5 md:flex">
                {isUserLoading ? (
                    <>
                        {process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && (
                            <Skeleton className="h-12 w-[145px]" />
                        )}
                        <Skeleton className="h-12 w-12" />
                        <Skeleton className="h-12 w-12" />
                    </>
                ) : (
                    <>
                        {process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' &&
                            !isMobileOnly && (
                                <>
                                    <div className="relative inline-block">
                                        <Dialog
                                            open={isOpen}
                                            onOpenChange={setIsOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <div className="relative flex">
                                                    <Badge className="absolute -right-1.5 top-1.5 h-4 w-fit rotate-45 bg-neutral-300 p-2 py-3 text-base text-neutral-800">
                                                        بزودی
                                                    </Badge>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                        variant="default"
                                                        className="h-12 w-[145px]"
                                                    >
                                                        {dict.publish}
                                                    </Button>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="w-full md:max-w-5xl">
                                                <PublishSignal
                                                    setIsOpen={setIsOpen}
                                                    lang={lang}
                                                    dict={dict}
                                                    onEnd={() => {
                                                        setIsOpen(false);
                                                    }}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </>
                            )}
                        {user ? (
                            <>
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
                                                fill="#200E32"
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
                                {/*<Link*/}
                                {/*    href={`${getLinksLang(lang)}/profile`}*/}
                                {/*    className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-50"*/}
                                {/*>*/}
                                {/*</Link>*/}
                                {/*<HoverCard openDelay={100} closeDelay={100}>*/}
                                {/*    <HoverCardTrigger asChild>*/}
                                <Link
                                    href={`${getLinksLang(lang)}/notifications`}
                                    className="relative flex h-12 w-12 items-center justify-center rounded-md bg-neutral-50"
                                >
                                    {user.unread_message_count > 0 && (
                                        <Badge
                                            className="absolute -right-2.5 -top-2 flex h-5 min-h-5 w-5 items-center justify-center p-0"
                                            variant="destructive"
                                        >
                                            {user.unread_message_count}
                                        </Badge>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <g>
                                            <g
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 17.848c5.64 0 8.248-.724 8.5-3.627 0-2.902-1.819-2.716-1.819-6.276C18.681 5.165 16.045 2 12 2S5.319 5.164 5.319 7.945c0 3.56-1.819 3.374-1.819 6.276.253 2.914 2.862 3.627 8.5 3.627z"
                                                    clipRule="evenodd"
                                                />
                                                <path d="M14.389 20.857c-1.364 1.515-3.492 1.533-4.87 0" />
                                            </g>
                                        </g>
                                    </svg>
                                </Link>
                                {/*    </HoverCardTrigger>*/}
                                {/*    <HoverCardContent className="bg-white">*/}
                                {/*        <div>*/}
                                {/*            <h4>هشدار ها</h4>*/}
                                {/*            <p>*/}
                                {/*                شما {user.unread_message_count}{' '}*/}
                                {/*                پیام خوانده نشده دارید.*/}
                                {/*            </p>*/}
                                {/*        </div>*/}
                                {/*        <div className="grid gap-4">*/}
                                {/*            <div>*/}
                                {/*                {notifications*/}
                                {/*                    .slice(0, 3)*/}
                                {/*                    .map(*/}
                                {/*                        (*/}
                                {/*                            notification,*/}
                                {/*                            index*/}
                                {/*                        ) => (*/}
                                {/*                            <div*/}
                                {/*                                key={index}*/}
                                {/*                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"*/}
                                {/*                            >*/}
                                {/*                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />*/}
                                {/*                                <div className="space-y-1">*/}
                                {/*                                    <p className="text-sm font-medium leading-none">*/}
                                {/*                                        {*/}
                                {/*                                            notification.title*/}
                                {/*                                        }*/}
                                {/*                                    </p>*/}
                                {/*                                    <p className="text-muted-foreground text-sm">*/}
                                {/*                                        {*/}
                                {/*                                            notification.description*/}
                                {/*                                        }*/}
                                {/*                                    </p>*/}
                                {/*                                </div>*/}
                                {/*                            </div>*/}
                                {/*                        )*/}
                                {/*                    )}*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*        <Button className="w-full">*/}
                                {/*            <Check className="mr-2 h-4 w-4" />{' '}*/}
                                {/*            Mark all as read*/}
                                {/*        </Button>*/}
                                {/*    </HoverCardContent>*/}
                                {/*</HoverCard>*/}
                            </>
                        ) : (
                            <Link
                                href={`${getLinksLang(lang)}/user/login?url=${path}`}
                                className="flex h-12 items-center justify-center rounded-md border border-transparent bg-neutral-800 px-10 font-medium text-white"
                            >
                                {dict.loginRegister}
                            </Link>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
