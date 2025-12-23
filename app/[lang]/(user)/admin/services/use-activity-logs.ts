'use client';
import useSWR from "swr";

export function useActivityLogs(page?:number) {

    const params: Record<string, any> = {
        page_size: 10,
    };

    if (!!page) {
        params.page = page + 1;
    }

    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/users_activity`,
        params,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        }
    });

    return {
        logs: data?.results || [],
        count:data?.count,
        next:data?.next,
        previous:data?.previous,
        isLoading,
        error,
    };
}