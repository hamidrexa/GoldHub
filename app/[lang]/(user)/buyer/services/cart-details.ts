'use client';
import useSWR from "swr";
import Cookies from 'js-cookie';

export function useCardDetails() {
    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/cart_detail`,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });

    return {
        details: data,
        isLoading,
        error,
    };
}