'use client';
import useSWR from "swr";

export function useActivityLogs(page?: number, activity_type?:string, pageSize: number = 10) {
    const params: Record<string, any> = {
        page_size: pageSize,
    };

    if (page !== undefined) {
        params.page = page + 1;
    }
    if (activity_type !== undefined) {
        params.activity_type = activity_type;
    }

    const { data, error, isLoading } = useSWR({
        url: `/v1/gold_artifacts/users_activity`,
        params,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_TOKEN}`,
        },
    });


    return {
        logs: data?.results || [],
        count: data?.count,
        next: data?.next,
        previous: data?.previous,
        isLoading,
        error,
    };
}