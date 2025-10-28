'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/[lang]/(user)/broker/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import { Label } from '@/components/ui/label';
import { GroupAvatar } from '@/components/group-avatar';

type Props = {
    dict: any;
    lang: Locale;
};

type MemberRow = {
    id: string;
    broker_id: string | number;
    user_id: string | number;
    phone_number?: string;
    first_name?: string;
    last_name?: string;
    created_at?: string;
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
                .from('broker_members')
                .select('*')
                .eq('broker_id', user.id)
                .order('created_at', { ascending: false });
            if (!mounted) return;
            if (error) setMembers([]);
            else setMembers((data || []) as MemberRow[]);
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
                        <div className="flex items-center gap-3">
                            <GroupAvatar name={`${m.first_name || ''} ${m.last_name || ''}`.trim() || m.phone_number || 'U'} />
                            <div className="flex flex-col">
                                <div className="font-medium">{`${m.first_name || ''} ${m.last_name || ''}`.trim() || '—'}</div>
                                <div className="text-xs text-[#5A5C83]">{m.phone_number || '—'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Label>شناسه</Label>
                                <div>{m.user_id}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


