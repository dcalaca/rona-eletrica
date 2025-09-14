-- Primeiro, remover todas as políticas que dependem da coluna user_id
DROP POLICY IF EXISTS "Users can manage their own cart items" ON rona_cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON rona_cart_items;
DROP POLICY IF EXISTS "Users can view their own cart items" ON rona_cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON rona_cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON rona_cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON rona_cart_items;

-- Agora alterar o tipo da coluna user_id de text para UUID
ALTER TABLE rona_cart_items 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Adicionar campo is_wishlist se ainda não existir
ALTER TABLE rona_cart_items 
ADD COLUMN IF NOT EXISTS is_wishlist BOOLEAN DEFAULT FALSE;

-- Recriar as políticas RLS com o tipo correto
CREATE POLICY "Users can manage their own cart items" ON rona_cart_items
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_cart_items_wishlist ON rona_cart_items(user_id, is_wishlist);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON rona_cart_items(user_id);

-- Comentário explicativo
COMMENT ON COLUMN rona_cart_items.is_wishlist IS 'Indica se o item é da lista de desejos (true) ou do carrinho de compras (false)';
COMMENT ON COLUMN rona_cart_items.user_id IS 'ID do usuário proprietário do item (UUID)';
