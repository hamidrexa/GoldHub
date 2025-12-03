"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "@/services/supabase";
import { toast } from "react-toastify";

type BrokerListProps = {
    dict: any;
    lang: string;
};

type BrokerRecord = {
    id: string | number;
    broker_id?: string; // Added broker_id to match Supabase data
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    phone_number?: string;
    status?: string;
    url?: string;
    [key: string]: any;
};

const BrokerList = ({ dict }: BrokerListProps) => {
    const [brokers, setBrokers] = useState<BrokerRecord[]>([]);
    const [supabaseBrokers, setSupabaseBrokers] = useState<Record<string, BrokerRecord>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        async function fetchBrokers() {
            try {
                setLoading(true);
                setError(null);
                const token = Cookies.get("token");

                if (!token) {
                    throw new Error("توکن کاربر یافت نشد");
                }

                // Fetch primary broker list from API
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

                if (!active) return;

                const typedBrokers = (list as BrokerRecord[]) ?? [];
                setBrokers(typedBrokers);

                // Fetch brokers from Supabase
                const { data: supabaseData, error: supabaseError } = await supabase
                    .from("talanow_brokers")
                    .select("broker_id, username, first_name, last_name, email, phone_number, status");

                if (supabaseError) {
                    throw supabaseError;
                }

                if (!active) return;

                const supabaseMap = (supabaseData ?? []).reduce<Record<string, BrokerRecord>>((acc, broker) => {
                    acc[broker.broker_id] = {
                        id: broker.broker_id, // Ensure `id` is populated
                        ...broker,
                    };
                    return acc;
                }, {});

                setSupabaseBrokers(supabaseMap);
            } catch (err: any) {
                if (err?.name === "AbortError") return;
                setError(err?.message ?? "خطا در دریافت اطلاعات");
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchBrokers();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const handleCreatePage = async (broker: BrokerRecord) => {
        try {
            const { error } = await supabase.from("talanow_brokers").insert({
                broker_id: broker.id,
                username: broker.username,
                first_name: broker.first_name,
                last_name: broker.last_name,
                email: broker.email,
                phone_number: broker.phone_number,
            });

            if (error) {
                throw error;
            }

            toast.success("صفحه بروکر با موفقیت ساخته شد.");
        } catch (err) {
            console.error("Error creating broker page:", err);
            toast.error("خطا در ساخت صفحه بروکر.");
        }
    };

    const handleStatusToggle = async (brokerId: string | number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const { error } = await supabase
                .from("talanow_brokers")
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq("broker_id", brokerId);

            if (error) {
                throw error;
            }

            setSupabaseBrokers((prev) => ({
                ...prev,
                [String(brokerId)]: {
                    ...prev[String(brokerId)],
                    status: newStatus,
                },
            }));
        } catch (err) {
            console.error("Error updating broker status:", err);
        }
    };

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

    if (!brokers.length) {
        return <div className="text-sm text-[#5A5C83]">کارگزاری ثبت نشده است.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {brokers.map((broker) => {
                const supabaseBroker = supabaseBrokers[broker.id];

                return (
                    <div key={broker.id} className="rounded-md border border-gray-200 bg-white p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[#0C0E3C]">
                                    {broker.first_name} {broker.last_name}
                                </h3>
                                <div className="mt-1 text-sm text-[#5A5C83]">
                                    {broker.email && <p>{broker.email}</p>}
                                    {broker.phone_number && <p>{broker.phone_number}</p>}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[#0C0E3C]">
                                {supabaseBroker ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span>وضعیت:</span>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={supabaseBroker.status === "active"}
                                                    onChange={() => handleStatusToggle(broker.id, supabaseBroker.status)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                        <div>
                                            <a
                                                href={`talanow.ir/${supabaseBroker.username}`}
                                                className="text-blue-500 underline"
                                            >
                                                مشاهده صفحه
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleCreatePage(broker)}
                                        className="rounded bg-blue-500 px-4 py-2 text-white"
                                    >
                                        ساخت صفحه
                                    </button>
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
