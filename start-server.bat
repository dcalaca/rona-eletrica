@echo off
echo ========================================
echo    RONA ELETRICA & HIDRAULICA
echo    CNPJ: 26.244.711/0001-03
echo    Fundada em: 27/09/2016
echo    Iniciando servidor de desenvolvimento
echo ========================================
echo.

echo Verificando se o Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo Verificando se as dependencias estao instaladas...
if not exist "node_modules" (
    echo Instalando dependencias...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor de desenvolvimento...
echo O servidor sera aberto em: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev

pause
