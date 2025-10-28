import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncuxwtvkhpnriwsamqaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXh3dHZraHBucml3c2FtcWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTEzMTMsImV4cCI6MjA3NjY2NzMxM30.QjoyT6gYgLJaP_vcKf0xUyPXeJpmC3n8n9N3eWjv7DE';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export type ContractRow = {
    id: string;
    user_id: string | number;
    type: 'type1' | 'type2';
    amount_rls: number; // amount in Rials (IRT * 10)
    guarantee_type: 'ملک' | 'چک' | 'سفته' | null;
    duration_months: number; // 1..12
    settlement_type: 'آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه';
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
};


