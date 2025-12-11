'use client';
import useSWR from "swr";

export function useUsersKYCData() {
    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/users_data`,
        params: {
            page_size : 20,
        },
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        }
    });

    return {
        users: data?.results || [],
        isLoading,
        error,
    };
}