-- Script para ajustar as políticas RLS
-- Execute este script no SQL Editor do Supabase

-- Desabilitar RLS temporariamente para inserção de dados
ALTER TABLE rona_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE rona_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE rona_brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE rona_settings DISABLE ROW LEVEL SECURITY;

-- Ou criar políticas mais permissivas
-- DELETE FROM auth.policies WHERE table_name = 'rona_products';

-- Política para permitir leitura pública de produtos
-- CREATE POLICY "Products are viewable by everyone" ON rona_products FOR SELECT USING (is_active = true);

-- Política para permitir inserção de produtos (apenas para admins)
-- CREATE POLICY "Admins can insert products" ON rona_products FOR INSERT WITH CHECK (true);

-- Política para permitir atualização de produtos (apenas para admins)
-- CREATE POLICY "Admins can update products" ON rona_products FOR UPDATE USING (true);

-- Política para permitir exclusão de produtos (apenas para admins)
-- CREATE POLICY "Admins can delete products" ON rona_products FOR DELETE USING (true);
