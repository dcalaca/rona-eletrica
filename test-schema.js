// Teste para verificar diferentes schemas
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSchemas() {
  try {
    console.log('🔍 Testando diferentes schemas...')
    
    // Teste 1: Schema public (padrão)
    console.log('\n1️⃣ Testando schema public...')
    const { data: publicData, error: publicError } = await supabase
      .from('public.Rona_Settings')
      .select('*')
      .limit(1)
    
    if (publicError) {
      console.log('❌ Schema public:', publicError.message)
    } else {
      console.log('✅ Schema public OK!')
    }
    
    // Teste 2: Sem especificar schema
    console.log('\n2️⃣ Testando sem schema...')
    const { data: noSchemaData, error: noSchemaError } = await supabase
      .from('Rona_Settings')
      .select('*')
      .limit(1)
    
    if (noSchemaError) {
      console.log('❌ Sem schema:', noSchemaError.message)
    } else {
      console.log('✅ Sem schema OK!')
    }
    
    // Teste 3: Verificar se existe alguma tabela
    console.log('\n3️⃣ Testando tabela genérica...')
    const { data: genericData, error: genericError } = await supabase
      .from('auth.users')
      .select('*')
      .limit(1)
    
    if (genericError) {
      console.log('❌ Tabela auth.users:', genericError.message)
    } else {
      console.log('✅ Tabela auth.users OK! (conexão funcionando)')
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testSchemas()
