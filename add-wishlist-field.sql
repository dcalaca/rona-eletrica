-- Adicionar campo is_wishlist à tabela rona_cart_items
ALTER TABLE rona_cart_items 
ADD COLUMN is_wishlist BOOLEAN DEFAULT FALSE;

-- Criar índice para melhor performance
CREATE INDEX idx_cart_items_wishlist ON rona_cart_items(user_id, is_wishlist);

-- Atualizar RLS para permitir operações na lista de desejos
DROP POLICY IF EXISTS "Users can manage their own cart items" ON rona_cart_items;
CREATE POLICY "Users can manage their own cart items" ON rona_cart_items
  FOR ALL USING (auth.uid()::text = user_id);

-- Comentário explicativo
COMMENT ON COLUMN rona_cart_items.is_wishlist IS 'Indica se o item é da lista de desejos (true) ou do carrinho de compras (false)';
