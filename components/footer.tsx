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
import { ArrowLeft, Mail, Phone, ShoppingCart } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
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
                            سهمتو
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {pathNames.length !== 0 && <BreadcrumbSeparator />}
                    {pathNames.slice(0, 2).map((item, index, array) => {
                        const breadcrumbTitles = {
                            leaderboard: 'برترین تریدر‌ها',
                            finocaht: 'ربات سهمتو',
                            'copy-trade': 'کپی ترید',
                            coins: 'ارزدیجیتال',
                            ticker: 'بورس',
                            signals: 'سیگنال‌ها',
                            feed: 'دنبال شده‌ها',
                            search: 'جستجو',
                            notifications: 'هشدار‌ها',
                            pricing: 'خرید اشتراک',
                            'about-us': 'درباره‌ما',
                            receipt: 'رسید',
                            contact: 'تماس‌با‌ما',
                            privacy: 'قوانین',
                            organization: 'راهکار سازمانی',
                            changelog: 'تغییرات',
                            profile: 'حساب کاربری',
                            publisher: 'تریدر',
                            swap: 'خرید آسان',
                            wallet: 'کیف پول',
                            invest: 'خرید آسان',
                            copytrade: 'کپی ترید',
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
                <div className="rounded-tl-lg rounded-tr-lg bg-neutral-100 pb-14 pt-8">
                    <div className="mx-auto flex max-w-[1525px] flex-col gap-10 px-14">
                        <BreadcrumbComponent />
                        <div className="flex justify-between">
                            <svg
                                version="1.1"
                                id="Layer_3"
                                x="0px"
                                y="0px"
                                viewBox="0 0 643.2 189.33"
                                xmlSpace="preserve"
                                style={{ width: '145px', height: '45px' }}
                            >
                                <style
                                    type="text/css"
                                    dangerouslySetInnerHTML={{
                                        __html: '\n\t.st0_invert{fill:#10EDC5;}\n\t.st1_invert{fill:#0C0E3C;}\n',
                                    }}
                                />
                                <g>
                                    <g>
                                        <rect
                                            x="324.03"
                                            y="45.09"
                                            className="st0_invert"
                                            width="73.95"
                                            height={18}
                                        />
                                    </g>
                                    <rect
                                        x="473.73"
                                        y="155.38"
                                        className="st0_invert"
                                        width="86.4"
                                        height="10.74"
                                    />
                                    <rect
                                        y="0.05"
                                        className="st0_invert"
                                        width={189}
                                        height={189}
                                    />
                                    <polygon
                                        className="st1_invert"
                                        points="137.59,57.72 94.67,100.64 28.88,100.64 28.88,132.17 107.73,132.17 159.88,80.01 	"
                                    />
                                    <g>
                                        <rect
                                            x="306.7"
                                            y="10.82"
                                            className="st1_invert"
                                            width="46.89"
                                            height={18}
                                        />
                                        <path
                                            className="st1_invert"
                                            d="M258,45.09h-0.9c-7.47,0-13.54-6.08-13.54-13.54c0-7.47,6.08-13.54,13.54-13.54h13.54v16.25h18V0H257.1
			c-17.39,0-31.54,14.15-31.54,31.54s14.15,31.54,31.54,31.54h0.9h12.64v35.09h18V63.08h43.31v-18h-52.3L258,45.09L258,45.09z"
                                        />
                                        <path
                                            className="st1_invert"
                                            d="M630.48,20.48l-24.5,24.5h-81.66c-12.29,0-23.85,4.78-32.55,13.45l-14.16,14.11l-27.58-27.45h-13.49V26.14
			c0-10.71-6.15-19.92-16.05-24.02c-9.9-4.1-20.75-1.94-28.33,5.63l-25.93,25.93v64.49h18V41.13l20.65-20.65
			c3.51-3.51,7.56-2.21,8.71-1.73c1.16,0.48,4.94,2.43,4.94,7.39v18.95h-22.76v18h46.82l22.26,22.16l-12.87,12.83l12.71,12.75
			l39.78-39.64c5.31-5.29,12.35-8.2,19.84-8.2h89.11l29.78-29.78L630.48,20.48z"
                                        />
                                    </g>
                                    <g>
                                        <path
                                            className="st1_invert"
                                            d="M251.91,155.54c-9.49-2.43-11.84-3.61-11.84-7.21v-0.16c0-2.67,2.43-4.78,7.06-4.78s9.41,2.04,14.27,5.41
			l6.27-9.09c-5.57-4.47-12.39-6.98-20.38-6.98c-11.21,0-19.21,6.59-19.21,16.54v0.16c0,10.9,7.13,13.95,18.19,16.78
			c9.17,2.35,11.05,3.92,11.05,6.98v0.16c0,3.21-2.98,5.17-7.92,5.17c-6.27,0-11.45-2.59-16.38-6.66l-7.13,8.55
			c6.59,5.88,14.97,8.78,23.28,8.78c11.84,0,20.15-6.11,20.15-17.01v-0.16C269.31,162.44,263.04,158.44,251.91,155.54z"
                                        />
                                        <polygon
                                            className="st1_invert"
                                            points="297.46,133.12 273.94,188.39 286.25,188.39 302.87,147.62 310.16,165.42 302.14,165.42
			297.83,176.08 314.47,176.08 319.49,188.39 332.11,188.39 308.59,133.12 		"
                                        />
                                        <polygon
                                            className="st1_invert"
                                            points="427.59,156.71 413.17,133.51 400.16,133.51 400.16,188.39 411.99,188.39 411.99,152.8 427.28,176
			427.59,176 443.04,152.56 443.04,188.39 455.03,188.39 455.03,133.51 442.02,133.51 		"
                                        />
                                        <polygon
                                            className="st1_invert"
                                            points="534.94,144.64 551.64,144.64 551.64,188.39 563.71,188.39 563.71,144.64 580.41,144.64
			580.41,133.51 534.94,133.51 		"
                                        />
                                        <path
                                            className="st1_invert"
                                            d="M614.12,132.57c-16.93,0-29.24,12.78-29.24,28.38v0.16c0,15.6,12.15,28.22,29.08,28.22
			c16.93,0,29.24-12.78,29.24-28.38v-0.16C643.21,145.19,631.06,132.57,614.12,132.57z M630.58,161.11
			c0,9.41-6.74,17.09-16.46,17.09c-9.72,0-16.62-7.84-16.62-17.25v-0.16c0-9.41,6.74-17.09,16.46-17.09s16.62,7.84,16.62,17.25
			V161.11z"
                                        />
                                        <polygon
                                            className="st1_invert"
                                            points="480.2,144.25 509.6,144.25 509.6,133.51 468.2,133.51 468.2,188.39 509.99,188.39 509.99,177.65
			480.2,177.65 		"
                                        />
                                        <rect
                                            x="488.25"
                                            y="155.38"
                                            className="st1_invert"
                                            width="17.81"
                                            height="10.74"
                                        />
                                        <polygon
                                            className="st1_invert"
                                            points="374.91,155.23 352.65,155.23 352.65,133.51 340.58,133.51 340.58,188.39 352.65,188.39
			352.65,166.36 374.91,166.36 374.91,188.39 386.99,188.39 386.99,133.51 374.91,133.51 		"
                                        />
                                    </g>
                                </g>
                            </svg>
                            <div className="invisible flex flex-col gap-6">
                                <div>
                                    <strong>نسل جدید</strong> اپ ویندوز
                                </div>
                                <a
                                    dir="ltr"
                                    className={cn(
                                        buttonVariants({
                                            variant: 'secondary',
                                        }),
                                        'flex justify-between gap-4 border border-neutral-800 px-4 shadow-[0px_0px_50px_10px_rgba(16,_237,_197,_.8)]'
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-download"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" x2="12" y1="15" y2="3" />
                                    </svg>
                                    <div className="text-base">نصب سریع</div>
                                </a>
                            </div>
                            <div
                                dir="ltr"
                                className="flex flex-col gap-4 text-sm font-medium"
                            >
                                <a href="/contact">تماس با ما</a>
                                <a
                                    href="tel:+9821-91304925"
                                    dir="ltr"
                                    className="flex items-center gap-2.5"
                                >
                                    <Phone
                                        strokeWidth={0.5}
                                        fill="#10EDC5"
                                        className="text-neutral-300 drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.6)]"
                                    />
                                    <div className="text-base">
                                        ۰۲۱-۹۱۳۰۴۹۲۵
                                    </div>
                                </a>
                                <a
                                    href="mailto:info@sahmeto.com"
                                    dir="ltr"
                                    className="flex items-center gap-2.5"
                                >
                                    <Mail
                                        strokeWidth={0.5}
                                        fill="#10EDC5"
                                        className="text-[rgba(0,_0,_0,_.4)] drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.1)]"
                                    />
                                    <div>info@sahmeto.com</div>
                                </a>
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-neutral-200" />
                        <div className="flex justify-between">
                            <div className="flex w-full justify-between gap-20">
                                <div>
                                    <div className="mb-6 text-xl font-bold text-neutral-800">
                                        {dict.products}
                                    </div>
                                    <ul className="flex flex-col flex-wrap items-start justify-between gap-5 text-base">
                                        <li>
                                            <Link
                                                href={`${getLinksLang(lang)}/signals`}
                                                className="text-neutral-800"
                                            >
                                                {dict.productNav.signals}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={`${getLinksLang(lang)}/feed`}
                                                className="text-neutral-800"
                                            >
                                                {dict.productNav.feeds}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={`${getLinksLang(lang)}/leaderboard`}
                                                className="text-neutral-800"
                                            >
                                                {dict.productNav.bestTraders}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="mb-6 text-xl font-bold text-neutral-800">
                                        {dict.sahmetoWorld}
                                    </div>
                                    <ul className="flex flex-col flex-wrap !items-start !justify-between gap-5 text-base">
                                        <li>
                                            <a
                                                href="https://shmto.ir/9vg"
                                                target="_blank"
                                                className="!text-neutral-800"
                                            >
                                                {dict.reportProblem}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://dev.sahmeto.com"
                                                className="!text-neutral-800"
                                            >
                                                {dict.developWithSahmeto}
                                            </a>
                                        </li>
                                        <li>
                                            <Link
                                                href={`${getLinksLang(lang)}/organization`}
                                                className="!text-neutral-800"
                                            >
                                                {dict.organizationalSolution}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={`${getLinksLang(lang)}/privacy`}
                                                className="!text-neutral-800"
                                            >
                                                {dict.rules}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                {!user ? (
                                    <div className="grid w-[450px] gap-6">
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(
                                                    (data) => {
                                                        router.push(
                                                            `/user/login?phone=${data.ID}`
                                                        );
                                                    }
                                                )}
                                                className="space-y-3"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="ID"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label className="mb-4 flex justify-between gap-1.5 px-2 text-base font-bold">
                                                                <div className="text-xl font-black">
                                                                    ثبت نام سریع
                                                                </div>
                                                                <div className="text-base">
                                                                    بعد از ثبت
                                                                    نام هدیه
                                                                    <b>
                                                                        {' '}
                                                                        ۷ روز
                                                                        رایگان{' '}
                                                                    </b>
                                                                    فعال میشود.
                                                                </div>
                                                            </Label>
                                                            <FormControl>
                                                                <div className="flex max-w-4xl gap-8 rounded-full border-[1px] border-neutral-200 bg-white px-2 py-3">
                                                                    <Input
                                                                        dir="rtl"
                                                                        className="w-full border-none bg-transparent p-0 px-6 tracking-wider placeholder:text-right focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                        placeholder="شماره تلفن همراه"
                                                                        type="tel"
                                                                        autoComplete="username"
                                                                        {...field}
                                                                    />
                                                                    <Button
                                                                        className="h-10 w-64 rounded-full bg-neutral-800 text-base font-black text-neutral-300"
                                                                        type="submit"
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                    >
                                                                        {isLoading && (
                                                                            <Icons.spinner className="h-5 w-5 animate-spin" />
                                                                        )}
                                                                        ثبت نام
                                                                    </Button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </form>
                                        </Form>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div>
                                            برای استفاده از تمامی امکانات سهمتو
                                            می‌توانید اشتراک تهیه نمایید.
                                        </div>
                                        <a
                                            href="/pricing"
                                            className={cn(
                                                buttonVariants({
                                                    variant: 'default',
                                                    rounded: 'pill',
                                                }),
                                                'w-48 font-semibold text-neutral-300'
                                            )}
                                        >
                                            تمدید اشتراک سهمتو
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="-mt-6 rounded-tl-lg rounded-tr-lg bg-neutral-200 pb-14 pt-8">
                    <div className="grid w-full grid-cols-3 place-items-center gap-3 sm:p-4 md:mx-auto md:max-w-4xl lg:grid-cols-6 lg:p-0">
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/zarinpal.png"
                                width={96}
                                height={96}
                                alt="zarinpal"
                            />
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
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
                        </div>
                    </div>
                </div>
                <div className="-mt-6 space-y-6 rounded-tl-lg rounded-tr-lg bg-neutral-800 pb-0 pt-8">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-10">
                            <a href="https://t.me/sahmetocom" target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 625 518"
                                >
                                    <path
                                        fill="#fff"
                                        fillRule="evenodd"
                                        d="M43.277 222.931c167.624-73.031 279.4-121.178 335.327-144.44C538.288 12.073 571.469.535 593.096.154c4.756-.083 15.392 1.095 22.281 6.686 5.817 4.72 7.418 11.096 8.184 15.571.765 4.476 1.719 14.67.961 22.636-8.653 90.921-46.096 311.563-65.145 413.396-8.06 43.089-23.931 57.537-39.296 58.951-33.391 3.073-58.747-22.067-91.088-43.267-50.607-33.174-79.197-53.825-128.321-86.197-56.77-37.411-19.968-57.972 12.385-91.576 8.467-8.794 155.59-142.614 158.438-154.753.356-1.518.686-7.178-2.676-10.166-3.362-2.988-8.324-1.967-11.905-1.154-5.076 1.152-85.922 54.588-242.538 160.309-22.948 15.758-43.734 23.435-62.357 23.033-20.53-.443-60.023-11.608-89.381-21.151C26.628 280.766-1.992 274.578.5 254.699c1.298-10.355 15.557-20.944 42.776-31.768z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/sahmeto">
                                <LinkedInLogoIcon className="h-6 w-6 text-white" />
                            </a>
                            <a href="https://twitter.com/Sahmetocom">
                                <TwitterLogoIcon className="h-6 w-6 text-white" />
                            </a>
                        </div>
                        <a
                            href="https://www.instagram.com/sahmeto_com"
                            className="bg-instagram flex gap-5 rounded-2xl px-7 py-5 text-base font-semibold text-white "
                        >
                            <span>اینستاگرام سهمتو</span>
                            <InstagramLogoIcon className="h-6 w-6 text-white" />
                        </a>
                    </div>
                    <div className="mx-auto w-3/4 text-white">
                        {lang === 'fa' && (
                            <p className="max-w-9/10 mx-auto text-justify">
                                <Link href={`${getLinksLang(lang)}/`}>
                                    سامانه هوشمند سهمتو
                                </Link>{' '}
                                پیام‌های تمام کانال‌های بورسی تلگرام را جمع‌آوری
                                می‌کند و با استفاده از هوش مصنوعی سیگنال‌های
                                خرید و فروش هر کانال شناسایی و بازدهی سبد سهامی
                                معرفی شده توسط هر کانال را محاسبه می‌کند و بر
                                اساس پارامترهایی مثل بازدهی ماهانه سبد پیشنهادی
                                کانال، قدرت تحلیلگر و میزان ریسکی که تحلیلگر
                                برای سیگنال‌های خود ارائه می‌کند، آن‌ها را
                                رتبه‌بندی می‌کند. سهم‌های معرفی شده توسط سهمتو
                                معمولا در کوتاه مدت سود مناسبی را به سرمایه‌گذار
                                می‌رساند اما سهمتو هیچگونه مسئولیتی درمورد نماد
                                های معرفی شده ندارد چرا که این سهم‌ها بر اساس
                                اطلاعات برامده از شبکه اجتماعی معرفی می‌شود و
                                سهمتو هیچ داده‌ای به محتوای شبکه اجتماعی اضافه
                                یا کم نمی‌کند. سهمتو بر اساس مشخصات هر نماد از
                                قبیل جذابیت خرید و فروش، ریسک سرمایه گذاری و
                                شاخص ترس و طمع و پارامترهای دیگر مانند: تازگی
                                سیگنال‌ها و اعتبار کانال‌ها که همگی براساس
                                محتوای پیام های منتشر شده در کانال‌های بورسی
                                هستند، بهترین نمادها را در{' '}
                                <Link href={`${getLinksLang(lang)}/signals`}>
                                    صفحه سیگنال
                                </Link>
                                معرفی می‌کند.
                            </p>
                        )}
                        <p className="shadow-4xl mt-4 rounded-tl-lg rounded-tr-lg bg-neutral-300 px-8 py-4 text-center text-sm text-neutral-800">
                            {dict.copyright}
                        </p>
                    </div>
                </div>
            </div>
            {/*mobile footer*/}
            <div className="shadow-4xl rounded-tl-lg rounded-tr-lg bg-neutral-100  pb-20 md:hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="flex flex-col gap-2">
                        <BreadcrumbComponent />
                        <div>
                            <svg
                                version="1.1"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 64 64"
                                width={64}
                                height={64}
                            >
                                <defs>
                                    <path
                                        d="M26.42 41.9C26.42 41.9 26.42 41.9 26.42 41.9C26.42 43.55 26.42 44.47 26.42 44.65C26.42 44.65 26.42 44.65 26.42 44.65C19.62 44.65 15.85 44.65 15.09 44.65C15.09 44.65 15.09 44.65 15.09 44.65C15.09 43 15.09 42.08 15.09 41.9C15.09 41.9 15.09 41.9 15.09 41.9C21.89 41.9 25.67 41.9 26.42 41.9Z"
                                        id="h1aja7cujU"
                                    />
                                    <path
                                        d="M51.27 58.8C51.27 58.8 51.27 58.8 51.27 58.8C51.27 59.78 51.27 60.33 51.27 60.44C51.27 60.44 51.27 60.44 51.27 60.44C43.33 60.44 38.91 60.44 38.03 60.44C38.03 60.44 38.03 60.44 38.03 60.44C38.03 59.46 38.03 58.91 38.03 58.8C38.03 58.8 38.03 58.8 38.03 58.8C45.97 58.8 50.39 58.8 51.27 58.8Z"
                                        id="c1PWMZCesy"
                                    />
                                    <path
                                        d="M64 0C64 0 64 0 64 0C64 19.2 64 29.87 64 32C64 32 64 32 64 32C44.8 32 34.13 32 32 32C32 32 32 32 32 32C32 12.8 32 2.13 32 0C32 0 32 0 32 0C51.2 0 61.87 0 64 0Z"
                                        id="a1399CTWCj"
                                    />
                                    <path
                                        d="M48.03 17.03L36.89 17.03L36.89 22.37L50.24 22.37L59.07 13.54L55.3 9.76L48.03 17.03Z"
                                        id="a2baNl3rog"
                                    />
                                    <path
                                        d="M19.62 36.64C19.62 36.64 19.62 36.64 19.62 36.64C19.62 38.3 19.62 39.22 19.62 39.4C19.62 39.4 19.62 39.4 19.62 39.4C15.31 39.4 12.91 39.4 12.43 39.4C12.43 39.4 12.43 39.4 12.43 39.4C12.43 37.75 12.43 36.83 12.43 36.64C12.43 36.64 12.43 36.64 12.43 36.64C16.75 36.64 19.14 36.64 19.62 36.64Z"
                                        id="aoeB3t71t"
                                    />
                                    <path
                                        d="M4.83 41.9C3.69 41.9 2.76 40.96 2.76 39.82C2.76 38.68 3.69 37.75 4.83 37.75C4.97 37.75 5.66 37.75 6.91 37.75L6.91 40.24L9.67 40.24L9.67 34.99C6.77 34.99 5.16 34.99 4.83 34.99C2.17 34.99 0 37.16 0 39.82C0 42.48 2.17 44.65 4.83 44.65C4.84 44.65 4.89 44.65 4.97 44.65L6.91 44.65L6.91 50.03L9.67 50.03L9.67 44.65L16.3 44.65L16.3 41.89L8.29 41.89L4.97 41.9L4.97 41.9C4.89 41.9 4.84 41.9 4.83 41.9Z"
                                        id="a2l0kMKNF"
                                    />
                                    <path
                                        d="M58.3 41.88C50.79 41.88 46.62 41.88 45.78 41.88C43.9 41.88 42.13 42.61 40.79 43.94C40.65 44.08 39.93 44.81 38.62 46.1L34.4 41.9L32.33 41.9C32.33 40.15 32.33 39.19 32.33 38.99C32.33 37.35 31.39 35.94 29.87 35.31C28.35 34.68 26.69 35.01 25.53 36.17C25.27 36.44 23.94 37.76 21.56 40.15L21.56 50.03L24.31 50.03L24.31 41.29C26.21 39.39 27.27 38.34 27.48 38.13C28.02 37.59 28.64 37.79 28.81 37.86C28.99 37.93 29.57 38.23 29.57 38.99C29.57 39.19 29.57 40.15 29.57 41.9L26.08 41.9L26.08 44.65L33.26 44.65L36.67 48.05L34.7 50.02L36.64 51.97C40.3 48.33 42.33 46.3 42.74 45.9C43.55 45.09 44.63 44.64 45.78 44.64C46.69 44.64 51.24 44.64 59.44 44.64L64 40.08L62.05 38.13L58.3 41.88Z"
                                        id="iMeQabzUD"
                                    />
                                    <path
                                        d="M2.22 57.72C2.22 57.71 2.22 57.7 2.22 57.69C2.22 57.28 2.6 56.96 3.31 56.96C4.01 56.96 4.75 57.27 5.49 57.79C5.59 57.65 6.36 56.54 6.45 56.4C5.6 55.71 4.55 55.33 3.33 55.33C1.61 55.33 0.39 56.34 0.39 57.86C0.39 57.86 0.39 57.88 0.39 57.89C0.39 59.56 1.48 60.02 3.17 60.46C4.58 60.82 4.87 61.06 4.87 61.53C4.87 61.53 4.87 61.55 4.87 61.55C4.87 62.04 4.41 62.34 3.65 62.34C2.69 62.34 1.9 61.95 1.14 61.32C1.03 61.45 0.16 62.5 0.05 62.63C1.06 63.53 2.34 63.98 3.62 63.98C5.43 63.98 6.71 63.04 6.71 61.37C6.71 61.37 6.71 61.35 6.71 61.35C6.7 59.88 5.74 59.27 4.04 58.82C2.58 58.45 2.22 58.27 2.22 57.72Z"
                                        id="b5qhrcyXod"
                                    />
                                    <path
                                        d="M7.41 63.86L9.3 63.86L11.85 57.61L12.96 60.34L11.74 60.34L11.07 61.97L13.62 61.97L14.39 63.86L16.33 63.86L12.72 55.39L11.02 55.39L7.41 63.86Z"
                                        id="aOzVc2gu3"
                                    />
                                    <path
                                        d="M28.75 55.45L26.76 55.45L26.76 63.86L28.57 63.86L28.57 58.4L30.91 61.96L30.96 61.96L33.33 58.37L33.33 63.86L35.16 63.86L35.16 55.45L33.17 55.45L30.96 59L28.75 55.45Z"
                                        id="agFj6EOG7"
                                    />
                                    <path
                                        d="M49.97 57.15L49.97 63.86L51.82 63.86L51.82 57.15L54.38 57.15L54.38 55.45L47.41 55.45L47.41 57.15L49.97 57.15Z"
                                        id="g15RI0MfR8"
                                    />
                                    <path
                                        d="M55.06 59.65C55.06 59.65 55.06 59.67 55.06 59.68C55.06 62.07 56.92 64 59.52 64C62.11 64 64 62.04 64 59.65C64 59.65 64 59.63 64 59.63C64 57.24 62.14 55.3 59.54 55.3C56.95 55.3 55.06 57.26 55.06 59.65ZM59.54 62.29C58.05 62.29 57 61.09 57 59.65C57 59.65 57 59.63 57 59.63C57 58.18 58.03 57.01 59.52 57.01C61.01 57.01 62.07 58.21 62.07 59.65C62.07 59.65 62.07 59.66 62.07 59.68C61.38 61.42 60.54 62.29 59.54 62.29Z"
                                        id="g3JN50Uk1z"
                                    />
                                    <path
                                        d="M43.53 57.09L43.53 55.45L37.18 55.45L37.18 63.86L43.59 63.86L43.59 62.21L39.02 62.21L39.02 57.09L43.53 57.09Z"
                                        id="f2gREVeJox"
                                    />
                                    <path
                                        d="M42.98 58.8C42.98 58.8 42.98 58.8 42.98 58.8C42.98 59.78 42.98 60.33 42.98 60.44C42.98 60.44 42.98 60.44 42.98 60.44C41.35 60.44 40.44 60.44 40.26 60.44C40.26 60.44 40.26 60.44 40.26 60.44C40.26 59.46 40.26 58.91 40.26 58.8C40.26 58.8 40.26 58.8 40.26 58.8C41.89 58.8 42.8 58.8 42.98 58.8Z"
                                        id="byOYIz70v"
                                    />
                                    <path
                                        d="M19.48 58.77L19.48 55.45L17.63 55.45L17.63 63.86L19.48 63.86L19.48 60.48L22.89 60.48L22.89 63.86L24.74 63.86L24.74 55.45L22.89 55.45L22.89 58.77L19.48 58.77Z"
                                        id="f2Tv4GgQr2"
                                    />
                                </defs>
                                <g>
                                    <g>
                                        <g>
                                            <use
                                                xlinkHref="#h1aja7cujU"
                                                opacity={1}
                                                fill="#10edc5"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#h1aja7cujU"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#c1PWMZCesy"
                                                opacity={1}
                                                fill="#10edc5"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#c1PWMZCesy"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#a1399CTWCj"
                                                opacity={1}
                                                fill="#10edc5"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#a1399CTWCj"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#a2baNl3rog"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#a2baNl3rog"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#aoeB3t71t"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#aoeB3t71t"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#a2l0kMKNF"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#a2l0kMKNF"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#iMeQabzUD"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#iMeQabzUD"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#b5qhrcyXod"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#b5qhrcyXod"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#aOzVc2gu3"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#aOzVc2gu3"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#agFj6EOG7"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#agFj6EOG7"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#g15RI0MfR8"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#g15RI0MfR8"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#g3JN50Uk1z"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#g3JN50Uk1z"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#f2gREVeJox"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#f2gREVeJox"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#byOYIz70v"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#byOYIz70v"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                        <g>
                                            <use
                                                xlinkHref="#f2Tv4GgQr2"
                                                opacity={1}
                                                fill="#0c0e3c"
                                                fillOpacity={1}
                                            />
                                            <g>
                                                <use
                                                    xlinkHref="#f2Tv4GgQr2"
                                                    opacity={1}
                                                    fillOpacity={0}
                                                    stroke="#000000"
                                                    strokeWidth={1}
                                                    strokeOpacity={0}
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div
                        dir="ltr"
                        className="flex flex-col gap-4 text-sm font-medium"
                    >
                        <a href="/contact">تماس با ما</a>
                        <a
                            href="tel:+9821-91304925"
                            dir="ltr"
                            className="flex items-center gap-2.5"
                        >
                            <Phone
                                strokeWidth={0.5}
                                fill="#10EDC5"
                                className="text-neutral-300 drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.6)]"
                            />
                            <div className="text-base">۰۲۱-۹۱۳۰۴۹۲۵</div>
                        </a>
                        <a
                            href="mailto:info@sahmeto.com"
                            dir="ltr"
                            className="flex items-center gap-2.5"
                        >
                            <Mail
                                strokeWidth={0.5}
                                fill="#10EDC5"
                                className="text-[rgba(0,_0,_0,_.4)] drop-shadow-[0px_0px_1px_rgba(0,_0,_0,_.1)]"
                            />
                            <div>info@sahmeto.com</div>
                        </a>
                    </div>
                </div>
                <div className=" mx-auto my-8 h-[1px] w-[90%] bg-neutral-200" />
                <div className="items-cente flex flex-col gap-10 px-8">
                    <a
                        href="/user/login"
                        className="flex items-center justify-between"
                    >
                        <h6 className="text-base underline underline-offset-2">
                            فعال سازی ۷ روز هدیه رایگان
                        </h6>
                        <ArrowLeft width={24} height={24} />
                    </a>
                    <div className="flex justify-center">
                        <a
                            href="/pricing"
                            className={cn(
                                buttonVariants({
                                    variant: 'secondary',
                                    size: 'xl',
                                }),
                                'flex w-40 justify-evenly rounded-xl px-1 text-base font-semibold shadow-[0px_0px_50px_10px_rgba(16,_237,_197,_.8)]'
                            )}
                        >
                            <ShoppingCart />
                            خرید اشتراک
                        </a>
                    </div>
                </div>
                <div className="mt-12 px-8">
                    <div className="grid w-full grid-cols-3 place-items-center gap-3 sm:p-4 md:mx-auto md:max-w-4xl lg:grid-cols-6 lg:p-0">
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
                            <Image
                                className="h-full w-full object-contain"
                                src="/img/zarinpal.png"
                                alt="zarinpal"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="h-24 w-24 rounded-lg bg-white p-4 lg:h-28 lg:w-28">
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
                        </div>
                    </div>
                </div>
                <div className="px-8 py-2 text-neutral-800">
                    <div className="mt-8">
                        <div className="text-lg font-bold">{dict.products}</div>
                        <ul className="flex flex-wrap items-center justify-between gap-x-3 text-sm leading-loose">
                            <li>
                                <Link href={`${getLinksLang(lang)}/signals`}>
                                    {dict.selectedIcons}
                                </Link>
                            </li>
                            <li>
                                <Link href={`${getLinksLang(lang)}/feed`}>
                                    {dict.feed}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`${getLinksLang(lang)}/leaderboard`}
                                >
                                    {dict.bestTraders}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-8">
                        <div className="text-lg font-bold">
                            {dict.sahmetoWorld}
                        </div>
                        <ul className="flex flex-wrap items-center justify-between gap-x-3 text-sm leading-loose [&>li]:min-w-20">
                            <li className="relative">
                                <a href="https://shmto.ir/9vg" target="_blank">
                                    {dict.reportProblem}
                                </a>
                            </li>
                            <li>
                                <a href="https://dev.sahmeto.com">
                                    {dict.developWithSahmeto}
                                </a>
                            </li>
                            <li>
                                <Link href={`${getLinksLang(lang)}/privacy`}>
                                    {dict.rules}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`${getLinksLang(lang)}/organization`}
                                >
                                    {dict.organizationalSolution}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-3 flex w-full flex-col justify-center gap-2 rounded-t-xl bg-neutral-800 pt-8">
                    <div className="flex flex-col items-center gap-6">
                        <a
                            href="https://www.instagram.com/sahmeto_com"
                            className="bg-instagram flex gap-5 rounded-2xl px-7 py-5 text-base font-semibold text-white "
                        >
                            <span>اینستاگرام سهمتو</span>
                            <InstagramLogoIcon className="h-6 w-6 text-white" />
                        </a>
                        <div className="flex items-center gap-10">
                            <a href="https://t.me/sahmetocom" target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 625 518"
                                >
                                    <path
                                        fill="#fff"
                                        fillRule="evenodd"
                                        d="M43.277 222.931c167.624-73.031 279.4-121.178 335.327-144.44C538.288 12.073 571.469.535 593.096.154c4.756-.083 15.392 1.095 22.281 6.686 5.817 4.72 7.418 11.096 8.184 15.571.765 4.476 1.719 14.67.961 22.636-8.653 90.921-46.096 311.563-65.145 413.396-8.06 43.089-23.931 57.537-39.296 58.951-33.391 3.073-58.747-22.067-91.088-43.267-50.607-33.174-79.197-53.825-128.321-86.197-56.77-37.411-19.968-57.972 12.385-91.576 8.467-8.794 155.59-142.614 158.438-154.753.356-1.518.686-7.178-2.676-10.166-3.362-2.988-8.324-1.967-11.905-1.154-5.076 1.152-85.922 54.588-242.538 160.309-22.948 15.758-43.734 23.435-62.357 23.033-20.53-.443-60.023-11.608-89.381-21.151C26.628 280.766-1.992 274.578.5 254.699c1.298-10.355 15.557-20.944 42.776-31.768z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/sahmeto">
                                <LinkedInLogoIcon className="h-6 w-6 text-white" />
                            </a>
                            <a href="https://twitter.com/Sahmetocom">
                                <TwitterLogoIcon className="h-6 w-6 text-white" />
                            </a>
                        </div>
                    </div>
                    <div className=" mx-auto my-8 h-[1px] w-[90%] bg-neutral-50" />
                    <div className="flex items-center justify-evenly bg-transparent">
                        <a className="text-base text-white" href="/about-us">
                            درباره ما
                        </a>
                        <a
                            className="text-base text-white"
                            href="https://blog.sahmeto.com"
                        >
                            بلاگ سهمتو
                        </a>
                        <a className="text-base text-white" href="/privact">
                            قوانین
                        </a>
                    </div>
                    <p className="shadow-6xl mt-10 rounded-tl-lg rounded-tr-lg bg-neutral-300 px-8 py-4 text-center text-sm text-neutral-800">
                        {dict.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
