import React from 'react';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { MapPin, PhoneIcon } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import {
    InstagramLogoIcon,
    LinkedInLogoIcon,
    TwitterLogoIcon,
} from '@radix-ui/react-icons';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

type PageProps = {
    params: {
        id: string;
        lang: Locale;
    };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.contactPageTitleSeo;
    const seoDescription = '';

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: '',
        },
    };
}

export default async function ContactPage({ params: { id, lang } }: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <div className="mx-auto mb-20 mt-10 flex h-full w-full flex-col items-center justify-center gap-10 px-4 md:max-w-7xl md:flex-row md:px-10">
            <div>
                <div className="mb-5 mt-2.5 flex">
                    <div className="flex h-[90px] w-[90px] min-w-[90px] items-center justify-center rounded-md bg-neutral-800 text-white ltr:mr-8 rtl:ml-8">
                        <MapPin width={40} height={40} strokeWidth={1.25} />
                    </div>
                    <div className="text-sm md:text-base ltr:pr-5 rtl:pl-5">
                        <h6 className="font-black">{dict.location}</h6>
                        <p className="mt-2 leading-6">{dict.address}</p>
                    </div>
                </div>
                <div className="mb-2.5 mt-5 flex ">
                    <div className="flex h-[90px] w-[90px] min-w-[90px] items-center justify-center rounded-md bg-neutral-700 text-white ltr:mr-8 rtl:ml-8">
                        <PhoneIcon width={40} height={40} strokeWidth={1.25} />
                    </div>
                    <div className="text-sm md:text-base ltr:pr-5 rtl:pl-5">
                        <h6 className="font-black">{dict.contactUs}</h6>
                        <p className="mt-2">
                            {' '}
                            {dict.callNumber}:{' '}
                            <span dir="ltr">021-91304925</span>
                        </p>
                        <p className="mt-1.5">{dict.email} : info@talanow.com</p>
                        <p className="mt-1.5">{dict.postalCode}: 1439956172</p>
                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <h6 className="text-base font-black">
                        {' '}
                        {dict.socialNetworks} :
                    </h6>
                    <div className="mb-5 grid w-fit grid-cols-2 gap-5">
                        <a
                            href="https://www.linkedin.com/company/sahmeto"
                            target="_blank"
                            className="flex h-10 w-36 items-center justify-center rounded-md bg-[#2867B2] duration-200 hover:scale-105"
                        >
                            <span className="text-base font-black text-white">
                                {dict.linkedin}
                            </span>
                            <div className="text-base font-normal text-white ltr:ml-7 rtl:mr-7">
                                <LinkedInLogoIcon className="h-5 w-5 stroke-1" />
                            </div>
                        </a>
                        <a
                            href="https://t.me/sahmetocom"
                            target="_blank"
                            className="flex h-10 w-36 items-center justify-center rounded-md bg-[#1DA1F2] duration-200 hover:scale-105"
                        >
                            <span className="text-base font-black text-white">
                                {dict.tel}
                            </span>
                            <div className="text-base font-normal text-white ltr:ml-7 rtl:mr-7">
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
                            </div>
                        </a>
                        <a
                            href="https://www.instagram.com/sahmeto_com"
                            target="_blank"
                            className="flex h-10 w-36 items-center justify-center rounded-md bg-gradient-to-r from-yellow-300 via-red-600  to-purple-600 duration-200 hover:scale-105"
                        >
                            <span className="text-base font-black text-white">
                                {dict.instagram}
                            </span>
                            <div className="bg-inherit text-base text-white ltr:ml-5 rtl:mr-5">
                                <InstagramLogoIcon className="h-6 w-6 stroke-2" />
                            </div>
                        </a>
                        <a
                            href="https://twitter.com/Sahmetocom"
                            target="_blank"
                            className="flex h-10 w-36 items-center justify-center rounded-md bg-neutral-800 duration-200 hover:scale-105"
                        >
                            <span className="text-base font-black text-white">
                                {dict.twitter}
                            </span>
                            <div className="text-base font-normal text-white ltr:ml-7 rtl:mr-7">
                                <TwitterLogoIcon className="h-5 w-5 stroke-1" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1619.5150212315004!2d51.38743914847648!3d35.72547966643226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e072b2ac28083%3A0xb4e0ff8eaf79bf7a!2sSchool%20of%20Mechanical%20Engineering!5e0!3m2!1sen!2s!4v1687690940017!5m2!1sen!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[450px] w-full rounded-md md:w-1/2"
            />
        </div>
    );
}
