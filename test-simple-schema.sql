-- Script simplificado para testar
-- Execute este script primeiro no Supabase

-- 1. Criar tabela de configurações
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

-- 2. Inserir dados de teste
INSERT INTO Rona_Settings (key, value, type, description, is_public) VALUES
('store_name', 'Rona Elétrica & Hidráulica', 'string', 'Nome da loja', true),
('store_phone', '(14) 99145-4789', 'string', 'Telefone da loja', true);

-- 3. Criar tabela de categorias
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

-- 4. Inserir categorias de teste
INSERT INTO Rona_Categories (name, slug, description, is_active, sort_order) VALUES
('Fios e Cabos', 'fios-e-cabos', 'Fios e cabos elétricos de todas as bitolas', true, 1),
('Disjuntores', 'disjuntores', 'Disjuntores e dispositivos de proteção', true, 2),
('Tubos e Conexões', 'tubos-e-conexoes', 'Tubos PVC, PPR e conexões hidráulicas', true, 3);

-- 5. Criar tabela de produtos
CREATE TABLE Rona_Products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES Rona_Categories(id),
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inserir produto de teste
INSERT INTO Rona_Products (name, slug, description, sku, category_id, price, compare_price, stock_quantity, is_active, is_featured) 
SELECT 
    'Fio Flexível 2,5mm² 100m - Prysmian',
    'fio-flexivel-25mm-100m-prysmian',
    'Fio flexível de cobre nu, têmpera mole, isolação em PVC 70°C',
    'PRY-FLX-25-100',
    id,
    89.90,
    99.90,
    25,
    true,
    true
FROM Rona_Categories 
WHERE slug = 'fios-e-cabos' 
LIMIT 1;
