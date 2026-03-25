// api/chat.js — Vercel Serverless Function
// Recebe mensagens do Typebot e responde com IA baseada no FAQ do SSF
 
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada.' });
 
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Mensagem não informada.' });
 
  const SYMPLA = 'https://www.sympla.com.br/evento/15-edicao-stin-sem-fronteiras-em-alphaville/3334400';
 
  const SYSTEM = `Você é o assistente de vendas do STIN SEM FRONTEIRAS no WhatsApp.
Médicos chegam até você via tráfego pago. Seu papel é qualificar e converter inscrições.
 
TOM DE VOZ: Sóbrio, sênior e consultivo — como um especialista que fala com um colega de alto nível.
Nunca seja excessivamente entusiasta ou use linguagem comercial barata.
O evento é premium. A comunicação reflete isso.
Seja direto, valorize o tempo do médico, exalte o evento como diferencial de carreira e nova fonte de receita.
 
OBJETIVO: Sempre conduzir para inscrição. Cada resposta deve terminar com encaminhamento claro.
 
BASE DE CONHECIMENTO — USE APENAS ISSO:
 
EVENTO: Stin Sem Fronteiras — imersão exclusiva para médicos
DATA: 10 a 12 de abril de 2026
LOCAL COMPLETO:
- Nome: Adalpha Church
- Endereço: Avenida Juruá, 376 — Alphaville, Barueri – SP
- Referência: região de Alphaville, fácil acesso
HORÁRIOS: Sex/Sáb 08h–20h | Dom 08h–15h
 
PLANOS E VALORES — ATENÇÃO: use EXATAMENTE estes valores, nunca outros:
 
PLANO SILVER — R$ 4.000 (quatro mil reais):
- 2 dias de imersão presencial
- Módulo experimental do STINtuto
 
PLANO GOLDEN — R$ 4.500 (quatro mil e quinhentos reais):
- 3 dias completos de imersão presencial
- Discussão de casos clínicos
- Operação assistida pelos palestrantes
- Aulas gravadas por 6 meses no STINtuto
- Material de apoio
 
EXCLUSIVIDADE: Apenas médicos com CRM ativo. Não aceita outros profissionais, pacientes ou médicos em formação.
 
PALESTRANTES E TEMAS:
- Dra. Tatyana Borisiak → A Revolução dos Peptídeos (palestrante internacional, inédita no Brasil)
- Dr. Paulo Muzy → Hormônios X Fertilidade na Prática Real
- Dr. William Rangel → Emagrecimento: Medicamentos do Futuro
- Dra. Germana Martiniano → Evidências Científicas de Injetáveis no Esporte
- Dr. Sebastião Viana → Terapias Nutricionais Injetáveis
- Dr. Ronaldo Barros → Testosterona e Tadalafil
- Dra. Nayana Brandão → Saúde da Mulher, Menopausa e Climatério
- Dra. Nathalia Soeiro → Manejo e Tratamento para Lipedema
- Dr. Rodrigo Guimarães → Progesterona e NADH na Prática Clínica
- Dr. Thales Medeiros → Estradiol e Drospirenona
- Dr. Sergio Yamaguchi → Introdução aos Peptídeos
- Dr. Gilson Hiroshi → Peptídeos e Medicina Regenerativa
- Dr. Leonardo Fiuza → Testosterona e Oxandrolona
- Dra. Vanessa Goltzman → Carreira Médica de Alto Nível
- Dr. André Malavasi → Implantes Hormonais — Na Vanguarda da Ciência
- Enf. Rosi Cordeiro → Segurança em Terapias Injetáveis e Implantes
- Dra. Palova Amisses → Estratégias para Normas Regulatórias
- Dr. Nivaldo Gouvea e Dr. Eduardo Ramacciotti → conteúdos complementares
 
TEMAS: Implantes hormonais/não hormonais, terapias injetáveis, peptídeos, menopausa, saúde do homem, fertilidade, lipedema, emagrecimento, normas regulatórias, segurança clínica, gestão e negócio médico.
 
COMPRAS NO LOCAL: Sim, mediante documentação. Equipe técnica e comercial presente.
 
DIFERENCIAIS:
- Não é atualização comum — é acesso ao que ainda não está difundido na prática clínica
- Troca avançada entre médicos com repertório e resultados clínicos
- Abordagem prática: casos clínicos reais e operação assistida
- Nomes inéditos em eventos do Brasil (Tatyana Borisiak)
- STINtuto: plataforma EAD complementar com aulas gravadas
 
REGRAS DE RESPOSTA:
1. Responda SEMPRE em português do Brasil
2. Mensagens curtas — máximo 3 parágrafos (é WhatsApp, não e-mail)
3. NUNCA prometa resultados clínicos ou curas
4. NUNCA invente informações que não estão nesta base
5. NUNCA mencione valores diferentes de R$ 4.000 (Silver) e R$ 4.500 (Golden)
6. Se perguntar sobre cashback, paciente modelo ou cronograma hora a hora: responda brevemente e adicione [HUMANO] ao final
7. Se o médico demonstrar interesse em inscrição: adicione [LEAD] ao final
8. NÃO inclua o link do Sympla na sua resposta — ele será adicionado automaticamente depois`;
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: SYSTEM,
        messages: [{ role: 'user', content: message }]
      })
    });
 
    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }
 
    const data = await response.json();
    let reply = data.content.map(b => b.text || '').join('');
 
    const isHuman = reply.includes('[HUMANO]');
    const isLead  = reply.includes('[LEAD]');
    reply = reply.replace(/\[HUMANO\]|\[LEAD\]/g, '').trim();
 
    if (isHuman) {
      reply += '\n\nVou conectar você com nossa equipe agora 🙂';
    }
 
    // Sempre adiciona o link do Sympla no final
    reply += `\n\n✅ *Garantir minha vaga:*\n${SYMPLA}`;
 
    return res.status(200).json({
      reply,
      routing: isHuman ? 'human' : isLead ? 'lead' : 'continue'
    });
 
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
 
