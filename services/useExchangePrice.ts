import useSWR from 'swr';

export function useExchangePrice() {
    const { data, error, isLoading,isValidating } = useSWR(
        {
            url: '/v1/wallet/exchange/get_best_prices',
        },
        { refreshInterval: 5000}
        
    );
    return {
        price: data,
        error,
        isLoading,
        isValidating
    };
}
