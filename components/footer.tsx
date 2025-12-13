'use client';

import Image from 'next/image';
import { cn, getLinksLang } from '@/libs/utils';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import * as React from 'react';
import { Fragment, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    InstagramLogoIcon,
    LinkedInLogoIcon,
    TwitterLogoIcon,
} from '@radix-ui/react-icons';

export function Footer({ dict, lang }) {
    const { breadcrumbTitle } = useGlobalContext();
    const paths = usePathname();
    const router = useRouter();
    const pathNames = paths.split('/').filter((path) => path);
    const { user } = useGlobalContext();
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const accountFormSchema = z.object({
        ID: z
            .string({
                required_error: 'تلفن همراه نمی تواند خالی باشد.',
            })
            .regex(/(^0?9[0-9]{9}$)|(^\u06F0\u06F9[\u06F0-\u06F9]{9})$/, {
                message: 'تلفن همراه وارد شده صحیح نیست.',
            }),
    });
    type AccountFormValues = z.infer<typeof accountFormSchema>;
    const defaultValues: Partial<AccountFormValues> = {};
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    });

    const BreadcrumbComponent = () => {
        return (
            <Breadcrumb>
                <BreadcrumbList className="gap-1">
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href="/"
                            className="text-xs font-medium capitalize"
                        >
                            {dict.appName}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {pathNames?.length !== 0 && <BreadcrumbSeparator />}
                    {pathNames?.slice(0, 2).map((item, index, array) => {
                        const breadcrumbTitles = {
                            notifications: 'notifications',
                            about: 'about',
                            receipt: 'receipt',
                            contact: 'contact',
                            privacy: 'privacy',
                            profile: 'profile',
                        };
                        const isLast = index === array.length - 1;
                        const href =
                            item === 'coins' || item === 'ticker'
                                ? '/signals'
                                : item === 'publisher'
                                    ? '/leaderboard'
                                    : '/' +
                                    pathNames.slice(0, index + 1).join('/');
                        const title =
                            breadcrumbTitles[item] || breadcrumbTitle || item;

                        return (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <span className="text-xs font-medium capitalize">
                                            {title}
                                        </span>
                                    ) : (
                                        <BreadcrumbLink
                                            href={href}
                                            className="text-xs font-medium capitalize"
                                        >
                                            {title}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        );
    };

    return (
        <footer>
            <div className="hidden md:block">
                <div className="rounded-tl-lg rounded-tr-lg bg-gray-50 pb-14 pt-8">
                    <div className="mx-auto flex max-w-[1525px] flex-col gap-10 px-14">
                        <BreadcrumbComponent />
                        <div className="flex justify-between">
                            <Link
                                className="flex items-center gap-2.5 text-lg font-black text-navy-900"
                                href={`${getLinksLang(lang)}/`}
                            >
                                <Icons.logo />
                                {dict.appName}
                            </Link>
                            <div
                                dir="ltr"
                                className="flex flex-col gap-4 text-sm font-medium"
                            >
                                <a href="/contact">{dict.footer.contactUs}</a>
                                <a
                                    href="tel:+9821-91304925"
                                    dir="ltr"
                                    className="flex items-center gap-2.5"
                                >
                                    <Phone
                                        strokeWidth={0.5}
                                        fill="#FFBE00"
                                        className="text-[rgba(0,_0,_0,_.4)] drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.1)]"
                                    />
                                    <div className="text-base">
                                        {dict.footer.phone}
                                    </div>
                                </a>
                                <a
                                    href="mailto:info@talanow.ir"
                                    dir="ltr"
                                    className="flex items-center gap-2.5"
                                >
                                    <Mail
                                        strokeWidth={0.5}
                                        fill="#FFBE00"
                                        className="text-[rgba(0,_0,_0,_.4)] drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.1)]"
                                    />
                                    <div>{dict.footer.email}</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="-mt-6 rounded-tl-lg rounded-tr-lg bg-gray-100 pb-14 pt-8">
                    <div
                        className="grid w-full grid-cols-3 place-items-center gap-3 sm:p-4 md:mx-auto md:max-w-4xl lg:grid-cols-6 lg:p-0">
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/zarinpal.png"
                                width={96}
                                height={96}
                                alt="zarinpal"
                            />
                        </div>
                        {/* <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/science.png"
                                alt="science park"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <a
                                href="https://sahmeto.com/daneshbonyan.pdf"
                                download
                            >
                                <Image
                                    className="h-full w-full object-contain"
                                    src="/img/danesh.png"
                                    alt="danesh bonyan"
                                    width={96}
                                    height={96}
                                />
                            </a>
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/senf.png"
                                alt="senf"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <a
                                target="_blank"
                                href="https://www.irannsr.org/"
                                rel="nofollow"
                            >
                                <Image
                                    className="h-full w-full object-contain"
                                    src="/img/nezam-senfi-logo.png"
                                    alt="nezam-senfi-logo"
                                    width={96}
                                    height={96}
                                    referrerPolicy="origin"
                                />
                            </a>
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                id="rgvjnbqeesgtrgvjwlaofukz"
                                alt="logo-samandehi"
                                src="/img/samandehi.png"
                                width={96}
                                height={96}
                                referrerPolicy="origin"
                            />
                        </div> */}
                    </div>
                </div>
                <div className="-mt-6 space-y-6 rounded-tl-lg rounded-tr-lg bg-navy-900 pb-0 pt-8">
                    {/*<div className="flex flex-col items-center gap-6">*/}
                    {/*    <div className="flex items-center gap-10">*/}
                    {/*        <a href="https://t.me/sahmetocom" target="_blank">*/}
                    {/*            <svg*/}
                    {/*                xmlns="http://www.w3.org/2000/svg"*/}
                    {/*                width="20"*/}
                    {/*                height="20"*/}
                    {/*                fill="none"*/}
                    {/*                viewBox="0 0 625 518"*/}
                    {/*            >*/}
                    {/*                <path*/}
                    {/*                    fill="#fff"*/}
                    {/*                    fillRule="evenodd"*/}
                    {/*                    d="M43.277 222.931c167.624-73.031 279.4-121.178 335.327-144.44C538.288 12.073 571.469.535 593.096.154c4.756-.083 15.392 1.095 22.281 6.686 5.817 4.72 7.418 11.096 8.184 15.571.765 4.476 1.719 14.67.961 22.636-8.653 90.921-46.096 311.563-65.145 413.396-8.06 43.089-23.931 57.537-39.296 58.951-33.391 3.073-58.747-22.067-91.088-43.267-50.607-33.174-79.197-53.825-128.321-86.197-56.77-37.411-19.968-57.972 12.385-91.576 8.467-8.794 155.59-142.614 158.438-154.753.356-1.518.686-7.178-2.676-10.166-3.362-2.988-8.324-1.967-11.905-1.154-5.076 1.152-85.922 54.588-242.538 160.309-22.948 15.758-43.734 23.435-62.357 23.033-20.53-.443-60.023-11.608-89.381-21.151C26.628 280.766-1.992 274.578.5 254.699c1.298-10.355 15.557-20.944 42.776-31.768z"*/}
                    {/*                    clipRule="evenodd"*/}
                    {/*                ></path>*/}
                    {/*            </svg>*/}
                    {/*        </a>*/}
                    {/*        <a href="https://www.linkedin.com/company/sahmeto">*/}
                    {/*            <LinkedInLogoIcon className="h-6 w-6 text-white" />*/}
                    {/*        </a>*/}
                    {/*        <a href="https://twitter.com/Sahmetocom">*/}
                    {/*            <TwitterLogoIcon className="h-6 w-6 text-white" />*/}
                    {/*        </a>*/}
                    {/*    </div>*/}
                    {/*    <a*/}
                    {/*        href="https://www.instagram.com/sahmeto_com"*/}
                    {/*        className="bg-instagram flex gap-5 rounded-2xl px-7 py-5 text-base font-semibold text-white"*/}
                    {/*    >*/}
                    {/*        <span>اینستاگرام طلانو</span>*/}
                    {/*        <InstagramLogoIcon className="h-6 w-6 text-white" />*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                    <div className="mx-auto px-24 w-3/4 text-white">
                        {lang === 'fa' && (
                            <p className="max-w-9/10 mx-auto text-justify">
                                {dict.footer.description}
                            </p>
                        )}
                        <p className="shadow-4xl mt-4 rounded-tl-lg rounded-tr-lg bg-navy-800 px-8 py-4 text-center text-sm text-white">
                            {dict.copyright}
                        </p>
                    </div>
                </div>
            </div>
            {/*mobile footer*/}
            <div className="shadow-4xl rounded-tl-lg rounded-tr-lg bg-gray-50 md:hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="flex flex-col gap-6 md:gap-2">
                        <BreadcrumbComponent />
                        <Link
                            className="flex items-center gap-2.5 text-lg font-black text-navy-900"
                            href={`${getLinksLang(lang)}/`}
                        >
                            <Icons.logo />
                            {dict.appName}
                        </Link>
                    </div>
                    <div
                        dir="ltr"
                        className="flex flex-col gap-4 text-sm font-medium"
                    >
                        <a href="/contact">{dict.footer.contactUs}</a>
                        <a
                            href="tel:+9821-91304925"
                            dir="ltr"
                            className="flex items-center gap-2.5"
                        >
                            <Phone
                                strokeWidth={0.5}
                                fill="#FFBE00"
                                className="text-[rgba(0,_0,_0,_.4)] drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.1)]"
                            />
                            <div className="text-base">{dict.footer.phone}</div>
                        </a>
                        <a
                            href="mailto:info@talanow.ir"
                            dir="ltr"
                            className="flex items-center gap-2.5"
                        >
                            <Mail
                                strokeWidth={0.5}
                                fill="#FFBE00"
                                className="text-[rgba(0,_0,_0,_.4)] drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.1)]"
                            />
                            <div>info@talanow.ir</div>
                        </a>
                    </div>
                </div>
                <div className="mt-12 px-8">
                    <div
                        className="grid w-full grid-cols-3 place-items-center gap-3 sm:p-4 md:mx-auto md:max-w-4xl lg:grid-cols-6 lg:p-0">
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/zarinpal.png"
                                alt="zarinpal"
                                width={96}
                                height={96}
                            />
                        </div>
                        {/* <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/science.png"
                                alt="science park"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <a
                                href="https://sahmeto.com/daneshbonyan.pdf"
                                download=""
                            >
                                <Image
                                    className="h-full w-full object-contain"
                                    src="/img/danesh.png"
                                    alt="danesh bonyan"
                                    width={96}
                                    height={96}
                                />
                            </a>
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/senf.png"
                                alt="senf"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <a
                                target="_blank"
                                href="https://www.irannsr.org/"
                                rel="nofollow"
                            >
                                <Image
                                    className="h-full w-full cursor-pointer object-contain"
                                    referrerPolicy="origin"
                                    src="/img/nezam-senfi-logo.png"
                                    alt="nezam-senfi-logo"
                                    width={96}
                                    height={96}
                                />
                            </a>
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full cursor-pointer object-contain"
                                referrerPolicy="origin"
                                id="rgvjnbqeesgtrgvjwlaofukz"
                                alt="logo-samandehi"
                                src="/img/samandehi.png"
                                width={96}
                                height={96}
                            />
                        </div> */}
                    </div>
                </div>
                {/*<div className="px-8 py-2 text-neutral-700">*/}
                {/*    <div className="mt-8">*/}
                {/*        <div className="text-lg font-bold">{dict.products}</div>*/}
                {/*        <ul className="flex flex-wrap items-center justify-between gap-x-3 text-sm leading-loose">*/}
                {/*            <li>*/}
                {/*                <Link href={`${getLinksLang(lang)}/signals`}>*/}
                {/*                    {dict.selectedIcons}*/}
                {/*                </Link>*/}
                {/*            </li>*/}
                {/*            <li>*/}
                {/*                <Link href={`${getLinksLang(lang)}/`}>*/}
                {/*                    {dict.feed}*/}
                {/*                </Link>*/}
                {/*            </li>*/}
                {/*            <li>*/}
                {/*                <Link*/}
                {/*                    href={`${getLinksLang(lang)}/leaderboard`}*/}
                {/*                >*/}
                {/*                    {dict.bestTraders}*/}
                {/*                </Link>*/}
                {/*            </li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*    <div className="mt-8">*/}
                {/*        <div className="text-lg font-bold">*/}
                {/*            {dict.sahmetoWorld}*/}
                {/*        </div>*/}
                {/*        <ul className="flex flex-wrap items-center justify-between gap-x-3 text-sm leading-loose [&>li]:min-w-20">*/}
                {/*            <li className="relative">*/}
                {/*                <a href="https://shmto.ir/9vg" target="_blank">*/}
                {/*                    {dict.reportProblem}*/}
                {/*                </a>*/}
                {/*            </li>*/}
                {/*            <li>*/}
                {/*                <a href="https://dev.sahmeto.com">*/}
                {/*                    {dict.developWithSahmeto}*/}
                {/*                </a>*/}
                {/*            </li>*/}
                {/*            <li>*/}
                {/*                <Link href={`${getLinksLang(lang)}/privacy`}>*/}
                {/*                    {dict.rules}*/}
                {/*                </Link>*/}
                {/*            </li>*/}
                {/*            <li>*/}
                {/*                <Link*/}
                {/*                    href={`${getLinksLang(lang)}/organization`}*/}
                {/*                >*/}
                {/*                    {dict.organizationalSolution}*/}
                {/*                </Link>*/}
                {/*            </li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="mt-3 flex w-full flex-col justify-center gap-2 rounded-t-xl bg-navy-900 pt-8">
                    {/*<div className="flex flex-col items-center gap-6">*/}
                    {/*    <a*/}
                    {/*        href="https://www.instagram.com/sahmeto_com"*/}
                    {/*        className="bg-instagram flex gap-5 rounded-2xl px-7 py-5 text-base font-semibold text-white "*/}
                    {/*    >*/}
                    {/*        <span>اینستاگرام طلانو</span>*/}
                    {/*        <InstagramLogoIcon className="h-6 w-6 text-white" />*/}
                    {/*    </a>*/}
                    {/*    <div className="flex items-center gap-10">*/}
                    {/*        <a href="https://t.me/sahmetocom" target="_blank">*/}
                    {/*            <svg*/}
                    {/*                xmlns="http://www.w3.org/2000/svg"*/}
                    {/*                width="20"*/}
                    {/*                height="20"*/}
                    {/*                fill="none"*/}
                    {/*                viewBox="0 0 625 518"*/}
                    {/*            >*/}
                    {/*                <path*/}
                    {/*                    fill="#fff"*/}
                    {/*                    fillRule="evenodd"*/}
                    {/*                    d="M43.277 222.931c167.624-73.031 279.4-121.178 335.327-144.44C538.288 12.073 571.469.535 593.096.154c4.756-.083 15.392 1.095 22.281 6.686 5.817 4.72 7.418 11.096 8.184 15.571.765 4.476 1.719 14.67.961 22.636-8.653 90.921-46.096 311.563-65.145 413.396-8.06 43.089-23.931 57.537-39.296 58.951-33.391 3.073-58.747-22.067-91.088-43.267-50.607-33.174-79.197-53.825-128.321-86.197-56.77-37.411-19.968-57.972 12.385-91.576 8.467-8.794 155.59-142.614 158.438-154.753.356-1.518.686-7.178-2.676-10.166-3.362-2.988-8.324-1.967-11.905-1.154-5.076 1.152-85.922 54.588-242.538 160.309-22.948 15.758-43.734 23.435-62.357 23.033-20.53-.443-60.023-11.608-89.381-21.151C26.628 280.766-1.992 274.578.5 254.699c1.298-10.355 15.557-20.944 42.776-31.768z"*/}
                    {/*                    clipRule="evenodd"*/}
                    {/*                ></path>*/}
                    {/*            </svg>*/}
                    {/*        </a>*/}
                    {/*        <a href="https://www.linkedin.com/company/sahmeto">*/}
                    {/*            <LinkedInLogoIcon className="h-6 w-6 text-white" />*/}
                    {/*        </a>*/}
                    {/*        <a href="https://twitter.com/Sahmetocom">*/}
                    {/*            <TwitterLogoIcon className="h-6 w-6 text-white" />*/}
                    {/*        </a>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className=" mx-auto my-8 h-[1px] w-[90%] bg-neutral-50" />*/}
                    <div className="flex items-center justify-evenly bg-transparent">
                        <a className="text-base text-white" href="/about">
                            {dict.footer.aboutUs}
                        </a>
                        <a
                            className="text-base text-white"
                            href="/contact"
                        >
                            {dict.footer.contactUs}
                        </a>
                        <a className="text-base text-white" href="/privacy">
                            {dict.footer.rules}
                        </a>
                    </div>
                    <p className="shadow-6xl mt-10 rounded-tl-lg rounded-tr-lg bg-navy-800 px-8 py-4 text-center text-sm text-white">
                        {dict.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
