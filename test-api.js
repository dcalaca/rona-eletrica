// Teste das APIs
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAPI() {
  try {
    console.log('🔍 Testando APIs...')
    
    // Teste 1: Buscar produtos
    console.log('\n1️⃣ Testando busca de produtos...')
    const { data: products, error: productsError } = await supabase
      .from('rona_products')
      .select(`
        *,
        category: rona_categories(*),
        brand: rona_brands(*),
        images: rona_product_images(*)
      `)
      .eq('is_active', true)
      .limit(5)
    
    if (productsError) {
      console.error('❌ Erro ao buscar produtos:', productsError.message)
    } else {
      console.log('✅ Produtos encontrados:', products.length)
      products.forEach(product => {
        console.log(`  - ${product.name} (${product.sku}) - R$ ${product.price}`)
      })
    }
    
    // Teste 2: Buscar categorias
    console.log('\n2️⃣ Testando busca de categorias...')
    const { data: categories, error: categoriesError } = await supabase
      .from('rona_categories')
      .select('*')
      .eq('is_active', true)
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError.message)
    } else {
      console.log('✅ Categorias encontradas:', categories.length)
      categories.forEach(category => {
        console.log(`  - ${category.name} (${category.slug})`)
      })
    }
    
    // Teste 3: Buscar configurações
    console.log('\n3️⃣ Testando busca de configurações...')
    const { data: settings, error: settingsError } = await supabase
      .from('rona_settings')
      .select('*')
      .eq('is_public', true)
    
    if (settingsError) {
      console.error('❌ Erro ao buscar configurações:', settingsError.message)
    } else {
      console.log('✅ Configurações encontradas:', settings.length)
      settings.forEach(setting => {
        console.log(`  - ${setting.key}: ${setting.value}`)
      })
    }
    
    console.log('\n🎉 Teste das APIs concluído!')
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testAPI()
