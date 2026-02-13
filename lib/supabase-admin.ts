import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Admin client needs the SERVICE ROLE KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
    console.warn('Supabase Service Role Key missing (Safe if on client, but this file should only be used on server).');
}

// Admin client for server-side operations (uploads, deletes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
