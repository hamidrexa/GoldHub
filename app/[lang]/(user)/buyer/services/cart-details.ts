'use client';
import useSWR from "swr";

export function useCardDetails() {
    const { data, error, isLoading } = useSWR({
        url: `/api/v1/gold_artifacts/cart_detail`,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        },
    });

    return {
        details: data,
        isLoading,
        error,
    };
}