-- Script SQL per aggiungere sistema di ruoli a Memora
-- Esegui questo script in Supabase SQL Editor

-- 1. Aggiungi colonna role alla tabella profiles (se non esiste già)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'caregiver', 'healthcare'));

-- 2. Aggiungi colonna bio per descrizione profilo
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 3. Aggiungi colonna location per località
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- 4. Aggiungi colonna created_at se non esiste
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Commento per documentazione
COMMENT ON COLUMN profiles.role IS 'Ruolo utente: patient (paziente), caregiver (familiare), healthcare (operatore sanitario)';

-- 6. Indice per velocizzare query per ruolo
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- NOTA: I dati esistenti avranno role='patient' di default
-- Per cambiare il ruolo di un utente esistente:
-- UPDATE profiles SET role = 'caregiver' WHERE id = 'user_id';
-- UPDATE profiles SET role = 'healthcare' WHERE id = 'user_id';
