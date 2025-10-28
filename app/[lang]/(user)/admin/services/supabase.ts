import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncuxwtvkhpnriwsamqaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXh3dHZraHBucml3c2FtcWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTEzMTMsImV4cCI6MjA3NjY2NzMxM30.QjoyT6gYgLJaP_vcKf0xUyPXeJpmC3n8n9N3eWjv7DE';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});