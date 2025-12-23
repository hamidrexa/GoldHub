'use client';
import useSWR from "swr";
import Cookies from 'js-cookie';

export function useUsersKYCData(page?: number, pageSize: number = 10) {
    const params: Record<string, any> = {
        page_size: pageSize,
    };

    if (page !== undefined) {
        params.page = page + 1;
    }

    const { data, error, isLoading, mutate } = useSWR({
        url: `/v1/gold_artifacts/users_data`,
        params,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });


    return {
        users: data?.results || [],
        count: data?.count,
        next: data?.next,
        previous: data?.previous,
        isLoading,
        error,
        mutate,
    };
}