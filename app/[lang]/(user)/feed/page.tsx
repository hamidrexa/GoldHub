import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getDirection } from '@/libs/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyPublishers } from '@/app/[lang]/(user)/feed/components/my-publishers';
import { MyAssets } from '@/app/[lang]/(user)/feed/components/my-assets';
import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import AnnouncementAlert from '@/components/announcement-alert';
import { MessagesWrap } from '@/components/messages-wrap';

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
    const seoTitle = dict.feedPageTitleSeo;
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

export default async function FeedPage({ params: { id, lang } }: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="feed" />
            {/*<FollowSuggestion lang={lang} dict={dict} />*/}
            <main className="main">
                <div className="jumbotron">
                    {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                    <div className="w-full">
                        <div className="relative z-40 flex flex-col items-center justify-start gap-8 overflow-hidden border-b border-b-gray-800/40 bg-white px-4 pt-4 md:rounded-t-lg">
                            <h1 className="pb-6 pt-4 text-xl font-bold">
                                {dict.feedPageH1}
                            </h1>
                        </div>
                        <Tabs defaultValue="messages" dir={getDirection(lang)}>
                            <div className="sticky top-20 z-30 -mt-1.5 rounded-lg bg-white pt-1 shadow-[0_3px_8px_3px_rgba(132,_133,_156,_0.15)] md:top-24">
                                <TabsList>
                                    <TabsTrigger value="messages">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="21"
                                            fill="none"
                                            viewBox="0 0 20 21"
                                        >
                                            <g filter="url(#filter0_b_1970_7454)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M13.634 14.474h-7.22"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter1_b_1970_7454)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M13.634 10.287h-7.22"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter2_b_1970_7454)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M9.17 6.11H6.413"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter3_b_1970_7454)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M13.826 1l-7.689.004c-2.76.017-4.469 1.833-4.469 4.603v9.196c0 2.784 1.722 4.607 4.506 4.607l7.689-.003c2.76-.017 4.47-1.834 4.47-4.604V5.607C18.333 2.823 16.61 1 13.826 1z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_1970_7454"
                                                    width="29.773"
                                                    height="22.553"
                                                    x="-4.862"
                                                    y="3.197"
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
                                                        result="effect1_backgroundBlur_1970_7454"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_1970_7454"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter1_b_1970_7454"
                                                    width="29.773"
                                                    height="22.553"
                                                    x="-4.862"
                                                    y="-0.989"
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
                                                        result="effect1_backgroundBlur_1970_7454"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_1970_7454"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter2_b_1970_7454"
                                                    width="25.308"
                                                    height="22.553"
                                                    x="-4.862"
                                                    y="-5.166"
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
                                                        result="effect1_backgroundBlur_1970_7454"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_1970_7454"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter3_b_1970_7454"
                                                    width="39.217"
                                                    height="40.963"
                                                    x="-9.608"
                                                    y="-10.276"
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
                                                        result="effect1_backgroundBlur_1970_7454"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_1970_7454"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {dict.messages}
                                    </TabsTrigger>
                                    <TabsTrigger value="publishers">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="23"
                                            height="18"
                                            fill="none"
                                            viewBox="0 0 23 18"
                                        >
                                            <g filter="url(#filter0_b_2335_7524)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M17.152 8.222a2.902 2.902 0 100-5.802"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter1_b_2335_7524)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M18.486 11.375c.479.033.955.1 1.423.206.65.128 1.434.394 1.712.978.178.374.178.81 0 1.185-.277.584-1.061.85-1.712.983"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter2_b_2335_7524)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M5.847 8.222a2.902 2.902 0 110-5.802"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter3_b_2335_7524)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M4.512 11.375c-.478.033-.954.1-1.422.206-.651.128-1.434.394-1.712.978-.179.374-.179.81 0 1.185.277.584 1.06.85 1.712.983"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter4_b_2335_7524)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M11.493 12c3.247 0 6.021.491 6.021 2.458 0 1.965-2.755 2.475-6.02 2.475-3.248 0-6.021-.492-6.021-2.458 0-1.966 2.755-2.475 6.02-2.475z"
                                                ></path>
                                            </g>
                                            <g filter="url(#filter5_b_2335_7524)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M11.495 9.195a3.845 3.845 0 01-3.858-3.86 3.845 3.845 0 013.858-3.857 3.845 3.845 0 013.858 3.858 3.845 3.845 0 01-3.858 3.859z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_2335_7524"
                                                    width="25.455"
                                                    height="28.355"
                                                    x="5.876"
                                                    y="-8.856"
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
                                                        result="effect1_backgroundBlur_2335_7524"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7524"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter1_b_2335_7524"
                                                    width="25.82"
                                                    height="25.905"
                                                    x="7.21"
                                                    y="0.099"
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
                                                        result="effect1_backgroundBlur_2335_7524"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7524"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter2_b_2335_7524"
                                                    width="25.455"
                                                    height="28.355"
                                                    x="-8.331"
                                                    y="-8.856"
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
                                                        result="effect1_backgroundBlur_2335_7524"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7524"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter3_b_2335_7524"
                                                    width="25.82"
                                                    height="25.905"
                                                    x="-10.032"
                                                    y="0.099"
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
                                                        result="effect1_backgroundBlur_2335_7524"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7524"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter4_b_2335_7524"
                                                    width="34.594"
                                                    height="27.485"
                                                    x="-5.804"
                                                    y="0.724"
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
                                                        result="effect1_backgroundBlur_2335_7524"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7524"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                                <filter
                                                    id="filter5_b_2335_7524"
                                                    width="30.269"
                                                    height="30.27"
                                                    x="-3.64"
                                                    y="-9.799"
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
                                                        result="effect1_backgroundBlur_2335_7524"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7524"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {dict.myTraders}
                                    </TabsTrigger>
                                    <TabsTrigger value="assets">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="20"
                                            fill="none"
                                            viewBox="0 0 22 20"
                                        >
                                            <g filter="url(#filter0_b_2335_7544)">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M11.712 1.646l2.316 4.659c.116.235.34.399.6.437l5.185.749c.21.028.4.138.528.306a.77.77 0 01-.085 1.032l-3.758 3.634a.762.762 0 00-.226.7l.9 5.129a.787.787 0 01-.652.892.868.868 0 01-.516-.08l-4.618-2.421a.776.776 0 00-.742 0l-4.652 2.434a.812.812 0 01-1.077-.33.796.796 0 01-.08-.5l.9-5.128a.788.788 0 00-.227-.7L1.73 8.826a.786.786 0 01-.003-1.112l.003-.004a.91.91 0 01.452-.222l5.186-.75a.812.812 0 00.6-.437l2.314-4.655a.787.787 0 01.458-.4.798.798 0 01.61.044.82.82 0 01.362.356z"
                                                ></path>
                                            </g>
                                            <defs>
                                                <filter
                                                    id="filter0_b_2335_7544"
                                                    width="41.555"
                                                    height="40.553"
                                                    x="-9.778"
                                                    y="-10.071"
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
                                                        result="effect1_backgroundBlur_2335_7544"
                                                    ></feComposite>
                                                    <feBlend
                                                        in="SourceGraphic"
                                                        in2="effect1_backgroundBlur_2335_7544"
                                                        result="shape"
                                                    ></feBlend>
                                                </filter>
                                            </defs>
                                        </svg>
                                        {dict.myAssets}
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <div className="mt-6 px-2.5">
                                <TabsContent value="messages">
                                    <MessagesWrap
                                        showLockSection
                                        showTopTradersFilter
                                        userBookmarked
                                        showUpdateTime={false}
                                        market="tse"
                                        dict={dict}
                                        lang={lang}
                                    />
                                </TabsContent>
                                <TabsContent value="publishers">
                                    <MyPublishers dict={dict} lang={lang} />
                                </TabsContent>
                                <TabsContent value="assets">
                                    <MyAssets dict={dict} lang={lang} />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </main>
        </>
    );
}
