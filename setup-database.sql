-- SQL Script per Setup Integrale Database Memora
-- Copia questo codice e incollalo in Supabase → SQL Editor → "New query"

-- 1. Tabella Utenti (Sincronizzazione Profili)
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Usiamo nome+cognome come ID per semplicità senza auth email
  name TEXT,
  surname TEXT,
  photo_url TEXT,
  last_online TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabella Messages (Chat in tempo reale)
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  text TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_id TEXT NOT NULL
);

-- 3. Tabella Posts (MemoraBook / Feed Social)
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT NOT NULL,
  author_photo TEXT,
  text TEXT,
  image TEXT,
  likes INT DEFAULT 0
);

-- ABILITA RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ABILITA REALTIME (Indispensabile per chat e feed live)
-- Nota: se ricevi errore qui, assicurati di aver selezionato il 'public' schema nelle impostazioni realtime di Supabase
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- POLICY PER MESSAGGI
CREATE POLICY "Public Messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- POLICY PER POST
CREATE POLICY "Public Posts" ON posts FOR ALL USING (true) WITH CHECK (true);

-- POLICY PER PROFILI
CREATE POLICY "Public Profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
