# 🚀 Guia de Deploy - GitHub + Vercel

## 📋 Passo a Passo Completo

### 1️⃣ **Preparar o Projeto**

O projeto já está pronto! Temos:
- ✅ `.gitignore` configurado
- ✅ `README.md` completo
- ✅ Configurações do Next.js otimizadas
- ✅ Todas as informações da empresa atualizadas

### 2️⃣ **Criar Repositório no GitHub**

1. **Acesse:** [github.com](https://github.com)
2. **Clique em:** "New repository"
3. **Nome:** `rona-eletrica` (ou o que preferir)
4. **Descrição:** "E-commerce para Rona Elétrica & Hidráulica"
5. **Público** ou **Privado** (sua escolha)
6. **NÃO marque** "Add a README file" (já temos um)
7. **Clique:** "Create repository"

### 3️⃣ **Fazer Upload do Código**

#### **Opção A: Via GitHub Desktop (Mais Fácil)**
1. Baixe o [GitHub Desktop](https://desktop.github.com/)
2. Clone o repositório
3. Copie todos os arquivos do projeto para a pasta
4. Commit e Push

#### **Opção B: Via Terminal/CMD**
```bash
# Na pasta do projeto
git init
git add .
git commit -m "Primeira versão - Rona Elétrica & Hidráulica"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/rona-eletrica.git
git push -u origin main
```

### 4️⃣ **Deploy no Vercel**

1. **Acesse:** [vercel.com](https://vercel.com)
2. **Clique:** "Sign up" (use sua conta GitHub)
3. **Import Project:** Conecte seu repositório GitHub
4. **Configure:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (pasta raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. **Deploy:** Clique em "Deploy"

### 5️⃣ **Configurações Automáticas**

O Vercel vai:
- ✅ Instalar dependências automaticamente
- ✅ Fazer build do projeto
- ✅ Gerar URL de produção
- ✅ Configurar deploy automático

### 6️⃣ **URLs do Projeto**

Após o deploy, você terá:
- **URL de Produção:** `https://rona-eletrica.vercel.app`
- **URL Personalizada:** Pode configurar domínio próprio depois

## 🔧 **Comandos Úteis**

### **Desenvolvimento Local**
```bash
# Instalar dependências
npm install

# Executar localmente
npm run dev

# Ou usar o .bat
start-server.bat
```

### **Build para Produção**
```bash
# Fazer build
npm run build

# Executar versão de produção
npm start
```

## 📱 **Testando o Deploy**

1. **Acesse a URL** fornecida pelo Vercel
2. **Teste todas as páginas:**
   - ✅ Página inicial
   - ✅ Catálogo de produtos
   - ✅ Login/Cadastro
   - ✅ Área administrativa
   - ✅ Área do vendedor

## 🎯 **Próximos Passos**

### **Personalização**
- [ ] Configurar domínio próprio
- [ ] Adicionar Google Analytics
- [ ] Configurar email de contato
- [ ] Adicionar mais produtos

### **Funcionalidades Futuras**
- [ ] Integração com banco de dados
- [ ] Sistema de pagamento
- [ ] Autenticação real
- [ ] Painel administrativo completo

## 🆘 **Problemas Comuns**

### **Erro de Build**
- Verifique se todas as dependências estão instaladas
- Execute `npm run build` localmente primeiro

### **Imagens não Carregam**
- Verifique se as imagens estão na pasta `public/`
- Use caminhos relativos: `/imagem.jpg`

### **Deploy Falha**
- Verifique os logs no Vercel
- Confirme se o repositório está público (se necessário)

## 📞 **Suporte**

Se precisar de ajuda:
- **GitHub Issues:** Para problemas técnicos
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

**🎉 Parabéns! Seu site estará online em poucos minutos!**
