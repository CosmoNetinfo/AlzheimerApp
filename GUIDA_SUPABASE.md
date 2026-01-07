# 🗄️ Configurazione Database Supabase

Ho già installato tutto il necessario nel progetto. Ora tocca a te creare il database!

## Passo 1: Crea il Progetto
1. Vai su **[database.new](https://database.new)** (si apre Supabase).
2. Fai login con **GitHub** (stesso account che usi per il codice).
3. Clicca **"New Project"**.
4. Compila:
   - **Name**: `AlzheimerApp`
   - **Database Password**: Scrivine una qualsiasi (salvala da qualche parte).
   - **Region**: Scegli quello più vicino (es. Frankfurt).
5. Clicca **"Create new project"** e aspetta 1-2 minuti.

## Passo 2: Copia le Chiavi Segrete
Una volta pronto il progetto:
1. Vai nella sezione **"Settings"** (ingranaggio nella sidebar).
2. Clicca su **"API"**.
3. Copia questi due valori:
   - **URL** (sotto "Project URL") → Es. `https://xxxxx.supabase.co`
   - **anon public** (sotto "Project API keys") → Chiave lunga che inizia con `eyJ...`

## Passo 3: Inserisci le Chiavi nel Progetto
1. Nel tuo progetto, apri il file **`.env.local`** (se non esiste, crealo nella cartella principale).
2. Incolla così:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...la_tua_chiave_qui
```

## Passo 4: Crea le Tabelle
1. In Supabase, vai su **"Table Editor"** (icona tabella nella sidebar).
2. Clicca **"Create a new table"** e crea:

### Tabella `messages`
- Nome: `messages`
- Spunta "Enable Row Level Security (RLS)"
- Colonne:
  - `id` (bigint, primary, auto-increment) ← già presente
  - `created_at` (timestamp) ← già presente
  - `text` (text)
  - `sender_name` (text)
  - `sender_id` (text)

### Tabella `posts`
- Nome: `posts`
- Spunta "Enable Row Level Security (RLS)"
- Colonne:
  - `id` (bigint, primary, auto-increment) ← già presente
  - `created_at` (timestamp) ← già presente
  - `author` (text)
  - `text` (text)
  - `likes` (int4, default: 0)

## Passo 5: Riavvia il Server
```bash
# Ferma il server (CTRL+C nel terminale)
# Poi riavvialo
npm run dev
```

✅ **Fatto!** Ora dimmi quando hai finito e ti mostro la chat funzionante!
