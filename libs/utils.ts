import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { i18n, Locale } from '@/i18n-config';
import { formatCurrency } from '@coingecko/cryptoformat';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FetcherParams {
    url?: string;
    absoluteUrl?: string;
    params?: {
        [key: string]: unknown;
    };
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    sendToken?: boolean;
    lang?: string;
    status?: boolean;
}

export const fetcher = async (params: FetcherParams) => {
    if (!params.url && !params.absoluteUrl) return;

    // @ts-ignore
    const queryString = new URLSearchParams(params.params || {}).toString();
    const url = params.absoluteUrl
        ? `${params.absoluteUrl}?${queryString}`
        : `${process.env.NEXT_PUBLIC_API_URL}${params.url}?${queryString}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...params.headers,
        ...(Cookies.get('token') &&
            (!params.absoluteUrl || params.sendToken) && {
            Authorization: `Bearer ${Cookies.get('token')}`,
        }),
        ...(params.lang && { language: params.lang }),
    };

    const res = await fetch(url, {
        method: params.method ?? 'GET',
        headers,
        ...(params.body && { body: JSON.stringify(params.body) }),
    });

    if (!res.ok) {
        throw {
            error: {
                ...(await res.json()),
            },
            status: res.status,
        };
    }

    return params.status
        ? { data: await res.json(), status: res.status }
        : res.json();
};

export function getDirection(lang: string) {
    return lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr';
}

export function isRtl(lang: string) {
    return lang === 'fa' || lang === 'ar';
}

export function getCompanySize(dict: any, value: number): string | null {
    return (
        dict.companySize.find(
            (category) =>
                category.value !== null &&
                value >= category.value.market_cap_from! &&
                value <= category.value.market_cap_to!
        )?.title || null
    );
}

export function convertDateToHumanTime(dict, lang, timestamp: string) {
    const providedTime = dayjs(timestamp);
    const currentTime = dayjs();
    const diff = providedTime.diff(currentTime, 'minute');

    if (diff > 0) {
        if (diff >= 1440) {
            const days = Math.floor(diff / 1440);
            return `${days} روز`;
        } else if (diff >= 60) {
            const hours = Math.floor(diff / 60);
            return `${hours} ساعت`;
        } else {
            return `${diff} دقیقه`;
        }
    } else {
        const pastDiff = currentTime.diff(providedTime, 'minute');
        if (pastDiff >= 1440) {
            return new Date(timestamp).toLocaleDateString(lang);
        } else if (pastDiff >= 60) {
            const hours = Math.floor(pastDiff / 60);
            return `${hours} ${dict.hourAgo}`;
        } else if (pastDiff > 0) {
            return `${pastDiff} ${dict.minuteAgo}`;
        } else {
            return dict.now;
        }
    }
}

export function getImageUrl(image: string) {
    if (
        image &&
        !image.includes('cdn.sahmeto.com') &&
        !image.includes('data:image') &&
        !/^https?:\/\//i.test(image)
    )
        return `https://cdn.sahmeto.com${image}`;
    return image;
}

export function getImage({
    photo,
    image,
    account_type,
}: {
    photo: any;
    image?: any;
    account_type: string;
}) {
    let img;
    if (photo?.thumbnail && photo?.thumbnail !== 'None') img = photo?.thumbnail;

    if (photo?.thumbnail_85 && photo?.thumbnail_85 !== 'None')
        img = photo?.thumbnail_85;

    if (image) img = image;

    if (getImageUrl(img)) return getImageUrl(img);

    if (
        account_type === 'tradingview' ||
        account_type === 'rahavard' ||
        account_type === 'arzdigital' ||
        account_type === 'sahamyab' ||
        account_type === 'institutional' ||
        account_type === 'bot' ||
        account_type === 'sahmeto' ||
        account_type === 'wallet'
    )
        return img ?? `/img/sources/${account_type}.png`;

    return `/img/no-image.jpg`;
}

export function sliceText(text: string, length: number) {
    if (text?.length <= length) return text;
    else return text.slice(0, length) + '...';
}

export function removeObjectFalsyValues(obj: any): any {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
}

export function formatDuration(duration = '0 00:00:00') {
    const regex = /(?:(\d+)\s)?(\d{2}):(\d{2}):(\d{2})/;
    const matches = duration.match(regex);

    if (!matches) {
        throw new Error('Invalid duration format');
    }

    const days = matches[1] ? parseInt(matches[1], 10) : 0;
    const hours = parseInt(matches[2], 10);
    const minutes = parseInt(matches[3], 10);
    const seconds = parseInt(matches[4], 10);

    let result = '';

    if (days > 0) {
        result += `${days} روز`;
    }
    if (hours > 0) {
        if (result) result += ' و ';
        result += `${hours} ساعت`;
    }
    if (minutes > 0) {
        if (result) result += ' و ';
        result += `${minutes} دقیقه`;
    }
    if (seconds > 0) {
        if (result) result += ' و ';
        result += `${seconds} ثانیه`;
    }

    return result;
}

export function roundNumber(
    number: string | number,
    fractionDigits?: number
): number {
    return parseFloat(
        Number.parseFloat(<string>number).toFixed(fractionDigits ?? 1)
    );
}

export function removeEmojis(text: string) {
    return text.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
}

export function getDateFromDate(daysAgo: number, date?: string) {
    const currentDate = date ? dayjs(date) : dayjs();
    const pastDate = currentDate.subtract(daysAgo, 'day');

    const currentFormatted = currentDate.format('YYYY-MM-DD');
    const pastFormatted = pastDate.format('YYYY-MM-DD');

    return { current: currentFormatted, past: pastFormatted };
}

export function getDateAfterDate(daysAfter: number, date?: string) {
    const currentDate = date ? dayjs(date) : dayjs();
    const comingDate = currentDate.add(daysAfter, 'day');

    const currentFormatted = currentDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const comingFormatted = comingDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return { current: currentFormatted, coming: comingFormatted };
}

export function areDatesEqual(dateString1, dateString2) {
    const date1 = dayjs(dateString1).format('YYYY/MM/DD');
    const date2 = dayjs(dateString2).format('YYYY/MM/DD');

    return date1 == date2;
}

export function findNearestNumber(target: number, arr: number[]): number {
    return arr.reduce((closest, current) =>
        Math.abs(current - target) < Math.abs(closest - target)
            ? current
            : closest
    );
}

export function sanitizeNumber(number: string) {
    const id = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9',
    };
    if (number ?? false) {
        return number.replace(/[^0-9.]/g, (w) => {
            return id[w] || w;
        });
    }
}

export function getLinksLang(lang: Locale) {
    return lang === i18n.defaultLocale ? '' : `/${lang}`;
}

export function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
}

export function currency(price: number, market: string, lang: Locale) {
    return formatCurrency(
        price || 0,
        market === 'tse' ? '' : 'USD',
        lang,
        false,
        {
            decimalPlaces: price >= 1 ? 2 : 15,
            significantFigures: price >= 1 ? 10 : 5,
        }
    );
}


export function removeHtmlTags(str: string): string {
    return str.replace(/<\/?[^>]+(>|$)/g, '');
}

export function daysSegmentation(days: number) {
    const year = Math.floor(days / 365);
    const month = Math.floor((days % 365) / 30);
    const day = days % 30;
    return { year: year, month: month, day: day };
}

export function getUniqueArray(arr) {
    const seen = new Set();
    return arr.filter((item) => {
        const serialized = JSON.stringify({
            id: item.id,
            name: item.name,
            symbol: item.symbol,
        });
        if (seen.has(serialized)) return false;
        seen.add(serialized);
        return true;
    });
}

export function removeFalsyValuesExceptZero(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value || value === 0) {
            acc[key] = value;
        }
        return acc;
    }, {});
}

export function formatPrice(price: number) {
    if (price === 0) return 0;

    if (price < 1) {
        const priceStr = price.toString();
        const [_, fractionPart] = priceStr.split('.');

        if (fractionPart) {
            let leadingZerosCount = 0;
            for (const digit of fractionPart) {
                if (digit === '0') {
                    leadingZerosCount++;
                } else {
                    break;
                }
            }
            const precision = leadingZerosCount + 3;
            return roundNumber(price, precision);
        }
    }
    return roundNumber(price, 2);
}

export function getAssetLink(market, lang, displayIds) {
    if (market === 'crypto')
        return `${getLinksLang(lang)}/coins/${displayIds[0]}`;
    else if (market === 'tse' || market === 'ticker')
        return `${getLinksLang(lang)}/ticker/${displayIds[0]}/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${displayIds[1]}`;

    return null;
}

