import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
    width?: string;
    height?: string;
    stroke?: string;
    strokeWidth?: string;
};

export const Icons = {
    logo: (props: IconProps) => (
        <svg
            viewBox="0 0 126 37"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            fill={props.fill ?? '#0C0E3C'}
        >
            <rect
                x="63.3237"
                y="8.81152"
                width="14.4518"
                height="3.51767"
                fill="#10EDC5"
            />
            <rect
                x="92.5791"
                y="30.3652"
                width="16.8848"
                height="2.09888"
                fill="#10EDC5"
            />
            <rect
                y="0.00976562"
                width="36.9355"
                height="36.9355"
                fill="#10EDC5"
            />
            <path
                d="M26.8888 11.2798L18.5011 19.6675H5.64404V25.8292H21.0534L31.2449 15.6358L26.8888 11.2798Z"
                fill="#0C0E3C"
            />
            <rect x="59.937" y="2.11475" width="9.16353" height="3.51767" />
            <path d="M50.4197 8.81176H50.2438C48.784 8.81176 47.5978 7.62357 47.5978 6.16569C47.5978 4.70586 48.7859 3.51962 50.2438 3.51962H52.8899V6.6953H56.4076V0H50.2438C46.8454 0 44.0801 2.76528 44.0801 6.16374C44.0801 9.5622 46.8454 12.3275 50.2438 12.3275H50.4197H52.8899V19.185H56.4076V12.3275H64.8715V8.80981H54.6507L50.4197 8.81176Z" />
            <path d="M123.212 4.00229L118.424 8.79023H102.466C100.064 8.79023 97.8048 9.72436 96.1045 11.4187L93.3373 14.1762L87.9475 8.81173H85.3112V5.1084C85.3112 3.01539 84.1093 1.21552 82.1746 0.414269C80.2399 -0.386977 78.1195 0.0351429 76.6382 1.51452L71.5708 6.58191V19.1849H75.0884V8.03784L79.124 4.00229C79.8099 3.31635 80.6014 3.5704 80.8261 3.6642C81.0529 3.75801 81.7916 4.13909 81.7916 5.1084V8.81173H77.3437V12.3294H86.4935L90.8437 16.66L88.3286 19.1674L90.8124 21.659L98.5865 13.9123C99.6242 12.8785 101 12.3099 102.464 12.3099H119.878L125.698 6.49006L123.212 4.00229Z" />
            <path d="M49.2295 30.3966C47.3749 29.9218 46.9157 29.6911 46.9157 28.9876V28.9563C46.9157 28.4346 47.3906 28.0222 48.2954 28.0222C49.2002 28.0222 50.1343 28.4209 51.0841 29.0795L52.3094 27.303C51.2209 26.4295 49.8881 25.939 48.3266 25.939C46.1359 25.939 44.5725 27.2268 44.5725 29.1713V29.2026C44.5725 31.3327 45.9659 31.9288 48.1273 32.4818C49.9194 32.9411 50.2868 33.2479 50.2868 33.8459V33.8772C50.2868 34.5045 49.7044 34.8875 48.739 34.8875C47.5137 34.8875 46.5014 34.3814 45.5379 33.586L44.1445 35.2569C45.4324 36.406 47.0701 36.9727 48.694 36.9727C51.0079 36.9727 52.6319 35.7787 52.6319 33.6485V33.6173C52.6299 31.7451 51.4046 30.9634 49.2295 30.3966Z" />
            <path d="M58.1311 26.0151L53.5347 36.8164H55.9404L59.1884 28.8488L60.613 32.3274H59.0457L58.2034 34.4107H61.4553L62.4364 36.8164H64.9026L60.3062 26.0151H58.1311Z" />
            <path d="M83.5617 30.6252L80.7437 26.0913H78.2012V36.8163H80.5131V29.8611L83.5011 34.395H83.5617L86.581 29.8142V36.8163H88.9242V26.0913H86.3817L83.5617 30.6252Z" />
            <path d="M104.541 28.2664H107.805V36.8163H110.164V28.2664H113.427V26.0913H104.541V28.2664Z" />
            <path d="M120.015 25.9077C116.706 25.9077 114.3 28.4053 114.3 31.4539V31.4852C114.3 34.5338 116.675 37.0001 119.983 37.0001C123.292 37.0001 125.698 34.5025 125.698 31.4539V31.4226C125.7 28.374 123.325 25.9077 120.015 25.9077ZM123.231 31.4852C123.231 33.3241 121.914 34.825 120.015 34.825C118.115 34.825 116.767 33.2929 116.767 31.4539V31.4226C116.767 29.5837 118.084 28.0828 119.983 28.0828C121.883 28.0828 123.231 29.6149 123.231 31.4539V31.4852Z" />
            <path d="M93.8432 28.1902H99.5887V26.0913H91.498V36.8163H99.6649V34.7174H93.8432V28.1902Z" />
            <rect x="95.4165" y="30.3652" width="3.48054" height="2.09888" />
            <path d="M73.2671 30.336H68.9169V26.0913H66.5581V36.8163H68.9169V32.5111H73.2671V36.8163H75.6278V26.0913H73.2671V30.336Z" />
        </svg>
    ),
    google: (props: IconProps) => (
        <svg role="img" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
        </svg>
    ),
    spinner: (props: IconProps) => (
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
            {...props}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    ),
    plusSquare: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            fill="none"
            viewBox="0 0 18 19"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M14.25 2.923H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5v-10.5a1.5 1.5 0 00-1.5-1.5zM9 6.673v6M6 9.673h6"
            />
        </svg>
    ),
    minusSquare: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            fill="none"
            viewBox="0 0 18 19"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M14.25 2.75H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V4.25a1.5 1.5 0 00-1.5-1.5z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 9.5h6"
            />
        </svg>
    ),
    paperPlus: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="21"
            fill="none"
            viewBox="0 0 18 21"
            {...props}
        >
            <g filter="url(#filter0_b_2924_9393)">
                <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11.486 1.502H4.834C2.775 1.502 1 3.172 1 5.232V16.08c0 2.176 1.658 3.775 3.834 3.775h7.988c2.06 0 3.73-1.715 3.73-3.775V6.778l-5.066-5.276z"
                ></path>
            </g>
            <g filter="url(#filter1_b_2924_9393)">
                <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11.223 1.49V4.4a2.575 2.575 0 002.569 2.575c1.316.003 2.663.004 2.754-.002"
                ></path>
            </g>
            <g filter="url(#filter2_b_2924_9393)">
                <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11.044 11.655H6.143"
                ></path>
            </g>
            <g filter="url(#filter3_b_2924_9393)">
                <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8.594 14.106V9.205"
                ></path>
            </g>
            <defs>
                <filter
                    id="filter0_b_2924_9393"
                    width="38.105"
                    height="40.906"
                    x="-10.276"
                    y="-9.774"
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
                        result="effect1_backgroundBlur_2924_9393"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9393"
                        result="shape"
                    ></feBlend>
                </filter>
                <filter
                    id="filter1_b_2924_9393"
                    width="27.875"
                    height="28.039"
                    x="-0.054"
                    y="-9.786"
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
                        result="effect1_backgroundBlur_2924_9393"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9393"
                        result="shape"
                    ></feBlend>
                </filter>
                <filter
                    id="filter2_b_2924_9393"
                    width="27.453"
                    height="22.553"
                    x="-5.134"
                    y="0.378"
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
                        result="effect1_backgroundBlur_2924_9393"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9393"
                        result="shape"
                    ></feBlend>
                </filter>
                <filter
                    id="filter3_b_2924_9393"
                    width="22.553"
                    height="27.454"
                    x="-2.683"
                    y="-2.072"
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
                        result="effect1_backgroundBlur_2924_9393"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9393"
                        result="shape"
                    ></feBlend>
                </filter>
            </defs>
        </svg>
    ),
    paperNegative: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="20"
            fill="none"
            viewBox="0 0 17 20"
            {...props}
        >
            <g filter="url(#filter0_b_2924_9401)">
                <path
                    stroke="#2830C9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11.114.828H4.698C2.71.828 1 2.438 1 4.424v10.464c0 2.1 1.6 3.641 3.698 3.641h7.704c1.987 0 3.598-1.654 3.598-3.64V5.915L11.114.828z"
                ></path>
            </g>
            <g filter="url(#filter1_b_2924_9401)">
                <path
                    stroke="#2830C9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10.86.817v2.805c0 1.37 1.108 2.481 2.477 2.484 1.27.003 2.569.004 2.656-.002"
                ></path>
            </g>
            <g filter="url(#filter2_b_2924_9401)">
                <path
                    stroke="#2830C9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.857 10.821l2.29 2.29 4.578-4.578"
                ></path>
            </g>
            <defs>
                <filter
                    id="filter0_b_2924_9401"
                    width="37.553"
                    height="40.254"
                    x="-10.276"
                    y="-10.449"
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
                        result="effect1_backgroundBlur_2924_9401"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9401"
                        result="shape"
                    ></feBlend>
                </filter>
                <filter
                    id="filter1_b_2924_9401"
                    width="27.687"
                    height="27.844"
                    x="-0.417"
                    y="-10.46"
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
                        result="effect1_backgroundBlur_2924_9401"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9401"
                        result="shape"
                    ></feBlend>
                </filter>
                <filter
                    id="filter2_b_2924_9401"
                    width="29.42"
                    height="27.13"
                    x="-6.419"
                    y="-2.744"
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
                        result="effect1_backgroundBlur_2924_9401"
                    ></feComposite>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_2924_9401"
                        result="shape"
                    ></feBlend>
                </filter>
            </defs>
        </svg>
    ),
    lineChart: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            fill="none"
            viewBox="0 0 24 25"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3.262v18h18"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9.262l-5 5-4-4-3 3"
            />
        </svg>
    ),
    tick: (props: IconProps) => (
        <svg
            width={20}
            height={20}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    ),
    popular: (props: IconProps) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_b_4396_11387)">
                <path
                    d="M9.77359 18.3877C7.71722 17.1222 5.80421 15.6327 4.0688 13.9459C2.84873 12.7312 1.9199 11.2503 1.35346 9.61663C0.334136 6.44761 1.52477 2.81968 4.85685 1.74602C6.60805 1.18226 8.52064 1.50447 9.9963 2.61187C11.4725 1.50582 13.3844 1.18372 15.1357 1.74602C18.4678 2.81968 19.667 6.44761 18.6477 9.61663C18.0813 11.2503 17.1524 12.7312 15.9324 13.9459C14.197 15.6327 12.2839 17.1222 10.2276 18.3877L10.0049 18.5263L9.77359 18.3877Z"
                    stroke="#84859C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <g filter="url(#filter1_b_4396_11387)">
                <path
                    d="M13.542 5.31348C14.5512 5.63587 15.2683 6.54193 15.3579 7.60799"
                    stroke="#84859C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <filter
                    id="filter0_b_4396_11387"
                    x="-10.2734"
                    y="-9.80268"
                    width="40.5468"
                    height="39.6054"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="5.26316"
                    />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4396_11387"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4396_11387"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_b_4396_11387"
                    x="2.26568"
                    y="-5.96284"
                    width="24.369"
                    height="24.8476"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="5.26316"
                    />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4396_11387"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4396_11387"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    ),
    growChart: (props: IconProps) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_b_4396_11467)">
                <path
                    d="M5.24609 12.7198L8.05163 9.0735L11.2518 11.5873L13.9973 8.04395"
                    stroke="#84859C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <g filter="url(#filter1_b_4396_11467)">
                <circle
                    cx="17.1982"
                    cy="2.80172"
                    r="1.80172"
                    stroke="#84859C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <g filter="url(#filter2_b_4396_11467)">
                <path
                    d="M12.4447 1.78906H5.63251C2.80981 1.78906 1.05957 3.78812 1.05957 6.61081V14.1866C1.05957 17.0093 2.7755 18.9998 5.63251 18.9998H13.6974C16.5201 18.9998 18.2703 17.0093 18.2703 14.1866V7.58889"
                    stroke="#84859C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <filter
                    id="filter0_b_4396_11467"
                    x="-6.03022"
                    y="-3.23237"
                    width="31.3036"
                    height="27.2284"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="5.26316"
                    />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4396_11467"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4396_11467"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_b_4396_11467"
                    x="4.12017"
                    y="-10.2763"
                    width="26.1561"
                    height="26.1561"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="5.26316"
                    />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4396_11467"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4396_11467"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter2_b_4396_11467"
                    x="-10.2167"
                    y="-9.48725"
                    width="39.7636"
                    height="39.7636"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="5.26316"
                    />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4396_11467"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4396_11467"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    ),
};
