'use client';

import useSWR from 'swr';

export function useMostSearched() {
    const { data, error, isLoading } = useSWR({
        url: '/v2/search/most-searched-tags',
    });

    return {
        data: {
            ...data,
            tickers: [
                {
                    id: 10,
                    symbol: 'فملی',
                    href: '/ticker/IRO1MSMI0001/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-فملی',
                    image: 'https://sahmeto.com/ticker-images/%D9%81%D9%85%D9%84%DB%8C.jpg',
                },
                {
                    id: 20,
                    symbol: 'فارس',
                    href: '/ticker/IRO1PKLJ0001/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-فارس',
                    image: 'https://sahmeto.com/ticker-images/%D9%81%D8%A7%D8%B1%D8%B3.jpg',
                },
                {
                    id: 30,
                    symbol: 'خودرو',
                    href: '/ticker/IRO1IKCO0001/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-خودرو',
                    image: 'https://sahmeto.com/ticker-images/%D8%AE%D9%88%D8%AF%D8%B1%D9%88.jpg',
                },
                {
                    id: 40,
                    symbol: 'خساپا',
                    href: '/ticker/IRO1SIPA0001/نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-خساپا',
                    image: 'https://sahmeto.com/ticker-images/%D8%AE%D8%B3%D8%A7%D9%BE%D8%A7.jpg',
                },
            ],
            crypto: [
                {
                    id: 1,
                    symbol: 'بیت کوین',
                    href: '/coins/BTC',
                    image: 'https://cdn.sahmeto.com/media/cryptocurrencies/BTC/bitcoin.png',
                },
                {
                    id: 2,
                    symbol: 'اتریوم',
                    href: '/coins/ETH',
                    image: 'https://cdn.sahmeto.com/media/cryptocurrencies/ETH/ethereum.png',
                },
                {
                    id: 3,
                    symbol: 'نات کوین',
                    href: '/coins/NOT',
                    image: 'https://cdn.sahmeto.com/media/cryptocurrencies/NOT/1000020928.png',
                },
                {
                    id: 4,
                    symbol: 'شیبا',
                    href: '/coins/SHIB',
                    image: 'https://cdn.sahmeto.com/media/cryptocurrencies/SHIB/shiba-inu.png',
                },
            ],
        },
        isLoading,
        error,
    };
}
