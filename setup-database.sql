-- SQL Script per Setup Database Supabase
-- Copia questo codice e incollalo in Supabase → SQL Editor → "New query"

-- Tabella Messages (Chat)
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  text TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_id TEXT NOT NULL
);

-- Abilita Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere
DROP POLICY IF EXISTS "Allow public read" ON messages;
CREATE POLICY "Allow public read" ON messages 
  FOR SELECT USING (true);

-- Policy: tutti possono inserire
DROP POLICY IF EXISTS "Allow public insert" ON messages;
CREATE POLICY "Allow public insert" ON messages 
  FOR INSERT WITH CHECK (true);

-- Tabella Posts (Feed/Bacheca)
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  likes INT DEFAULT 0
);

-- Abilita Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere
DROP POLICY IF EXISTS "Allow public read" ON posts;
CREATE POLICY "Allow public read" ON posts 
  FOR SELECT USING (true);

-- Policy: tutti possono inserire
DROP POLICY IF EXISTS "Allow public insert" ON posts;
CREATE POLICY "Allow public insert" ON posts 
  FOR INSERT WITH CHECK (true);
