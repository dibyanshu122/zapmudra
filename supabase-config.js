/* =====================================================================
   ZAP MUDRA — Supabase Configuration
   Replace Firebase with Supabase for auth + database.
   ===================================================================== */

const SUPABASE_URL  = "https://gbckwmcmbcsigguwfkfo.supabase.co";
const SUPABASE_ANON = "sb_publishable_ltU697PRwMsa5nbVJRfpjA_wxx8vhjS";

// Initialize Supabase client (loaded via CDN in each HTML page)
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true   // needed for Google OAuth redirect
  }
});
