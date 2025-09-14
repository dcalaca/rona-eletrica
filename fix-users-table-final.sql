-- Corrigir tabela rona_users - versão final

-- 1. Desabilitar RLS temporariamente
ALTER TABLE rona_users DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own data" ON rona_users;
DROP POLICY IF EXISTS "Users can insert own data" ON rona_users;
DROP POLICY IF EXISTS "Users can update own data" ON rona_users;
DROP POLICY IF EXISTS "Users can delete own data" ON rona_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON rona_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON rona_users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON rona_users;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON rona_users;
DROP POLICY IF EXISTS "Enable insert for all users" ON rona_users;

-- 3. Adicionar coluna password se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rona_users' 
        AND column_name = 'password'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE rona_users ADD COLUMN password TEXT;
        RAISE NOTICE 'Coluna password adicionada';
    ELSE
        RAISE NOTICE 'Coluna password já existe';
    END IF;
END $$;

-- 4. Criar políticas RLS permissivas
CREATE POLICY "Enable all operations for all users" ON rona_users
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Reabilitar RLS
ALTER TABLE rona_users ENABLE ROW LEVEL SECURITY;

-- 6. Verificar estrutura
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'rona_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
