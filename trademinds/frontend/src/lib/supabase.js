import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const hasConfig = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasConfig) {
  console.warn(
    'TradeMinds: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and add your Supabase credentials.'
  )
} else if (import.meta.env.DEV && (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon'))) {
  console.warn(
    'TradeMinds: .env still has placeholder values. Replace with your real Supabase URL and anon key, then restart the dev server (Ctrl+C then npm run dev).'
  )
}

// Only create real client when configured; otherwise use a no-op so the app still renders
export const supabase = hasConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
        signUp: () => Promise.reject(new Error('Supabase not configured')),
        signOut: () => Promise.resolve(),
      },
      from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }) }),
    }