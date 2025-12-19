import { createClient } from '@supabase/supabase-js';

// Hardcoded keys to ensure availability during Coolify build
const supabaseUrl = 'https://rhxticpmcdzbmnfblkuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoeHRpY3BtY2R6Ym1uZmJsa3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDUzNDUsImV4cCI6MjA4MTQyMTM0NX0.kqTyaBsp-6A3jLWHTjI3n03TC-okKctkhw-3xTlNdSE';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing.');
}

// Public client for client-side operations (read-only)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

