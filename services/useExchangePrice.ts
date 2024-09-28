import useSWR from 'swr';

export function useExchangePrice() {
    const { data, error, isLoading } = useSWR(
        {
            url: '/v1/wallet/exchange/get_best_prices',
        },
        { refreshInterval: 1000 }
    );
    return {
        price: data,
        error,
        isLoading,
    };
}
