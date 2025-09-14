// Script para adicionar produtos de teste
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function addTestProducts() {
  try {
    console.log('🔍 Adicionando produtos de teste...')
    
    // Primeiro, vamos buscar as categorias e marcas
    const { data: categories } = await supabase
      .from('rona_categories')
      .select('id, name')
      .eq('is_active', true)
    
    const { data: brands } = await supabase
      .from('rona_brands')
      .select('id, name')
      .eq('is_active', true)
    
    console.log('📋 Categorias disponíveis:', categories?.length || 0)
    console.log('📋 Marcas disponíveis:', brands?.length || 0)
    
    // Produtos de teste
    const testProducts = [
      {
        name: 'Fio Flexível 2,5mm² 100m - Prysmian',
        slug: 'fio-flexivel-25mm-100m-prysmian',
        description: 'Fio flexível de cobre nu, têmpera mole, isolação em PVC 70°C, antichama BWF-B, para 450/750V. Ideal para instalações elétricas residenciais e comerciais.',
        short_description: 'Fio flexível 2,5mm² 100m - Prysmian',
        sku: 'PRY-FLX-25-100',
        category_id: categories?.find(c => c.name === 'Fios e Cabos')?.id,
        brand_id: brands?.find(b => b.name === 'Prysmian')?.id,
        price: 89.90,
        compare_price: 99.90,
        stock_quantity: 25,
        min_stock_quantity: 10,
        is_active: true,
        is_featured: true,
        specifications: {
          'Seção': '2,5mm²',
          'Comprimento': '100 metros',
          'Material': 'Cobre nu',
          'Isolação': 'PVC 70°C',
          'Tensão': '450/750V',
          'Cor': 'Azul',
          'Norma': 'NBR NM 247-3'
        },
        features: [
          'Condutor de cobre nu têmpera mole',
          'Isolação em PVC antichama',
          'Flexibilidade para instalações',
          'Certificado pelo INMETRO',
          'Garantia de 5 anos'
        ]
      },
      {
        name: 'Disjuntor Bipolar 25A - Schneider',
        slug: 'disjuntor-bipolar-25a-schneider',
        description: 'Disjuntor bipolar 25A, curva C, para proteção de circuitos elétricos residenciais e comerciais.',
        short_description: 'Disjuntor bipolar 25A - Schneider',
        sku: 'SCH-DIS-25A',
        category_id: categories?.find(c => c.name === 'Disjuntores')?.id,
        brand_id: brands?.find(b => b.name === 'Schneider')?.id,
        price: 45.50,
        stock_quantity: 15,
        min_stock_quantity: 5,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Tubo PVC 32mm 6m - Tigre',
        slug: 'tubo-pvc-32mm-6m-tigre',
        description: 'Tubo de PVC rígido 32mm, 6 metros, para instalações hidráulicas e elétricas.',
        short_description: 'Tubo PVC 32mm 6m - Tigre',
        sku: 'TIG-PVC-32-6M',
        category_id: categories?.find(c => c.name === 'Tubos e Conexões')?.id,
        brand_id: brands?.find(b => b.name === 'Tigre')?.id,
        price: 12.90,
        stock_quantity: 50,
        min_stock_quantity: 20,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Furadeira de Impacto 650W - Bosch',
        slug: 'furadeira-impacto-650w-bosch',
        description: 'Furadeira de impacto 650W, ideal para furos em concreto, alvenaria e madeira.',
        short_description: 'Furadeira de impacto 650W - Bosch',
        sku: 'BOS-FUR-650W',
        category_id: categories?.find(c => c.name === 'Ferramentas')?.id,
        brand_id: brands?.find(b => b.name === 'Bosch')?.id,
        price: 189.90,
        compare_price: 229.90,
        stock_quantity: 8,
        min_stock_quantity: 3,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Lâmpada LED 12W Branco Frio - Philips',
        slug: 'lampada-led-12w-branco-frio-philips',
        description: 'Lâmpada LED 12W, branco frio, equivalente a 100W incandescente, vida útil de 25.000 horas.',
        short_description: 'Lâmpada LED 12W Branco Frio - Philips',
        sku: 'PHI-LED-12W',
        category_id: categories?.find(c => c.name === 'Iluminação')?.id,
        brand_id: brands?.find(b => b.name === 'Philips')?.id,
        price: 8.90,
        stock_quantity: 100,
        min_stock_quantity: 30,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Bomba Centrífuga 1/2CV - WEG',
        slug: 'bomba-centrifuga-12cv-weg',
        description: 'Bomba centrífuga 1/2CV, ideal para bombeamento de água limpa em residências e comércios.',
        short_description: 'Bomba Centrífuga 1/2CV - WEG',
        sku: 'WEG-BOM-12CV',
        category_id: categories?.find(c => c.name === 'Bombas d\'Água')?.id,
        brand_id: brands?.find(b => b.name === 'WEG')?.id,
        price: 299.90,
        stock_quantity: 5,
        min_stock_quantity: 2,
        is_active: true,
        is_featured: false
      }
    ]
    
    // Inserir produtos
    const { data: insertedProducts, error: insertError } = await supabase
      .from('rona_products')
      .insert(testProducts)
      .select('*')
    
    if (insertError) {
      console.error('❌ Erro ao inserir produtos:', insertError.message)
      return
    }
    
    console.log('✅ Produtos inseridos:', insertedProducts.length)
    insertedProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.sku}) - R$ ${product.price}`)
    })
    
    console.log('\n🎉 Produtos de teste adicionados com sucesso!')
    console.log('📱 Agora acesse http://localhost:3001 para ver os produtos!')
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

addTestProducts()
