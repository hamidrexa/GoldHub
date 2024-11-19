'use client'

import { useGlobalContext } from "@/contexts/store";
import { redirect } from "next/navigation";

export default function Permission() {
    const { user } =
        useGlobalContext();
    if (!user) return redirect('/login');
    return (
        <>
        </>
    )
}