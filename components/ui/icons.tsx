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
            <g clipPath="url(#clip0_1_5)">
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
    home: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill={props.fill} {...props}>
            <g filter="url(#filter0_b_170_511)">
                <path d="M7.14373 18.7821V15.7152C7.14372 14.9381 7.77567 14.3067 8.55844 14.3018H11.4326C12.2189 14.3018 12.8563 14.9346 12.8563 15.7152V18.7732C12.8562 19.4473 13.404 19.9951 14.0829 20H16.0438C16.9596 20.0023 17.8388 19.6428 18.4872 19.0007C19.1356 18.3586 19.5 17.4868 19.5 16.5775V7.86585C19.5 7.13139 19.1721 6.43471 18.6046 5.9635L11.943 0.674268C10.7785 -0.250877 9.11537 -0.220992 7.98539 0.745384L1.46701 5.9635C0.872741 6.42082 0.517552 7.11956 0.5 7.86585V16.5686C0.5 18.4637 2.04738 20 3.95617 20H5.87229C6.19917 20.0023 6.51349 19.8751 6.74547 19.6464C6.97746 19.4178 7.10793 19.1067 7.10792 18.7821H7.14373Z" fill={props.fill} />
            </g>
            <defs>
                <filter id="filter0_b_170_511" x="-9.48147" y="-9.98147" width="38.9629" height="39.9629" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.99073" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_170_511" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_170_511" result="shape" />
                </filter>
            </defs>
        </svg>
    ),
    arrowUpDown: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M10 10L6 6L10 2" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6H18" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 22L18 18L14 14" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 18H18" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    chevronLeft: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M15 18L9 12L15 6" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    money: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M20 6H4C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H20C21.1046 18 22 17.1046 22 16V8C22 6.89543 21.1046 6 20 6Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 12H6.01M18 12H18.01" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    buyGold: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="28" viewBox="0 0 37 28" fill="none" {...props}>
            <g filter="url(#filter0_b_145_240)">
                <path d="M29.4417 1.00098V22.7893" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <g filter="url(#filter1_b_145_240)">
                <path d="M23 7.55464L29.4418 1L35.8836 7.55464" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <path d="M16.5345 12.6945C15.902 12.0762 9.57732 12.0763 9.15565 12.6945C8.73398 13.3127 6.83657 17.4344 7.25824 18.2587C7.67991 19.083 18.0102 19.083 18.4319 18.2587C18.8535 17.4344 17.167 13.3127 16.5345 12.6945Z" stroke="black" stroke-width="1.5" />
            <path d="M10.337 20.8175C9.70446 20.1993 3.37981 20.1994 2.95814 20.8175C2.53647 21.4357 0.639063 25.5575 1.06073 26.3818C1.4824 27.2061 11.8127 27.2061 12.2344 26.3818C12.656 25.5575 10.9694 21.4358 10.337 20.8175Z" stroke="black" stroke-width="1.5" />
            <path d="M22.7317 20.8175C22.0992 20.1993 15.7746 20.1994 15.3529 20.8175C14.9312 21.4357 13.0338 25.5575 13.4555 26.3818C13.8772 27.2061 24.2075 27.2061 24.6291 26.3818C25.0508 25.5575 23.3642 21.4358 22.7317 20.8175Z" stroke="black" stroke-width="1.5" />
            <defs>
                <filter id="filter0_b_145_240" x="17.9153" y="-10.5253" width="23.0526" height="44.841" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5.26316" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_145_240" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_145_240" result="shape" />
                </filter>
                <filter id="filter1_b_145_240" x="11.4737" y="-10.5263" width="35.9362" height="29.6073" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5.26316" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_145_240" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_145_240" result="shape" />
                </filter>
            </defs>
        </svg>
    ),
    sellGold: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="28" viewBox="0 0 37 28" fill="none" {...props}>
            <g filter="url(#filter0_b_145_241)">
                <path d="M29.4417 26.7883V4.99999" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <g filter="url(#filter1_b_145_241)">
                <path d="M23 20.2347L29.4418 26.7893L35.8836 20.2347" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <path d="M16.5345 1.69449C15.902 1.07624 9.57732 1.07633 9.15565 1.6945C8.73398 2.31267 6.83657 6.43442 7.25824 7.25872C7.67991 8.08303 18.0102 8.08303 18.4319 7.25872C18.8535 6.43442 17.167 2.31273 16.5345 1.69449Z" stroke="black" stroke-width="1.5" />
            <path d="M10.337 9.81753C9.70446 9.19928 3.37981 9.19937 2.95814 9.81754C2.53647 10.4357 0.639063 14.5575 1.06073 15.3818C1.4824 16.2061 11.8127 16.2061 12.2344 15.3818C12.656 14.5575 10.9694 10.4358 10.337 9.81753Z" stroke="black" stroke-width="1.5" />
            <path d="M22.7317 9.81753C22.0992 9.19928 15.7746 9.19937 15.3529 9.81754C14.9312 10.4357 13.0338 14.5575 13.4555 15.3818C13.8772 16.2061 24.2075 16.2061 24.6291 15.3818C25.0508 14.5575 23.3642 10.4358 22.7317 9.81753Z" stroke="black" stroke-width="1.5" />
            <defs>
                <filter id="filter0_b_145_241" x="17.9153" y="-6.52632" width="23.0526" height="44.841" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5.26316" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_145_241" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_145_241" result="shape" />
                </filter>
                <filter id="filter1_b_145_241" x="11.4737" y="8.70836" width="35.9362" height="29.6073" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5.26316" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_145_241" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_145_241" result="shape" />
                </filter>
            </defs>
        </svg>
    ),
    setting: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" {...props}>
            <path d="M20 7.5H11" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 17.5H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 20.5C18.6569 20.5 20 19.1569 20 17.5C20 15.8431 18.6569 14.5 17 14.5C15.3431 14.5 14 15.8431 14 17.5C14 19.1569 15.3431 20.5 17 20.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 10.5C8.65685 10.5 10 9.15685 10 7.5C10 5.84315 8.65685 4.5 7 4.5C5.34315 4.5 4 5.84315 4 7.5C4 9.15685 5.34315 10.5 7 10.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    barChart3: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 22 22" fill="none" {...props}>
            <path d="M2.75 2.75V19.25H19.25" stroke="#0C0E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.5 15.5833V8.25" stroke="#0C0E3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.9167 15.5833V4.58331" stroke="#0C0E3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.33325 15.5833V12.8333" stroke="#0C0E3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    plus: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 22 22" fill="none"{...props}>
            <path d="M11 4.58334V17.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.58337 11H17.4167" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    ),
    fire: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 15 20" fill={props.fill} {...props}>
            <path d="M3.8158 12.1053C4.51374 12.1053 5.18309 11.828 5.67661 11.3345C6.17013 10.841 6.44738 10.1716 6.44738 9.47368C6.44738 8.02105 5.92106 7.36842 5.39475 6.31579C4.26633 4.06 5.15896 2.04842 7.50001 0C8.02633 2.63158 9.60528 5.1579 11.7105 6.84211C13.8158 8.52632 14.8684 10.5263 14.8684 12.6316C14.8684 13.5992 14.6778 14.5574 14.3075 15.4514C13.9372 16.3453 13.3945 17.1576 12.7103 17.8418C12.0261 18.5261 11.2138 19.0688 10.3198 19.4391C9.42581 19.8094 8.46765 20 7.50001 20C6.53238 20 5.57422 19.8094 4.68024 19.4391C3.78626 19.0688 2.97397 18.5261 2.28975 17.8418C1.60553 17.1576 1.06278 16.3453 0.692479 15.4514C0.322181 14.5574 0.131592 13.5992 0.131592 12.6316C0.131592 11.4179 0.587381 10.2168 1.18422 9.47368C1.18422 10.1716 1.46148 10.841 1.95499 11.3345C2.44851 11.828 3.11786 12.1053 3.8158 12.1053Z" fill={props.fill} />
        </svg>
    ),
    graph: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 21 20" fill={props.fill} {...props}>
            <g filter="url(#filter0_b_170_514)">
                <path d="M1.92164 15.5142C1.37084 14.5458 1.02254 13.4793 0.898342 12.3777C0.849742 12.051 0.828142 11.7216 0.834442 11.3913C0.847042 7.32692 3.74054 3.81872 7.78964 2.95922C8.28014 2.86742 8.77154 3.11222 8.98484 3.55502C9.03794 3.63512 9.08114 3.72152 9.11174 3.81242C9.24764 5.90942 9.39254 7.97042 9.52844 10.0323C9.52484 10.2465 9.55904 10.4598 9.62834 10.6623C9.79034 11.0628 10.1953 11.3166 10.6336 11.2932L17.2891 10.8675L17.335 10.8846C17.6203 10.8891 17.893 11.0052 18.091 11.2068C18.2899 11.4084 18.3988 11.6793 18.3943 11.9601C18.1315 15.7824 15.3298 18.9756 11.5165 19.7982C10.8863 19.9342 10.2538 20 9.62795 20C6.46701 19.9998 3.48423 18.3201 1.92164 15.5142ZM11.7055 9.09092C11.5174 8.92172 11.4112 8.68322 11.4121 8.43302L10.8955 0.889224V0.765024C10.9054 0.552624 10.9999 0.352824 11.1601 0.209724C11.3194 0.0666243 11.5309 -0.0089757 11.7469 0.000924297C16.318 0.137724 20.1376 3.45602 20.8306 7.89032C20.8342 7.91732 20.8342 7.94432 20.8306 7.97042C20.845 8.18012 20.7739 8.38712 20.6335 8.54552C20.4922 8.70392 20.2924 8.80112 20.0782 8.81462L12.3994 9.32132C12.3722 9.32373 12.345 9.32492 12.3178 9.32492C12.0917 9.32492 11.8735 9.24201 11.7055 9.09092Z" fill={props.fill} />
            </g>
            <defs>
                <filter id="filter0_b_170_514" x="-9.1481" y="-9.98141" width="39.9629" height="39.9628" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.99073" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_170_514" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_170_514" result="shape" />
                </filter>
            </defs>
        </svg>
    ),
    category: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 21 20" fill={props.fill} {...props}>
            <g filter="url(#filter0_b_170_536)">
                <path d="M14.5805 19.9999C13.1702 19.9999 12.0398 18.8497 12.0398 17.4394V14.0311C12.0398 12.6109 13.1702 11.4697 14.5805 11.4697H17.96C19.3604 11.4697 20.4998 12.6109 20.4998 14.0311V17.4394C20.4998 18.8497 19.3604 19.9999 17.96 19.9999H14.5805ZM3.0398 19.9999C1.6403 19.9999 0.5 18.8497 0.5 17.4394V14.0311C0.5 12.6109 1.6403 11.4697 3.0398 11.4697H6.4202C7.8296 11.4697 8.96 12.6109 8.96 14.0311V17.4394C8.96 18.8497 7.8296 19.9999 6.4202 19.9999H3.0398ZM14.5805 8.53032C13.1702 8.53032 12.0398 7.39002 12.0398 5.96982V2.56152C12.0398 1.15032 13.1702 0.00012207 14.5805 0.00012207H17.96C19.3604 0.00012207 20.4998 1.15032 20.4998 2.56152V5.96982C20.4998 7.39002 19.3604 8.53032 17.96 8.53032H14.5805ZM3.0398 8.53032C1.6403 8.53032 0.5 7.39002 0.5 5.96982V2.56152C0.5 1.15032 1.6403 0.00012207 3.0398 0.00012207H6.4202C7.8296 0.00012207 8.96 1.15032 8.96 2.56152V5.96982C8.96 7.39002 7.8296 8.53032 6.4202 8.53032H3.0398Z" fill={props.fill} />
            </g>
            <defs>
                <filter id="filter0_b_170_536" x="-9.48147" y="-9.98135" width="39.9627" height="39.9628" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.99073" />
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_170_536" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_170_536" result="shape" />
                </filter>
            </defs>
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
    copy: (props: IconProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -0.5 25 25" fill="none" {...props}>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"{...props}>
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
            {...props}
        >
            <g filter="url(#filter0_b_4396_11387)">
                <path
                    d="M9.77359 18.3877C7.71722 17.1222 5.80421 15.6327 4.0688 13.9459C2.84873 12.7312 1.9199 11.2503 1.35346 9.61663C0.334136 6.44761 1.52477 2.81968 4.85685 1.74602C6.60805 1.18226 8.52064 1.50447 9.9963 2.61187C11.4725 1.50582 13.3844 1.18372 15.1357 1.74602C18.4678 2.81968 19.667 6.44761 18.6477 9.61663C18.0813 11.2503 17.1524 12.7312 15.9324 13.9459C14.197 15.6327 12.2839 17.1222 10.2276 18.3877L10.0049 18.5263L9.77359 18.3877Z"
                    // stroke="#84859C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <g filter="url(#filter1_b_4396_11387)">
                <path
                    d="M13.542 5.31348C14.5512 5.63587 15.2683 6.54193 15.3579 7.60799"
                    // stroke="#84859C"
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
