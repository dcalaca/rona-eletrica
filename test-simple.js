// Teste simples de conexão com Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testando conexão simples...')
console.log('URL:', supabaseUrl)
console.log('Key (primeiros 20 chars):', supabaseKey?.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSimple() {
  try {
    // Teste 1: Tentar acessar Rona_Settings diretamente
    console.log('\n1️⃣ Testando Rona_Settings...')
    const { data: settings, error: settingsError } = await supabase
      .from('Rona_Settings')
      .select('*')
      .limit(1)
    
    if (settingsError) {
      console.error('❌ Erro Rona_Settings:', settingsError.message)
      console.log('Código do erro:', settingsError.code)
      console.log('Detalhes:', settingsError.details)
    } else {
      console.log('✅ Rona_Settings OK!')
      console.log('Dados:', settings)
    }
    
    // Teste 2: Tentar acessar Rona_Categories
    console.log('\n2️⃣ Testando Rona_Categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('Rona_Categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.error('❌ Erro Rona_Categories:', categoriesError.message)
      console.log('Código do erro:', categoriesError.code)
    } else {
      console.log('✅ Rona_Categories OK!')
      console.log('Dados:', categories)
    }
    
    // Teste 3: Tentar acessar Rona_Products
    console.log('\n3️⃣ Testando Rona_Products...')
    const { data: products, error: productsError } = await supabase
      .from('Rona_Products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('❌ Erro Rona_Products:', productsError.message)
      console.log('Código do erro:', productsError.code)
    } else {
      console.log('✅ Rona_Products OK!')
      console.log('Dados:', products)
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testSimple()
