'use client';
import useSWR from 'swr';

export function useStopLossProfitTarget({ id, market }) {
    const { data, error, isLoading } = useSWR({
        absoluteUrl:
            market === 'tse'
                ? `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/ticker/${id}/stop_loss_and_profit_target`
                : `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/crypto/${id}/stop_loss_and_profit_target`,
        params: {
            id,
            market,
        },
    });

    return {
        stopLossProfitTarget: data,
        isLoading,
        error,
    };
}
