import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.length > 0 &&
  supabaseUrl.includes('supabase.co') &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.length > 20

if (!isConfigured) {
  console.error(
    '[Memora] Configurazione Supabase mancante o non valida.\n' +
    'Controlla il file .env nella root del progetto:\n' +
    '  VITE_SUPABASE_URL=https://TUO_PROJECT.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=eyJhbGc... (chiave anon public da Supabase Dashboard > Settings > API)\n' +
    'Poi riavvia il server: npm run dev'
  )
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || '')
export const isSupabaseConfigured = () => isConfigured
