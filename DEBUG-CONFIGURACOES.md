# 🔧 Debug - Configurações da Conta

## 🚨 Problema Identificado

O botão "Salvar Alterações" na página de configurações não está salvando no banco de dados.

## 🔍 Análise do Problema

### **Possíveis Causas:**
1. **Sessão não ativa** - Usuário não está logado
2. **Dados vazios** - FormData não está sendo preenchido
3. **Validação de campos** - Campos não estão sendo comparados corretamente
4. **Erro na API** - Problema na comunicação com o banco

## 🛠️ Correções Implementadas

### **1. Validação de Dados**
- **Comparação de campos** - Só envia campos que foram alterados
- **Verificação de alterações** - Mostra mensagem se nenhuma alteração foi feita
- **Logs de debug** - Console.log para acompanhar o processo

### **2. Tratamento de Erros**
- **Error handling** - Captura e exibe erros na interface
- **Logs detalhados** - Console.log em cada etapa da API
- **Validação de sessão** - Verifica se usuário está logado

### **3. Melhorias na Interface**
- **Mensagens claras** - Feedback visual para o usuário
- **Estados de loading** - Spinner durante atualização
- **Validação visual** - Campos obrigatórios marcados

## 🧪 Como Testar

### **1. Acesse a Página**
```
http://localhost:3001/minha-conta/configuracoes
```

### **2. Faça Login**
- **Necessário** - Usuário deve estar logado
- **Verificação** - Se não estiver logado, será redirecionado

### **3. Teste os Campos**
- **Nome** - Altere o nome completo
- **Telefone** - Digite um telefone
- **CPF** - Digite um CPF (com máscara)
- **Data de Nascimento** - Selecione uma data
- **Gênero** - Escolha uma opção

### **4. Salve as Alterações**
- **Clique** em "Salvar Alterações"
- **Verifique** o console do navegador (F12)
- **Aguarde** a mensagem de sucesso

## 📊 Logs de Debug

### **No Console do Navegador (F12):**
```javascript
// Dados para atualizar: { name: "Novo Nome", phone: "(11) 99999-9999" }
```

### **No Terminal do Servidor:**
```bash
Sessão encontrada: usuario@email.com
Usuário encontrado: 123e4567-e89b-12d3-a456-426614174000
Dados recebidos: { name: "Novo Nome", phone: "(11) 99999-9999" }
Dados para atualizar: { name: "Novo Nome", phone: "(11) 99999-9999", updated_at: "2024-01-01T00:00:00.000Z" }
Executando atualização no banco...
Usuário atualizado com sucesso: 123e4567-e89b-12d3-a456-426614174000
```

## 🔍 Verificação de Problemas

### **1. Se não aparecer logs no console:**
- **Problema:** JavaScript não está executando
- **Solução:** Verificar se há erros no console

### **2. Se aparecer "Nenhuma alteração foi feita":**
- **Problema:** Campos não foram alterados
- **Solução:** Alterar pelo menos um campo

### **3. Se aparecer "Erro: Sessão não encontrada":**
- **Problema:** Usuário não está logado
- **Solução:** Fazer login primeiro

### **4. Se aparecer "Usuário não encontrado":**
- **Problema:** Usuário não existe no banco
- **Solução:** Verificar se o usuário foi criado corretamente

### **5. Se aparecer "Erro ao atualizar usuário":**
- **Problema:** Erro no banco de dados
- **Solução:** Verificar logs do Supabase

## 🚀 Próximos Passos

### **1. Teste Completo**
- [ ] Fazer login
- [ ] Alterar pelo menos um campo
- [ ] Clicar em "Salvar Alterações"
- [ ] Verificar mensagem de sucesso
- [ ] Verificar logs no console
- [ ] Verificar logs no terminal

### **2. Se ainda não funcionar**
- [ ] Verificar se há erros no console
- [ ] Verificar se há erros no terminal
- [ ] Verificar se o usuário existe no banco
- [ ] Verificar se a sessão está ativa

### **3. Verificação no Banco**
- [ ] Acessar o Supabase
- [ ] Verificar tabela `rona_users`
- [ ] Verificar se o usuário foi atualizado
- [ ] Verificar se os campos foram alterados

## 📝 Código de Debug

### **Frontend (components/settings-management.tsx):**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    setIsUpdating(true)
    setError(null)
    setSuccessMessage('')

    // Preparar dados para envio - apenas campos que foram alterados
    const dataToUpdate: UpdateUserData = {}
    
    if (formData.name && formData.name !== settings.name) {
      dataToUpdate.name = formData.name
    }
    // ... outros campos

    // Verificar se há dados para atualizar
    if (Object.keys(dataToUpdate).length === 0) {
      setSuccessMessage('Nenhuma alteração foi feita')
      return
    }

    console.log('Dados para atualizar:', dataToUpdate)
    await updateSettings(dataToUpdate)
    setSuccessMessage('Configurações atualizadas com sucesso!')
    setFormData({})
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    setError(error instanceof Error ? error.message : 'Erro ao atualizar configurações')
  } finally {
    setIsUpdating(false)
  }
}
```

### **Backend (app/api/user/settings/route.ts):**
```typescript
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('Erro: Sessão não encontrada')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log('Sessão encontrada:', session.user.email)
    
    // ... resto do código com logs
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações do usuário' },
      { status: 500 }
    )
  }
}
```

## ✅ Status

**🔧 Correções Implementadas:**
- ✅ Validação de dados melhorada
- ✅ Logs de debug adicionados
- ✅ Tratamento de erros melhorado
- ✅ Verificação de alterações implementada

**🧪 Próximos Passos:**
- [ ] Testar funcionalidade
- [ ] Verificar logs
- [ ] Confirmar salvamento no banco
- [ ] Remover logs de debug (se funcionando)
