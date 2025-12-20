'use client';
import useSWR from "swr";
import Cookies from 'js-cookie';

export function useUsersKYCData() {
    const { data, error, isLoading,mutate } = useSWR({
        url: `/v1/gold_artifacts/users_data`,
        params: {
            page_size : 20,
        },
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        }
    });

    return {
        users: data?.results || [],
        count:data?.count,
        isLoading,
        error,
        mutate,
    };
}