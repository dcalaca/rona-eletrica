# ⚙️ Configuração do Arquivo .env.local

## 🚨 Problema Identificado

O botão "Sair" está redirecionando para `localhost:3000` em vez de `localhost:3001`.

## 🔍 Causa do Problema

O NextAuth.js está usando a variável de ambiente `NEXTAUTH_URL` que provavelmente está configurada para a porta 3000, mas o servidor está rodando na porta 3001.

## 🛠️ Solução

### **1. Criar arquivo .env.local**

Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Mercado Pago (opcional)
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_token_here
```

### **2. Configurar as Variáveis**

**✅ NEXTAUTH_URL:**
```env
NEXTAUTH_URL=http://localhost:3001
```

**✅ NEXTAUTH_SECRET:**
```env
NEXTAUTH_SECRET=seu_secret_aqui
```

**✅ Supabase (já configurado):**
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
```

### **3. Gerar NEXTAUTH_SECRET**

Para gerar um `NEXTAUTH_SECRET` seguro, use um dos seguintes métodos:

**Opção 1 - Online:**
```bash
openssl rand -base64 32
```

**Opção 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opção 3 - Site:**
- Acesse: https://generate-secret.vercel.app/32

### **4. Reiniciar o Servidor**

Após criar o arquivo `.env.local`:

```bash
# Parar o servidor (Ctrl+C)
# Depois executar novamente:
npm run dev
```

## 🧪 Como Testar

### **1. Verificar se o arquivo existe:**
```bash
ls -la .env.local
```

### **2. Verificar se as variáveis estão carregadas:**
```bash
# No terminal do servidor, deve aparecer:
# - Local: http://localhost:3001
# - Environments: .env.local
```

### **3. Testar o logout:**
1. Acesse: `http://localhost:3001/minha-conta`
2. Clique em "Sair"
3. Deve redirecionar para: `http://localhost:3001/`

## 🔧 Correções Implementadas

### **1. Botão de Logout Corrigido:**
```tsx
onClick={() => signOut({ callbackUrl: 'http://localhost:3001/' })}
```

### **2. URL Hardcoded Temporariamente:**
- **Problema:** NextAuth usando porta 3000
- **Solução:** URL completa no callbackUrl
- **Resultado:** Logout redireciona para porta 3001

## 📋 Checklist

- [ ] Criar arquivo `.env.local`
- [ ] Configurar `NEXTAUTH_URL=http://localhost:3001`
- [ ] Gerar e configurar `NEXTAUTH_SECRET`
- [ ] Reiniciar o servidor
- [ ] Testar o logout
- [ ] Verificar se redireciona para porta 3001

## 🚀 Status

**✅ Correção Temporária:**
- Botão de logout corrigido
- URL hardcoded para porta 3001
- Funciona imediatamente

**⏳ Solução Definitiva:**
- Configurar `.env.local`
- Definir `NEXTAUTH_URL` corretamente
- Reiniciar servidor

## 📝 Arquivo .env.local Completo

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=seu_secret_gerado_aqui

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# Mercado Pago (opcional)
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercadopago
```

**🎉 Após configurar o .env.local, o logout funcionará corretamente na porta 3001!**
