'use client';

import useSWR from 'swr';

interface Balance {
    irt_balance: string;
    btc_amount: string;
    btc_balance_irt: string;
    total_balance: string;
}

interface Asset {
    id: number;
    content_type: number;
    bookmarked_by_user: number | null;
    total_signals_count: number;
    name_fa: string;
    asset_id: number;
    coinmarketcap_id: number;
    name: string;
    symbol: string;
    description: string | null;
    is_active: boolean;
    image: string;
    price: number;
    yesterday_price: number | null;
    percent_change_7d: number;
    circulating_supply: string;
    volume_24h: string;
    market_cap: string;
    buy_signals_count: number | null;
    sell_signals_count: number | null;
    neutral_signals_count: number | null;
    updated: string;
    timestamp: string;
    asset: number;
    tags: any[];
}

interface WalletInfo {
    id: number;
    user: number;
    balance: Balance;
    updated_at: string;
    primary_username: string;
    asset: Asset;
}

export function useWalletInfo(): {
    wallet: WalletInfo;
    isLoading: boolean;
    error: Error | null;
    mutate: any;
} {
    const { data, error, isLoading, mutate } = useSWR({
        url: '/v1/wallet/',
    });

    return {
        wallet: data || [],
        isLoading,
        error,
        mutate,
    };
}
