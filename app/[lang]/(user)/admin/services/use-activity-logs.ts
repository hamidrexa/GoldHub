'use client';
import useSWR from "swr";

export function useActivityLogs() {
    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/users_activity`,
        params: {
            page_size : 20,
        },
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        }
    });

    return {
        logs: data?.results || [],
        isLoading,
        error,
    };
}