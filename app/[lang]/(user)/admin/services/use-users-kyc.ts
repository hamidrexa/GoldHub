'use client';
import useSWR from "swr";
import Cookies from 'js-cookie';

export function useUsersKYCData(page?:number) {

    const params: Record<string, any> = {
        page_size: 10,
    };

    if (!!page) {
        params.page = page + 1;
    }

    const { data, error, isLoading,mutate } = useSWR({
        url: `/v1/gold_artifacts/users_data`,
        params,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        }
    });

    return {
        users: data?.results || [],
        count:data?.count,
        next:data?.next,
        previous:data?.previous,
        isLoading,
        error,
        mutate,
    };
}