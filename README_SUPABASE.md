# Configuração do Supabase para o TretaFlix

Este guia explica como configurar o banco de dados do Supabase para o projeto TretaFlix.

## Passo 1: Criar a Tabela no Supabase

Para criar a tabela `tretaflix` no Supabase, siga estes passos:

1. Acesse o dashboard do Supabase (https://app.supabase.com/)
2. Selecione seu projeto (URL: https://hemzlkistdwenjalvix.supabase.co)
3. No menu lateral, clique em "SQL Editor"
4. Clique em "New Query"
5. Copie e cole o conteúdo do arquivo `create_table_tretaflix.sql`
6. Clique em "Run" para executar o script

O script irá:
- Remover a tabela `tretaflix` se ela já existir
- Criar uma nova tabela `tretaflix` com todos os campos necessários
- Adicionar comentários para documentação
- Criar índices para melhorar a performance
- Desativar a segurança em nível de linha (RLS) para permitir acesso público
- Inserir alguns dados de exemplo
- Mostrar o conteúdo da tabela para confirmar que foi criada corretamente

## Passo 2: Configurar CORS

Para permitir que sua aplicação conecte-se ao Supabase:

1. No dashboard do Supabase, vá para "Project Settings" (ícone de engrenagem)
2. Selecione a aba "API"
3. Em "CORS (Cross-Origin Resource Sharing)", adicione:
   - `http://localhost:8080`
   - `http://192.168.1.8:8080` 
   - Qualquer outro domínio que você use para desenvolvimento ou produção

## Passo 3: Verificar Credenciais

Verifique se as credenciais no arquivo `.env` correspondem às do seu projeto:

1. No dashboard do Supabase, vá para "Project Settings" > "API"
2. Verifique se o URL do projeto corresponde a `VITE_SUPABASE_URL` no arquivo `.env`
3. Verifique se a chave anônima (anon key) corresponde a `VITE_SUPABASE_ANON_KEY` no arquivo `.env`

O arquivo `.env` deve conter:

```
VITE_SUPABASE_URL=https://hemzlkistdwenjalvix.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Solução de Problemas

### Erro de CORS

Se você receber erros de CORS:
- Verifique se configurou corretamente as origens permitidas nas configurações do projeto
- Certifique-se de que a URL exata que você está usando (incluindo protocolo, domínio e porta) está na lista de origens permitidas

### Erro de Credenciais

Se você receber erros de autenticação:
- Verifique se as credenciais no arquivo `.env` correspondem às do seu projeto
- Certifique-se de que a chave anônima não expirou

### Erro na Tabela

Se você receber erros relacionados à tabela:
- Verifique se o nome da tabela no código (`tretaflix`) corresponde ao nome da tabela no Supabase
- Verifique se todos os campos necessários existem na tabela

## Referências

- [Documentação do Supabase](https://supabase.com/docs)
- [SQL Editor do Supabase](https://supabase.com/docs/guides/database/sql-editor)
- [Autenticação do Supabase](https://supabase.com/docs/guides/auth) 