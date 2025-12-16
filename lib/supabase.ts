
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    // Only warn in dev, or handle graceful degradation
    console.warn('Supabase credentials missing.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
