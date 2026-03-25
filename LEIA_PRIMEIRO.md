# STIN Sem Fronteiras — Guia de Deploy (hoje mesmo)

## O que você vai colocar no ar

1. **API da IA** no Vercel (recebe perguntas do Typebot e responde)
2. **Fluxo no Typebot** (botões, etapas, lógica de IA)
3. **Conexão Typebot → WhatsApp** (via Z-API ou Evolution API)

Tempo estimado: **30–45 minutos**

---

## PARTE 1 — API da IA no Vercel (15 min)

### Passo 1 — Criar conta no GitHub
Acesse github.com e crie uma conta gratuita se ainda não tiver.

### Passo 2 — Criar repositório
1. Clique em "New repository"
2. Nome: `stin-ssf-agent`
3. Deixe como "Public"
4. Clique "Create repository"

### Passo 3 — Subir o arquivo
1. Clique em "uploading an existing file"
2. Crie a pasta `api/` e suba o arquivo `chat.js` que está no ZIP
3. Clique "Commit changes"

### Passo 4 — Deploy no Vercel
1. Acesse vercel.com e faça login com o GitHub
2. Clique "Add New Project"
3. Selecione o repositório `stin-ssf-agent`
4. Clique "Deploy"

### Passo 5 — Adicionar a API Key
1. No projeto do Vercel, vá em **Settings → Environment Variables**
2. Adicione:
   - Name: `ANTHROPIC_API_KEY`
   - Value: sua chave (pegue em console.anthropic.com)
3. Clique "Save"
4. Vá em **Deployments** e clique "Redeploy"

### Passo 6 — Copiar sua URL
Você vai receber uma URL assim:
`https://stin-ssf-agent.vercel.app`

Guarde essa URL — vai precisar no Typebot.

---

## PARTE 2 — Fluxo no Typebot (15 min)

### Passo 1 — Criar conta
Acesse typebot.io e crie conta gratuita.

### Passo 2 — Importar o fluxo
1. No dashboard, clique em "Import a typebot"
2. Selecione o arquivo `ssf_typebot_flow.json` que está no ZIP
3. O fluxo completo já vai aparecer pronto com todos os botões

### Passo 3 — Configurar a URL da IA
1. No fluxo, localize o bloco **"IA — Perguntas fora do fluxo"**
2. Clique no bloco **Webhook**
3. Troque `https://SEU-APP.vercel.app/api/chat` pela sua URL real:
   `https://stin-ssf-agent.vercel.app/api/chat`
4. Salve

### Passo 4 — Configurar os links do Sympla
1. Busque todos os botões **"Garantir vaga agora"**
2. Troque o texto `LINK` pelo link real do Sympla
3. Você pode usar um bloco de "Redirect URL" do Typebot

### Passo 5 — Configurar o transbordo humano
1. Todos os botões "Falar com atendimento" devem redirecionar para um agente humano
2. No Typebot, use o bloco **"Transfer to human"** ou redirecione para o número do SDR

---

## PARTE 3 — Conectar ao WhatsApp (10 min)

### Opção A — Z-API (recomendado, mais simples)
1. Acesse z-api.io e crie conta (tem trial gratuito)
2. Crie uma instância
3. Escaneie o QR Code com o WhatsApp do número STIN
4. No Typebot: Settings → Integrations → WhatsApp
5. Cole o token do Z-API

### Opção B — Evolution API (open source, mais controle)
1. Acesse evolution-api.com
2. Siga o guia de instalação no servidor
3. Conecte ao Typebot via webhook

---

## PARTE 4 — Testar antes de publicar

1. No Typebot, clique em **"Preview"** — ele abre um simulador
2. Teste todos os caminhos:
   - Clicar em cada botão
   - Digitar uma pergunta fora do fluxo (ex: "posso parcelar?")
   - Verificar se a IA responde corretamente
3. Verifique se os links do Sympla abrem

---

## Fluxo de decisão dentro do Typebot

```
Mensagem chega
    ↓
É um botão do menu? → SIM → resposta pré-definida
    ↓ NÃO
Texto livre → vai para a IA (webhook /api/chat)
    ↓
IA responde
    ↓
routing = "human" → bloco Transfer to Human
routing = "lead"  → marcar como lead quente + oferecer inscrição
routing = "continue" → mostrar botões padrão
```

---

## Dúvidas frequentes

**O Typebot gratuito tem limite?**
Sim — 200 chats/mês no gratuito. Para volume maior, o Starter custa $39/mês.

**Preciso de número dedicado?**
Para WhatsApp Business API (Z-API), sim — um número que não seja seu pessoal.
Para o WhatsApp pessoal não funciona com bot.

**Posso usar o mesmo número que já uso?**
Sim, desde que seja um número de WhatsApp Business (não pessoal) e você escaneie o QR no Z-API.

**A IA vai lembrar de conversas anteriores?**
Cada mensagem é independente. Se quiser memória de sessão, me avise que configuro isso na API.

---

## Suporte

Se travar em algum passo, me manda onde parou e resolvo.
