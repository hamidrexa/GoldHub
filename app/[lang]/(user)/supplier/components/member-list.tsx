'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import { Label } from '@/components/ui/label';

type Props = {
    dict: any;
    lang: Locale;
};

type MemberRow = {
    id: string;
};

export default function MemberList({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [members, setMembers] = useState<MemberRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function fetchMembers() {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('talanow_broker_member_link')
                .select('member_id')
                .eq('broker_id', user.id);
            if (!mounted) return;
            if (error) setMembers([]);
            else {
                // Supabase join can return member_id as string or object; normalize to { id }
                const users = data
                    .map(item => item.member_id)
                    .filter(Boolean)
                    .flat();
                const rows = (users as any[]).map(u =>
                    typeof u === 'string' ? { id: u } : (u && u.id ? { id: u.id } : { id: String(u) })
                );
                setMembers(rows as MemberRow[]);
            }
            setLoading(false);
        }
        fetchMembers();
        return () => {
            mounted = false;
        };
    }, [user]);

    return (
        <div className="flex w-full flex-col gap-3">
            {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}
            {!loading && members.length === 0 && (
                <div className="text-sm text-gray-600">عضوی ثبت نشده است.</div>
            )}
            <div className="grid grid-cols-1 gap-3">
                {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 text-sm">
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Label>شناسه</Label>
                                <div>{m.id}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


