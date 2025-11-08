"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

type BrokerListProps = {
    dict: any;
    lang: string;
};

type BrokerRecord = {
    id: string | number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    phone_number?: string;
    member_count?: number;
    [key: string]: any;
};

const BrokerList = ({ dict }: BrokerListProps) => {
    const [brokers, setBrokers] = useState<BrokerRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchBrokers() {
            try {
                setLoading(true);
                setError(null);
                const token = Cookies.get("token");

                if (!token) {
                    throw new Error("توکن کاربر یافت نشد");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/users/group_users?group_name=broker`,
                    {
                        signal: controller.signal,
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch brokers (${response.status})`);
                }

                const payload = await response.json();
                const list = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.results)
                        ? payload.results
                        : [];

                setBrokers(list as BrokerRecord[]);
            } catch (err: any) {
                if (err?.name === "AbortError") return;
                setError(err?.message ?? "خطا در دریافت اطلاعات");
            } finally {
                setLoading(false);
            }
        }

        fetchBrokers();

        return () => {
            controller.abort();
        };
    }, []);

    const brokerItems = useMemo(() => brokers ?? [], [brokers]);

    if (loading) {
        return <div className="text-sm text-[#5A5C83]">در حال بارگذاری لیست کارگزاران...</div>;
    }

    if (error) {
        return (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (!brokerItems.length) {
        return <div className="text-sm text-[#5A5C83]">کارگزاری ثبت نشده است.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {brokerItems.map((broker) => {
                const displayName = broker.full_name?.trim()
                    || `${broker.first_name ?? ""} ${broker.last_name ?? ""}`.trim()
                    || broker.email
                    || broker.id;

                return (
                    <div key={broker.id} className="rounded-md border border-gray-200 bg-white p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[#0C0E3C]">{displayName}</h3>
                                <div className="mt-1 text-sm text-[#5A5C83]">
                                    {broker.email && <p>{broker.email}</p>}
                                    {broker.phone_number && <p>{broker.phone_number}</p>}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[#0C0E3C]">
                                {typeof broker.member_count === "number" && (
                                    <div>
                                        {(dict?.admin?.members ?? "تعداد اعضا")}: {broker.member_count}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BrokerList;
