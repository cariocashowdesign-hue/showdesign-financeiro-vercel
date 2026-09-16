# Financeiro Show Design — painel Vercel

App em Next.js que le a planilha-ponte da Showdesign (Google Sheets, id
`1ixmnftUoYgY-omo3-9VyyAddk9dlN9HJ8rEmjayUk8A`, aba "Dados") e mostra as
mesmas 4 paginas do site publicado (Home / Semanal / Diario / Eventos).

Sistema **100% separado** do painel da Atom — nunca le nem escreve nada
relacionado a Atom.

## O que falta para publicar

### 1. Criar uma conta de servico do Google (uma vez so)

1. Va em https://console.cloud.google.com/ e crie um projeto novo (ou use um
   que voce ja tenha).
2. Em "APIs e servicos" > "Biblioteca", ative a **Google Sheets API**.
3. Em "APIs e servicos" > "Credenciais" > "Criar credenciais" > "Conta de
   servico". De um nome (ex: `showdesign-painel`) e crie.
4. Na conta de servico criada, va em "Chaves" > "Adicionar chave" > "Criar
   nova chave" > formato **JSON**. Isso baixa um arquivo `.json` — guarde-o
   com cuidado, ele e uma credencial.
5. Abra esse arquivo `.json` e anote dois campos:
   - `client_email` (algo como `showdesign-painel@SEU-PROJETO.iam.gserviceaccount.com`)
   - `private_key` (um texto longo comecando com `-----BEGIN PRIVATE KEY-----`)

### 2. Compartilhar a planilha-ponte com a conta de servico

1. Abra a planilha "Planilha-Ponte — Financeiro Showdesign" no Google Drive
   (id `1ixmnftUoYgY-omo3-9VyyAddk9dlN9HJ8rEmjayUk8A`).
2. Clique em "Compartilhar" e adicione o `client_email` do passo anterior
   como **Leitor**.

### 3. Publicar no GitHub

No Terminal, dentro desta pasta:

```bash
cd ~/Documents/showdesign-financeiro-vercel
git init
git add .
git commit -m "Painel Vercel inicial - Financeiro Showdesign"
```

Crie um repositorio vazio no GitHub (site github.com, botao "New
repository" — sugestao de nome: `showdesign-financeiro-vercel`, pode ser
privado) e rode os comandos que o GitHub mostra na tela, algo como:

```bash
git remote add origin https://github.com/SEU-USUARIO/showdesign-financeiro-vercel.git
git branch -M main
git push -u origin main
```

### 4. Conectar na Vercel (sem precisar de CLI)

1. Va em https://vercel.com/new e faca login (ou crie conta) com sua conta
   do GitHub.
2. Clique em "Import" no repositorio `showdesign-financeiro-vercel`.
3. Em "Environment Variables", adicione:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = o `client_email` do passo 1
   - `GOOGLE_PRIVATE_KEY` = o `private_key` do passo 1 (cole o texto
     completo, incluindo as linhas BEGIN/END)
4. Clique em "Deploy". Em ~1 minuto o painel fica no ar, com uma URL tipo
   `showdesign-financeiro-vercel.vercel.app`.

A partir dai, todo `git push` para `main` publica uma nova versao
automaticamente.

## Rodando localmente (opcional)

```bash
cp .env.example .env.local
# edite .env.local com os valores reais da conta de servico
npm install
npm run dev
```

Abra http://localhost:3000
