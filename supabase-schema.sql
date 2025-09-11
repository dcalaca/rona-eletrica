-- ========================================
-- RONA ELÉTRICA & HIDRÁULICA - BANCO DE DADOS
-- Todas as tabelas com prefixo "Rona_"
-- ========================================

-- 1. TABELA DE USUÁRIOS
CREATE TABLE Rona_Users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    gender VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE ENDEREÇOS
CREATE TABLE Rona_Addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES Rona_Users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'billing' CHECK (type IN ('billing', 'shipping')),
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE CATEGORIAS
CREATE TABLE Rona_Categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_id UUID REFERENCES Rona_Categories(id),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE MARCAS
CREATE TABLE Rona_Brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE PRODUTOS
CREATE TABLE Rona_Products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(50),
    category_id UUID REFERENCES Rona_Categories(id),
    brand_id UUID REFERENCES Rona_Brands(id),
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    weight DECIMAL(8,3),
    dimensions JSONB, -- {length, width, height}
    stock_quantity INTEGER DEFAULT 0,
    min_stock_quantity INTEGER DEFAULT 0,
    max_stock_quantity INTEGER,
    is_digital BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],
    specifications JSONB,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE IMAGENS DOS PRODUTOS
CREATE TABLE Rona_Product_Images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES Rona_Products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE AVALIAÇÕES
CREATE TABLE Rona_Product_Reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES Rona_Products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES Rona_Users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA DE CARRINHO
CREATE TABLE Rona_Cart_Items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES Rona_Users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES Rona_Products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 9. TABELA DE PEDIDOS
CREATE TABLE Rona_Orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES Rona_Users(id),
    vendor_id UUID REFERENCES Rona_Users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(50),
    payment_id VARCHAR(100),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    notes TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    tracking_code VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABELA DE ITENS DO PEDIDO
CREATE TABLE Rona_Order_Items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES Rona_Orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES Rona_Products(id),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABELA DE CUPONS DE DESCONTO
CREATE TABLE Rona_Coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2),
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. TABELA DE USO DE CUPONS
CREATE TABLE Rona_Coupon_Usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID REFERENCES Rona_Coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES Rona_Users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES Rona_Orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. TABELA DE VENDEDORES (RELACIONAMENTO)
CREATE TABLE Rona_Vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES Rona_Users(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. TABELA DE COMISSÕES
CREATE TABLE Rona_Commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id UUID REFERENCES Rona_Vendors(id) ON DELETE CASCADE,
    order_id UUID REFERENCES Rona_Orders(id) ON DELETE CASCADE,
    order_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. TABELA DE CONFIGURAÇÕES
CREATE TABLE Rona_Settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para usuários
CREATE INDEX idx_rona_users_email ON Rona_Users(email);
CREATE INDEX idx_rona_users_role ON Rona_Users(role);

-- Índices para produtos
CREATE INDEX idx_rona_products_category ON Rona_Products(category_id);
CREATE INDEX idx_rona_products_brand ON Rona_Products(brand_id);
CREATE INDEX idx_rona_products_sku ON Rona_Products(sku);
CREATE INDEX idx_rona_products_active ON Rona_Products(is_active);
CREATE INDEX idx_rona_products_featured ON Rona_Products(is_featured);

-- Índices para pedidos
CREATE INDEX idx_rona_orders_user ON Rona_Orders(user_id);
CREATE INDEX idx_rona_orders_vendor ON Rona_Orders(vendor_id);
CREATE INDEX idx_rona_orders_status ON Rona_Orders(status);
CREATE INDEX idx_rona_orders_created ON Rona_Orders(created_at);

-- Índices para carrinho
CREATE INDEX idx_rona_cart_user ON Rona_Cart_Items(user_id);

-- ========================================
-- DADOS INICIAIS
-- ========================================

-- Inserir configurações iniciais
INSERT INTO Rona_Settings (key, value, type, description, is_public) VALUES
('store_name', 'Rona Elétrica & Hidráulica', 'string', 'Nome da loja', true),
('store_description', 'Especializada em materiais elétricos e hidráulicos', 'string', 'Descrição da loja', true),
('store_phone', '(14) 99145-4789', 'string', 'Telefone da loja', true),
('store_email', 'contato@ronaeletrica.com.br', 'string', 'Email da loja', true),
('store_cnpj', '26.244.711/0001-03', 'string', 'CNPJ da loja', true),
('free_shipping_threshold', '200.00', 'number', 'Valor mínimo para frete grátis', false),
('default_currency', 'BRL', 'string', 'Moeda padrão', true),
('store_address', '{"street": "Rua das Ferramentas", "number": "123", "neighborhood": "Centro", "city": "São Paulo", "state": "SP", "zip_code": "01234-567"}', 'json', 'Endereço da loja', true);

-- Inserir categorias principais
INSERT INTO Rona_Categories (name, slug, description, is_active, sort_order) VALUES
('Fios e Cabos', 'fios-e-cabos', 'Fios e cabos elétricos de todas as bitolas', true, 1),
('Disjuntores', 'disjuntores', 'Disjuntores e dispositivos de proteção', true, 2),
('Tubos e Conexões', 'tubos-e-conexoes', 'Tubos PVC, PPR e conexões hidráulicas', true, 3),
('Ferramentas', 'ferramentas', 'Ferramentas elétricas e manuais', true, 4),
('Iluminação', 'iluminacao', 'Lâmpadas LED, luminárias e acessórios', true, 5),
('Bombas d''Água', 'bombas-dagua', 'Bombas centrífugas e pressurizadoras', true, 6);

-- Inserir marcas principais
INSERT INTO Rona_Brands (name, slug, is_active) VALUES
('Prysmian', 'prysmian', true),
('Schneider', 'schneider', true),
('Tigre', 'tigre', true),
('Bosch', 'bosch', true),
('Philips', 'philips', true),
('WEG', 'weg', true),
('Siemens', 'siemens', true),
('Legrand', 'legrand', true);

-- ========================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ========================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_rona_users_updated_at BEFORE UPDATE ON Rona_Users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_categories_updated_at BEFORE UPDATE ON Rona_Categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_brands_updated_at BEFORE UPDATE ON Rona_Brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_products_updated_at BEFORE UPDATE ON Rona_Products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_orders_updated_at BEFORE UPDATE ON Rona_Orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_coupons_updated_at BEFORE UPDATE ON Rona_Coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_vendors_updated_at BEFORE UPDATE ON Rona_Vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rona_settings_updated_at BEFORE UPDATE ON Rona_Settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE Rona_Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Products ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Product_Images ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Product_Reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Cart_Items ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Order_Items ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Coupon_Usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE Rona_Settings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (podem ser ajustadas conforme necessário)
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON Rona_Users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON Rona_Users FOR UPDATE USING (auth.uid()::text = id::text);

-- Produtos são públicos para leitura
CREATE POLICY "Products are viewable by everyone" ON Rona_Products FOR SELECT USING (is_active = true);

-- Carrinho é privado por usuário
CREATE POLICY "Users can manage own cart" ON Rona_Cart_Items FOR ALL USING (auth.uid()::text = user_id::text);

-- Pedidos são privados por usuário
CREATE POLICY "Users can view own orders" ON Rona_Orders FOR SELECT USING (auth.uid()::text = user_id::text);

-- Configurações públicas são visíveis para todos
CREATE POLICY "Public settings are viewable" ON Rona_Settings FOR SELECT USING (is_public = true);
