# 🚀 Guia de Configuração - Rona Elétrica & Hidráulica

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ Conta no Supabase
- ✅ Conta no Mercado Pago
- ✅ Conta no Google (para OAuth)

## 🔧 Configuração Passo a Passo

### 1️⃣ **Configurar Supabase**

1. **Acesse:** [supabase.com](https://supabase.com)
2. **Crie um novo projeto**
3. **Vá em SQL Editor**
4. **Cole o conteúdo do arquivo `supabase-schema.sql`**
5. **Execute o script** para criar todas as tabelas
6. **Anote as credenciais:**
   - Project URL
   - Anon Key
   - Service Role Key

### 2️⃣ **Configurar Google OAuth**

1. **Acesse:** [Google Cloud Console](https://console.cloud.google.com)
2. **Crie um novo projeto** ou selecione existente
3. **Ative a Google+ API**
4. **Vá em Credenciais > Criar Credenciais > OAuth 2.0**
5. **Configure:**
   - Tipo: Aplicação Web
   - URIs autorizados: `http://localhost:3000`
   - URIs de redirecionamento: `http://localhost:3000/api/auth/callback/google`
6. **Anote:**
   - Client ID
   - Client Secret

### 3️⃣ **Configurar Mercado Pago**

1. **Acesse:** [mercadopago.com.br](https://mercadopago.com.br)
2. **Crie uma conta** ou faça login
3. **Vá em Desenvolvedores > Suas integrações**
4. **Crie uma nova aplicação**
5. **Anote:**
   - Access Token
   - Public Key

### 4️⃣ **Configurar Variáveis de Ambiente**

1. **Crie o arquivo `.env.local`** na raiz do projeto
2. **Cole o conteúdo:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aleatoria

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_do_google
GOOGLE_CLIENT_SECRET=seu_client_secret_do_google

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_do_mercadopago
MERCADOPAGO_PUBLIC_KEY=sua_public_key_do_mercadopago

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5️⃣ **Instalar Dependências**

```bash
npm install
```

### 6️⃣ **Executar o Projeto**

```bash
npm run dev
```

## 🗄️ **Estrutura do Banco de Dados**

### **Tabelas Principais:**
- `Rona_Users` - Usuários do sistema
- `Rona_Products` - Produtos
- `Rona_Categories` - Categorias
- `Rona_Brands` - Marcas
- `Rona_Orders` - Pedidos
- `Rona_Order_Items` - Itens dos pedidos
- `Rona_Cart_Items` - Carrinho de compras
- `Rona_Product_Reviews` - Avaliações
- `Rona_Coupons` - Cupons de desconto
- `Rona_Vendors` - Vendedores
- `Rona_Commissions` - Comissões
- `Rona_Settings` - Configurações

### **Relacionamentos:**
- Usuários → Pedidos (1:N)
- Produtos → Categorias (N:1)
- Produtos → Marcas (N:1)
- Pedidos → Itens (1:N)
- Produtos → Avaliações (1:N)

## 🔐 **Sistema de Autenticação**

### **Roles de Usuário:**
- `customer` - Cliente
- `vendor` - Vendedor
- `admin` - Administrador

### **Proteção de Rotas:**
- `/admin/*` - Apenas administradores
- `/vendedor/*` - Apenas vendedores
- `/minha-conta/*` - Usuários autenticados

## 💳 **Sistema de Pagamento**

### **Métodos Suportados:**
- PIX
- Cartão de Crédito
- Cartão de Débito
- Boleto
- Transferência Bancária

### **Status de Pagamento:**
- `pending` - Pendente
- `paid` - Pago
- `failed` - Falhou
- `refunded` - Reembolsado

## 📊 **Painel Administrativo**

### **Funcionalidades:**
- ✅ CRUD de produtos
- ✅ Gestão de pedidos
- ✅ Relatórios de vendas
- ✅ Gestão de usuários
- ✅ Configurações da loja
- ✅ Gestão de estoque

### **Dashboard:**
- Métricas em tempo real
- Gráficos de vendas
- Alertas de estoque baixo
- Pedidos recentes

## 🛠️ **APIs Disponíveis**

### **Produtos:**
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/[id]` - Buscar produto
- `PUT /api/products/[id]` - Atualizar produto
- `DELETE /api/products/[id]` - Deletar produto

### **Pedidos:**
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/[id]` - Atualizar pedido

### **Autenticação:**
- `GET /api/auth/signin` - Página de login
- `GET /api/auth/signout` - Logout
- `GET /api/auth/callback/google` - Callback Google

## 🚀 **Deploy em Produção**

### **Vercel:**
1. Conecte o repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### **Variáveis de Ambiente (Produção):**
- Atualize `NEXTAUTH_URL` para sua URL de produção
- Atualize `NEXT_PUBLIC_APP_URL` para sua URL de produção
- Configure URIs de redirecionamento do Google

## 📱 **Funcionalidades Mobile**

- ✅ Design responsivo
- ✅ Touch-friendly
- ✅ PWA ready
- ✅ Offline support

## 🔍 **SEO e Performance**

- ✅ Meta tags dinâmicas
- ✅ Sitemap automático
- ✅ Imagens otimizadas
- ✅ Lazy loading
- ✅ Cache inteligente

## 🧪 **Testes**

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

## 📈 **Monitoramento**

- ✅ Vercel Analytics
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ User analytics

## 🆘 **Suporte**

### **Problemas Comuns:**

1. **Erro de conexão com Supabase:**
   - Verifique as credenciais
   - Confirme se o projeto está ativo

2. **Erro de autenticação:**
   - Verifique as configurações do Google OAuth
   - Confirme as URLs de redirecionamento

3. **Erro de pagamento:**
   - Verifique as credenciais do Mercado Pago
   - Confirme se está usando as chaves corretas

### **Logs:**
- Console do navegador
- Logs do Vercel
- Logs do Supabase

---

**🎉 Parabéns! Seu e-commerce está pronto para funcionar!**
