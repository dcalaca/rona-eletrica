// Teste com nomes de tabelas em minúsculas
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLowercase() {
  try {
    console.log('🔍 Testando com nomes em minúsculas...')
    
    // Teste 1: Rona_Settings (maiúscula)
    console.log('\n1️⃣ Testando Rona_Settings (maiúscula)...')
    const { data: settingsUpper, error: settingsUpperError } = await supabase
      .from('Rona_Settings')
      .select('*')
      .limit(1)
    
    if (settingsUpperError) {
      console.log('❌ Rona_Settings (maiúscula):', settingsUpperError.message)
    } else {
      console.log('✅ Rona_Settings (maiúscula) OK!')
      console.log('Dados:', settingsUpper)
    }
    
    // Teste 2: rona_settings (minúscula)
    console.log('\n2️⃣ Testando rona_settings (minúscula)...')
    const { data: settingsLower, error: settingsLowerError } = await supabase
      .from('rona_settings')
      .select('*')
      .limit(1)
    
    if (settingsLowerError) {
      console.log('❌ rona_settings (minúscula):', settingsLowerError.message)
    } else {
      console.log('✅ rona_settings (minúscula) OK!')
      console.log('Dados:', settingsLower)
    }
    
    // Teste 3: rona_categories (minúscula)
    console.log('\n3️⃣ Testando rona_categories (minúscula)...')
    const { data: categories, error: categoriesError } = await supabase
      .from('rona_categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.log('❌ rona_categories (minúscula):', categoriesError.message)
    } else {
      console.log('✅ rona_categories (minúscula) OK!')
      console.log('Dados:', categories)
    }
    
    // Teste 4: rona_products (minúscula)
    console.log('\n4️⃣ Testando rona_products (minúscula)...')
    const { data: products, error: productsError } = await supabase
      .from('rona_products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.log('❌ rona_products (minúscula):', productsError.message)
    } else {
      console.log('✅ rona_products (minúscula) OK!')
      console.log('Dados:', products)
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testLowercase()
