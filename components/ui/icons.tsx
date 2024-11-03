import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
    width?: string;
    height?: string;
    stroke?: string;
    strokeWidth?: string;
};

export const Icons = {
    logo: (props: IconProps) => (
        <svg width="36" height="36" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1_5)">
                <path d="M45.4024 0H0V44.9216H45.4024V0Z" fill="#FFBE00" />
                <path d="M15.6977 10.4651H30.3488V16.7442H15.6977V10.4651Z" fill="#FFF9F9" />
                <path d="M15.6977 10.4651H30.3488V16.7442H15.6977V10.4651Z" fill="#FFF9F9" />
                <rect x="15.6977" y="34.5349" width="17.7907" height="6.27907" transform="rotate(-90 15.6977 34.5349)"
                    fill="#FFF9F9" />
            </g>
            <defs>
                <clipPath id="clip0_1_5">
                    <rect width="45" height="45" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ),
    question: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5" />
            <path d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="12" cy="16" r="1" fill="#1C274C" />
        </svg>
    ),
    buyer: (props: IconProps) => {
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><circle cx="10" cy="20.5" r="1" /><circle cx="18" cy="20.5" r="1" /><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" /></svg>
    },
    gold: (props: IconProps) => (
        <svg width={props.width ? props.width : '45'} height={props.height ? props.height : '45'} viewBox="0 0 54 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5921 7.8125C17.1547 8.27511 15.9702 8.95549 15.0254 9.90036C14.0805 10.8452 13.4001 12.0297 12.9375 13.4671C12.4749 12.0297 11.7945 10.8452 10.8496 9.90036C9.90478 8.95549 8.72031 8.27511 7.28287 7.8125C8.72031 7.3499 9.90478 6.66952 10.8496 5.72465C11.7945 4.77978 12.4749 3.59531 12.9375 2.15787C13.4001 3.59531 14.0805 4.77978 15.0254 5.72465C15.9702 6.66952 17.1547 7.3499 18.5921 7.8125Z" fill={props.fill} stroke={props.stroke} />
            <path d="M28.4795 7.8125C28.1592 7.97951 27.8733 8.18522 27.623 8.43551C27.3727 8.6858 27.167 8.97174 27 9.29204C26.833 8.97174 26.6273 8.6858 26.377 8.43551C26.1267 8.18522 25.8408 7.97951 25.5205 7.8125C25.8408 7.64549 26.1267 7.43978 26.377 7.18949C26.6273 6.9392 26.833 6.65326 27 6.33296C27.167 6.65326 27.3727 6.9392 27.623 7.18949C27.8733 7.43978 28.1592 7.64549 28.4795 7.8125Z" fill={props.fill} stroke={props.stroke} />
            <path d="M9.49879 20.3125C8.83895 20.5855 8.27236 20.9502 7.79879 21.4238C7.32522 21.8974 6.96051 22.464 6.6875 23.1238C6.41449 22.464 6.04978 21.8974 5.57621 21.4238C5.10264 20.9502 4.53605 20.5855 3.87621 20.3125C4.53605 20.0395 5.10264 19.6748 5.57621 19.2012C6.04978 18.7276 6.41449 18.1611 6.6875 17.5012C6.96051 18.1611 7.32522 18.7276 7.79879 19.2012C8.27236 19.6748 8.83895 20.0395 9.49879 20.3125Z" fill={props.fill} stroke={props.stroke} />
            <path d="M34.7799 13.947C33.4453 12.659 20.0999 12.6592 19.2102 13.947C18.3204 15.2349 14.3168 23.8219 15.2065 25.5392C16.0963 27.2566 37.8939 27.2566 38.7835 25.5392C39.6732 23.8219 36.1145 15.235 34.7799 13.947Z" stroke={props.stroke} stroke-width="2.5" />
            <path d="M21.7015 30.8698C20.3669 29.5817 7.02153 29.5819 6.13179 30.8698C5.24205 32.1576 1.2384 40.7447 2.12814 42.462C3.01788 44.1793 24.8155 44.1793 25.7052 42.462C26.5948 40.7447 23.0361 32.1578 21.7015 30.8698Z" stroke={props.stroke} stroke-width="2.5" />
            <path d="M47.8582 30.8698C46.5237 29.5817 33.1783 29.5819 32.2885 30.8698C31.3988 32.1576 27.3951 40.7447 28.2849 42.462C29.1746 44.1793 50.9722 44.1793 51.8619 42.462C52.7515 40.7447 49.1928 32.1578 47.8582 30.8698Z" stroke={props.stroke} stroke-width="2.5" />
        </svg>

    ),
    info: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M12 11.5V16.5" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 7.51L12.01 7.49889" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={props.stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    transaction: (props: IconProps) => {
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24px" height="24px" viewBox="0 0 24 24" fill="none"{...props}>
            <path d="M10 10L6 6L10 2" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6H18" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 22L18 18L14 14" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 18H18" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    },
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
