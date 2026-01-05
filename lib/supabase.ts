import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhxticpmcdzbmnfblkuk.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseAnonKey) {
    console.warn('Supabase Anon Key missing (Required for server-side client).');
}

// Private client for server-side operations only
export const supabase = createClient(supabaseUrl, supabaseAnonKey || '');

