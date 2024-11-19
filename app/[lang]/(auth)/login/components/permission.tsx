'use client'

import { useGlobalContext } from "@/contexts/store";
import { getLinksLang } from "@/libs/utils";
import { redirect } from "next/navigation";

export default function Permission({ lang }) {
    const { user } =
        useGlobalContext();
    if (user)
        return redirect(`${getLinksLang(lang)}/profile`);
    return (
        <>
        </>
    )
}