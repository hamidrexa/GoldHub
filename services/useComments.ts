'use client';
import useSWR from "swr";

export function useComments({ entity , id }) {
    const { data, error, isLoading } = useSWR({
        url: `/api/comments/api::${entity}.${entity}:${id}`,
        params: {
            entity,
            id
        },
    });

    return {
        comments: data,
        isLoading,
        error,
    };
}