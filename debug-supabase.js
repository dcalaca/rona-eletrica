// Script para debugar a conexão com o Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Debugando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key (primeiros 20 chars):', supabaseKey?.substring(0, 20) + '...')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugConnection() {
  try {
    console.log('\n1️⃣ Testando conexão básica...')
    
    // Teste 1: Verificar se consegue conectar
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .ilike('table_name', 'rona_%')
      .limit(10)
    
    if (error) {
      console.error('❌ Erro ao buscar tabelas:', error.message)
      return
    }
    
    console.log('✅ Conexão estabelecida!')
    console.log('📋 Tabelas encontradas:')
    data.forEach(table => {
      console.log(`  - ${table.table_schema}.${table.table_name}`)
    })
    
    console.log('\n2️⃣ Testando acesso direto às tabelas...')
    
    // Teste 2: Tentar acessar uma tabela específica
    const { data: settings, error: settingsError } = await supabase
      .from('Rona_Settings')
      .select('*')
      .limit(1)
    
    if (settingsError) {
      console.error('❌ Erro ao acessar Rona_Settings:', settingsError.message)
      console.log('💡 Possíveis causas:')
      console.log('  - Tabela não existe')
      console.log('  - Problema de permissão (RLS)')
      console.log('  - Schema incorreto')
    } else {
      console.log('✅ Rona_Settings acessível!')
      console.log('📊 Dados:', settings)
    }
    
    console.log('\n3️⃣ Testando outras tabelas...')
    
    // Teste 3: Tentar acessar categorias
    const { data: categories, error: categoriesError } = await supabase
      .from('Rona_Categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.error('❌ Erro ao acessar Rona_Categories:', categoriesError.message)
    } else {
      console.log('✅ Rona_Categories acessível!')
      console.log('📊 Dados:', categories)
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

debugConnection()
