-- Verificar e corrigir tabela rona_users

-- 1. Verificar se a coluna password existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rona_users' 
        AND column_name = 'password'
        AND table_schema = 'public'
    ) THEN
        -- Adicionar coluna password se não existir
        ALTER TABLE rona_users ADD COLUMN password TEXT;
        RAISE NOTICE 'Coluna password adicionada à tabela rona_users';
    ELSE
        RAISE NOTICE 'Coluna password já existe na tabela rona_users';
    END IF;
END $$;

-- 2. Desabilitar RLS temporariamente para permitir inserções
ALTER TABLE rona_users DISABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view own data" ON rona_users;
DROP POLICY IF EXISTS "Users can insert own data" ON rona_users;
DROP POLICY IF EXISTS "Users can update own data" ON rona_users;
DROP POLICY IF EXISTS "Users can delete own data" ON rona_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON rona_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON rona_users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON rona_users;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON rona_users;

-- 4. Recriar políticas RLS mais permissivas
CREATE POLICY "Enable read access for all users" ON rona_users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON rona_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id" ON rona_users
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON rona_users
    FOR DELETE USING (true);

-- 5. Reabilitar RLS
ALTER TABLE rona_users ENABLE ROW LEVEL SECURITY;

-- 6. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'rona_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
