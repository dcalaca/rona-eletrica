// Script para testar a conexão com o Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!')
  console.log('Verifique se o arquivo .env.local contém:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...')
    
    // Teste 1: Verificar se as tabelas existem
    const { data: tables, error: tablesError } = await supabase
      .from('Rona_Settings')
      .select('*')
      .limit(1)
    
    if (tablesError) {
      console.error('❌ Erro ao conectar com Supabase:', tablesError.message)
      console.log('💡 Dica: Execute o script supabase-schema.sql no SQL Editor do Supabase')
      return
    }
    
    console.log('✅ Conexão com Supabase estabelecida!')
    
    // Teste 2: Verificar configurações
    const { data: settings, error: settingsError } = await supabase
      .from('Rona_Settings')
      .select('*')
    
    if (settingsError) {
      console.error('❌ Erro ao buscar configurações:', settingsError.message)
      return
    }
    
    console.log('✅ Configurações carregadas:', settings.length, 'itens')
    
    // Teste 3: Verificar categorias
    const { data: categories, error: categoriesError } = await supabase
      .from('Rona_Categories')
      .select('*')
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError.message)
      return
    }
    
    console.log('✅ Categorias carregadas:', categories.length, 'itens')
    
    // Teste 4: Verificar marcas
    const { data: brands, error: brandsError } = await supabase
      .from('Rona_Brands')
      .select('*')
    
    if (brandsError) {
      console.error('❌ Erro ao buscar marcas:', brandsError.message)
      return
    }
    
    console.log('✅ Marcas carregadas:', brands.length, 'itens')
    
    console.log('\n🎉 Todos os testes passaram! O Supabase está configurado corretamente.')
    console.log('\n📋 Próximos passos:')
    console.log('1. Acesse http://localhost:3000')
    console.log('2. Teste o catálogo de produtos')
    console.log('3. Teste o sistema de autenticação')
    console.log('4. Configure o Google OAuth e Mercado Pago')
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testConnection()
