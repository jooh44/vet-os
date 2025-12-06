<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>


***

# 📋 PRD - FRED Veterinary AI Platform v1.0

**Product Manager:** John (BMAD)
**Data:** 06 de Dezembro de 2025
**Status:** 🔄 EM DESENVOLVIMENTO
**Tipo:** Greenfield Full-Stack (MVP Web First)

***

## Document Control

| Item | Detalhes |
| :-- | :-- |
| Projeto | FRED - Sistema All-in-One para Veterinários com IA |
| Tipo | Greenfield Full-Stack |
| Plataforma MVP | Web (Next.js 14) |
| Stack Técnico | Next.js 14 + TypeScript + Tailwind + PostgreSQL + MinIO |
| Deploy | VPS Ubuntu (Hostinger) + Coolify |
| Timeline MVP | 3-6 meses (velocidade IA development) |
| Idioma | Português Brasil |
| Padrão Agenda | 1 hora (customizável onboarding) |


***

## 1. Visão do Produto

### Problema

Veterinários gastam 40-60 minutos/dia preenchendo prontuários manualmente, desconhecem estratégia competitiva local, e usam sistemas fragmentados (agenda ≠ histórico ≠ financeiro).

### Solução

**FRED** - sistema all-in-one que:

- ✅ Gera prontuários automáticos via IA (Whisper + GPT-4o)
- ✅ Monitora concorrentes continuamente (Gemini Grounding Search)
- ✅ Disponibiliza assistente AI 24/7 (FRED chat flutuante)
- ✅ Centraliza gestão (agenda, tutores, pets, histórico, equipe)
- ✅ Proporciona visão estratégica de mercado (Jornal do Fred diário)


### Diferencial Competitivo

**Primeiro sistema veterinário BR com gestão + IA + inteligência mercado integrados**

- SimplesVet: Gestão completa, SEM IA
- AtendeVet: IA prontuários, SEM gestão completa
- FRED: ✅ Gestão + ✅ IA + ✅ Inteligência Mercado

***

## 2. Personas \& Segmentação

### Persona Primária: Dra. Fernanda (Clínica Médio Porte)

- **Perfil:** Proprietária + Veterinária, 2-3 vets, R\$ 80-150k/mês
- **Dor Principal:** Perde tempo em burocracias (prontuários manuais)
- **Motivação:** Profissionalizar gestão + diferenciar competitivamente
- **Plano Alvo:** PROFESSIONAL (R\$ 199/mês)


### Persona Secundária: Dr. Carlos (Autônomo)

- **Perfil:** Solo, atendimento domiciliar, R\$ 25-40k/mês
- **Dor Principal:** Invisibilidade online vs concorrentes
- **Motivação:** Competir com clínicas grandes
- **Plano Alvo:** STARTER (R\$ 99/mês)

***

## 3. Requisitos Funcionais (MVP)

### 3.1 Gestão de Agenda

#### 3.1.1 Padrão Duração

- **Default:** 1 hora (todos eventos)
- **Customização:** Clínica define no onboarding
- **Flexibilidade:** Pode ajustar por veterinário (diferenças especialidade)


#### 3.1.2 Horário Funcionamento

- **Default:** 08:00 - 18:00 (seg-sex)
- **Customização:** Clínica define no onboarding (ex: sábado até 13h)
- **Bloqueios:** Feriados opcionais por região


#### 3.1.3 Gestão Conflitos \& Overbooking

- **Regra:** Sem conflitos por padrão
- **Opção:** Clínica ativa "Overbooking controlado" se desejar
    - Permite múltiplas consultas mesmo horário
    - Aviso visual quando ativado ("⚠️ Sobrecarga")
    - Limite customizável (ex: máx 2 consultas simultâneas)


#### 3.1.4 Visualização \& Navegação

- **Dia:** 24h com slots 1h cada
- **Semana:** 7 dias lado-a-lado
- **Mês:** Grid calendário
- **Cores:** Por veterinário (auto-assign, customizável)


#### 3.1.5 Criar/Editar Consulta

- **Modal criar:**
    - Pet (seleção existente ou "novo pet" rápido)
    - Data/hora (calendário picker)
    - Veterinário (dropdown ou auto-assign próximo disponível)
    - Tipo (rotina, urgência, retorno, etc - select)
    - Observações (textarea)
    - Tutor notificado? (checkbox - padrão SIM)
- **Modal editar:**
    - Todos campos acima editáveis
    - Se muda horário → notifica veterinário + tutor
    - Se tutor cancela → requer motivo (dropdown + textarea)
    - Auditoria: Registra quem editou, quando, o quê


#### 3.1.6 Cancelamento/Reagendamento

- **Quem pode:**
    - Veterinário: Cancela com justificativa (para tutor receber motivo)
    - Atendente: Cancela/reagenda com justificativa obrigatória
    - Tutor (via app Fase 2): Cancela/solicita reagendamento
- **Fluxo cancelamento:**

1. Clica "Cancelar" em consulta
2. Modal: "Motivo do cancelamento?" (dropdown + textarea)
        - No-show (tutor não apareceu)
        - Solicitação tutor (com observação)
        - Solicitação veterinário (com observação)
        - Emergência (com observação)
        - Outro (especificar)
3. Sistema notifica tutor (email + SMS + FRED se app)
4. Consulta vai para histórico com motivo registrado
- **Fluxo reagendamento:**

1. Atendente clica "Reagendar"
2. Modal: "Nova data/hora?" + "Motivo?" (opcional)
3. Tutor recebe notificação nova data
4. Histórico auditoria registra mudança


#### 3.1.7 Lembretes Automáticos (CRON)

- **1 dia antes:** Email + SMS para tutor ("Amanhã você tem consulta com [VET] em [VET]")
- **24h antes:** FRED floats notification (se logado)
- **1h antes:** Notificação FRED + email (último aviso)
- **Tutor pode:** Confirmar presença (botão na notificação) ou solicitar cancelamento/reagendamento


#### 3.1.8 Sincronismo Google Agenda (Fase 2)

- Exportar consultas para Google Agenda veterinário
- Bi-direcional: Se evento cria no Google → sincroniza FRED
- Configurável: Admin define se ativa por padrão

***

### 3.2 Cadastro Tutores \& Pets

#### 3.2.1 Tutor (Pessoa Física)

**Campos:**

- Nome completo (obrigatório)
- CPF (obrigatório, valida formato)
- Email (obrigatório, validação)
- Telefone (obrigatório, whatsapp? checkbox)
- Celular secundário (opcional)
- Endereço (rua, número, complemento, bairro, cidade, estado, CEP)
- Observações (campo livre para notas)
- Data criação (auto)
- Ativo? (toggle, permite "inativar" sem deletar)

**Validações:**

- CPF: Formato e algo básico (check dígito)
- Email: Padrão email válido
- Telefone: +55 (XX) 99999-9999 ou (XX) 9999-9999

**Duplicação:**

- Ao cadastrar, busca CPF/Email existentes
- Se encontra → aviso "Tutor já existe" com opção "Abrir perfil existente"


#### 3.2.2 Pet (Animal)

**Campos:**

- Nome (obrigatório)
- Espécie (select: Cão, Gato, Coelho, Hamster, Outro)
- Raça (texto, com busca/autocomplete se possível)
- Sexo (select: Macho, Fêmea)
- Data nascimento (date picker, calcula idade automática)
- Peso (input numérico + unidade kg/g)
- Pelagem/Cor (texto, ex: "Preto e branco")
- Castração (select: Sim, Não, Programado)
- Data castração (date picker se "Sim")
- Alergias conhecidas (textarea)
- Medicamentos contínuos (textarea)
- Observações gerais (textarea)
- Foto (upload, opcional - armazena MinIO)
- Data criação (auto)
- Ativo? (toggle)

**Validações:**

- Data nascimento: Não pode ser no futuro
- Peso: Positivo, racional (ex: 2.5 kg)
- Foto: .jpg, .png, max 5MB

***

### 3.3 Histórico Completo

#### 3.3.1 Timeline Cronológica

**Por pet, lista ordenada (mais recente primeiro):**

**Cada evento mostra:**

- 📅 Data + hora
- 👨‍⚕️ Veterinário responsável
- 📝 Tipo (Consulta, Vacina, Exame, Cirurgia, Medicamento, Outro)
- 🏷️ Título resumido (ex: "Vacinação anual", "Sutura remoção")
- ⭕ Ícone/cor diferente por tipo
- **Clique:** Expande detalhes (prontuário completo, receita, etc)

**Filtros:**

- Por tipo (Consulta/Vacina/Exame/Cirurgia)
- Por data (últimos 7 dias, 30 dias, 3 meses, tudo)
- Por veterinário


#### 3.3.2 Prontuários

- Exibição read-only ou edição (veterinário que fez pode editar 48h)
- Campos: Queixa, exame, diagnóstico, tratamento, medicamentos, retorno
- Data criação + última edição
- Versão prévia (se editado, mostra histórico de versões)


#### 3.3.3 Vacinas

- Lista com data aplicação, fabricante, lote, próxima dose
- Notificação automática 7 dias antes da próxima vacina
- Status: "Aplicada", "Programada", "Atrasada"
- Visível para tutor (via app) como "Carteirinha Digital"


#### 3.3.4 Exames \& Cirurgias

- Armazena resultado (texto ou upload PDF)
- Data solicitação + data resultado
- Visualização clara para comparação histórica

***

### 3.4 Gestão de Equipe \& Permissões

#### 3.4.1 Admin (Dono/Gerenciador)

- **Acesso:** TODOS dados (exceto programação sistema)
- **Ações:**
    - ✅ Criar/editar/deletar usuários (vets, atendentes)
    - ✅ Editar informações clínica (nome, logo, horários)
    - ✅ Visualizar relatórios (faturamento, uso sistema)
    - ✅ Acessar configurações FRED (farejador, notificações)
    - ❌ Logs auditoria (futuro Fase 2)


#### 3.4.2 Veterinário

- **Acesso:** Seus pacientes apenas
- **Ações:**
    - ✅ Visualizar agenda própria + pacientes
    - ✅ Criar/editar consultass próprias
    - ✅ Editar prontuários próprios (apenas os seus)
    - ✅ Gerar receitas
    - ❌ Editar prontuários de outros vets
    - ❌ Cancelar consulta (apenas justificar, admin cancela)
    - ✅ Usar FRED chat (acesso completo)
    - ✅ Ler Jornal do Fred


#### 3.4.3 Atendente

- **Acesso:** Agenda, tutores, pets (visualização)
- **Ações:**
    - ✅ Cadastrar novo tutor
    - ✅ Cadastrar novo pet
    - ✅ Agendar consultas (seleciona vet + data/hora)
    - ✅ Reagendar consultas (com motivo obrigatório)
    - ✅ Cancelar consultas (com motivo obrigatório)
    - ✅ Visualizar histórico (não edita)
    - ✅ Usar FRED chat (acesso básico: busca pacientes, lembretes)
    - ❌ Editar prontuários
    - ❌ Gerar receitas
    - ❌ Acessar Jornal do Fred (informação sensível)


#### 3.4.4 Fluxo Convite Usuário

1. Admin clica "Convidar usuário"
2. Modal: Email + Role (Vet/Atendente)
3. Sistema envia email com link (válido 7 dias)
4. Novo usuário clica link → Tela criação senha
5. Acesso ativado imediatamente

#### 3.4.5 Inativação Usuário

- Admin pode "inativar" sem deletar
- Usuário inativado não consegue logar
- Dados históricos permanecem acessíveis

***

### 3.5 Área do Tutor (Portal Cliente)

#### 3.5.1 Autenticação

- **Login:** Email + senha (criar durante onboarding ou tutor registra)
- **Recuperação:** Email password reset (link 24h válido)
- **2FA:** Opcional (implementar Fase 2)


#### 3.5.2 Dashboard Tutor

- **Pets do tutor:** Cards com foto, nome, próximos eventos
- **Próximas consultas:** Lista (próximas 30 dias)
- **Carteirinha digital:** Vacinas + exames (expandível)
- **Histórico:** Últimas consultas (read-only)


#### 3.5.3 Solicitações \& Aprovações

**Tutor pode:**

- ✅ Visualizar consultas agendadas
- ✅ Confirmar presença consulta (botão na notificação)
- ✅ Solicitar cancellamento/reagendamento (com motivo)
- ✅ Editar dados próprios (email, telefone, endereço)
- ❌ Cancelar diretamente (vai para fila aprovação veterinário)

**Fluxo solicitação:**

1. Tutor clica "Solicitar cancelamento"
2. Modal: "Motivo?" (textarea)
3. Notifica veterinário (via FRED chat)
4. Veterinário aprova/rejeita (modal com justificativa)
5. Tutor recebe resultado (email + notificação)

***

### 3.6 FRED Assistant (Chat Flutuante)

#### 3.6.1 Posicionamento \& Interação

- **Posição:** Canto inferior direito (fixo)
- **Minimizável:** Botão "-" fecha para icon flutuante
- **Expansível:** Clica icon → abre chat novamente
- **Ícone:** Logo FRED (mascote Digital Dog)
- **Status:** Online 24/7 (Gemini sempre disponível)


#### 3.6.2 Capacidades Principais

**A. Chat Geral (Gemini 2.5 Flash)**

- Responde dúvidas sobre FRED
- Responde dúvidas sobre procedimentos veterinários (com disclaimer legal)
- Context-aware: Sabe qual usuário, clínica, pacientes
- Histórico conversa persistente por sessão (não persiste entre logout)

**B. Lembretes Proativos**

- "Consulta Totó com Dra. Fernanda em 10min!" → botão "Ir para consulta"
- "Você tem 3 consultas hoje" → botão "Ver agenda"
- "Vacina Totó vence em 5 dias" → botão "Agendar vacina"

**C. Busca Natural Pacientes**

- "Qual o último exame do Rex?"
    - FRED busca pet "Rex" → mostra mini-ficha (idade, peso, alergias)
    - Expande histórico com botão "Ver completo"
    - Botões ação: "Agendar consulta", "Editar prontuário", "Gerar receita"
- "Pacientes da Dra. Maria hoje"
    - Lista agenda de hoje da Dra. Maria
    - Cada item clicável → abre detalhes consulta

**D. Botões Inteligentes (Quick Actions)**

- "Confirmar consulta" (para lembretes)
- "Reagendar consulta" (abre modal)
- "Gerar receita" (acesso rápido)
- "Enviar lembrete" (SMS/email tutor)
- "Editar prontuário" (abre editor)


#### 3.6.3 Gerenciamento Contexto \& Delírios

- **Context Window:** Mantém últimas 10 mensagens (evita token bloat)
- **Grounding:** Todas queries FRED buscam em DB primeiro (não alucinações)
- **Validação:** Se não encontra dado em DB → responde "Desculpe, não encontrei. Quer que eu [ação específica]?"
- **Logs:** Todas interações FRED logadas para auditoria


#### 3.6.4 Notificações FRED

- **Badge:** Número vermelho em caso de eventos urgentes
- **Sound:** Notificação sonora para lembretes (silenciável)
- **Desktop:** Notificação do browser (se permitido)
- **Email:** Sumário semanal FRED (opcional usuário)

***

### 3.7 IA Prontuários (Automaticamente Gerados)

#### 3.7.1 Upload Áudio Consulta

- **Opções:**
    - Gravar áudio direto (Fase 2: microfone no navegador)
    - Upload arquivo (.mp3, .wav, .m4a, .ogg, .webm - qualquer formato celular)
- **Limite:** 50MB, máximo 60 minutos
- **Processamento:** Assincron (notifica quando pronto, ~2-5min para 60min áudio)


#### 3.7.2 Transcrição (Whisper API)

- **Input:** Áudio (.mp3, .wav, .m4a, .ogg, .webm)
- **Output:** Texto bruto (português Brasil)
- **Precisão:** 95%+ (Whisper modelo large)
- **Fallback:** Se erro → salva áudio, notifica admin, deixa para retry manual
- **Retry:** Pode tentar novamente upload mesmo áudio ou arquivo diferente


#### 3.7.3 Geração Prontuário (GPT-4o)

**Input:** Transcrição + contexto (nome pet, histórico anterior)

**Prompt customizado:** Extrair informações veterinárias críticas:

- Motivo consulta / Queixa principal
- Sintomas relatados
- Exame físico (temperatura, peso, estado geral, etc)
- Diagnóstico preliminar
- Diagnóstico diferencial (se houver)
- Exames solicitados
- Medicamentos prescritos (nome, dose, frequência, duração)
- Orientações para tutor
- Data retorno sugerida
- Observações adicionais

**Output:** JSON estruturado → Formulário pré-preenchido

#### 3.7.4 Editor Prontuário

- **Veterinário confirma:** Clica em cada campo
    - ✅ Correto → marca checado
    - ❌ Incorreto → edita manualmente
    - ❌ Não aplicável → remove campo
- **Validações:**
    - Mínimo 1 campo preenchido
    - Diagnóstico obrigatório
    - Se exame solicitado → data retorno obrigatória
- **Assinatura:** Veterinário assina digitalmente (data + nome + CRM)


#### 3.7.5 Salvar \& Armazenamento

- Prontuário salvo em histórico pet
- PDF gerado (para impressão/arquivo)
- Visibilidade: Apenas veterinário que fez (48h para editar), admin, tutor via app Fase 2

***

### 3.8 Receituários (Geração Rápida)

#### 3.8.1 Templates Receita

- **Simples:** Medicamentos contínuos (título, medicamentos, dosagem, duração)
- **Controlada:** Antibióticos, anti-inflamatórios (mesma estrutura + aviso legal)
- **Especial:** Controlados Portaria 344 ANVISA (com campos extras: nº receita, CRM veterinário)
- **Atestado:** Cirurgias, viagens (campos: procedimento, data, repouso dias)


#### 3.8.2 Fluxo Geração

1. Veterinário clica "Gerar receita" (durante prontuário ou consulta)
2. Modal template selection (4 opções)
3. Pre-preenche medicamentos do prontuário
4. Veterinário confirma/edita
5. Assinatura digital (data, nome, CRM)
6. Gera PDF + salva histórico
7. Tutor recebe via email (+ SMS se preferir, Fase 2)

#### 3.8.3 Campos Receita

**Sempre incluir:**

- Data emissão
- Nome tutor
- Endereço tutor
- Nome pet + espécie + raça
- Medicamentos (nome, laboratório, dose, frequência, duração)
- Orientações (tome com alimento, efeitos colaterais, etc)
- Retorno sugerido
- Assinatura veterinário (digital)
- CRM veterinário + Estado
- Data validade receita (30 dias padrão)

***

### 3.9 Farejador de Mercado (Inteligência Concorrentes)

#### 3.9.1 Onboarding Farejador

**Primeira vez acesso:**

1. **Tela 1: "Vamos localizar sua clínica"**
    - Input: Nome da clínica/médico
    - Input: Cidade
    - Input: Bairro
    - Botão: "Confirmar localização"
2. **Tela 2: Confirmação**
    - Mostra resultado Google Maps (foto, endereço, nota)
    - "É este lugar?" → Sim/Não
    - Se Não → volta para Tela 1 com sugestão próxima
    - Se Sim → FRED busca concorrentes próximos (até 5km raio)
3. **Tela 3: Seu Perfil + Mercado**
    - Card você (nome, endereço, nota Google, foto, links redes)
    - Seção: "Concorrentes próximos" (até 5, ordenados distância)
    - Cada card concorrente: Nome, endereço, nota, links (clicáveis)

#### 3.9.2 Coleta Dados Concorrentes

**Por concorrente, coleta:**

- ✅ Nome da clínica
- ✅ Endereço (com geocoding para distância)
- ✅ Telefone(s)
- ✅ Site (se houver)
- ✅ Instagram (handle + número followers)
- ✅ Facebook (nome página + número likes)
- ✅ LinkedIn (URL perfil empresa)
- ✅ Google (URL Google Maps + nota média + total reviews)
- ✅ Horário funcionamento (if encontrado)
- ✅ Serviços listados (if encontrado)
- ✅ Preços (if público em site/redes)
- ✅ Foto perfil/capa (thumbnail armazenado)

**Fonte:** Google Gemini Grounding Search (acessa web públicos em tempo real)

#### 3.9.3 Jornal do Fred (CRON Diário)

**CRON executado:** 06:00 AM daily (horário clínica)

**Relatório inclui:**

**Seção 1: Seu Negócio**

- Resumo: "Você está em [bairro], com [nota] nota no Google"
- Status: "[X] clientes novos agendaram", "[Y] consultas completas"

**Seção 2: Novidades Mercado Local**

- "3 novas clínicas registradas no seu raio de 5km nos últimos 7 dias"
- "2 concorrentes subiram avaliação (+0.3 pontos)"
- "Clínica X ficou trending em Instagram (1.2k likes último post)"

**Seção 3: Insights Concorrentes (Top 3 Monitorados)**
Per concorrente:

- "Concorrente A: Último post Instagram 2 dias atrás (60 likes, 12 comentários)"
- "Concorrente B: Nota Google mudou de 4.5 → 4.6 (novo review: '5⭐ Excelente atendimento')"
- "Concorrente C: Website atualizado - agora oferece telemedicina"

**Seção 4: Oportunidades \& Ações Sugeridas**

- "3 clientes deixaram review negativo para Concorrente X - considere campanha de vacinas"
- "Nenhum concorrente próximo oferece serviço [X] - oportunidade de diferenciação"
- "Sua nota Google está 0.2 pontos abaixo da média da região - solicite reviews"

**Formato:** Email formatado + disponível no dashboard FRED (abrir qualquer momento)

#### 3.9.4 Monitoramento Customizado

**Usuário pode:**

- Adicionar concorrentes específicos (não só próximos)
- Adicionar redes sociais não detectadas (Instagram, LinkedIn extras)
- Selecionar concorrentes para "monitoramento intensivo" (notificação imediata se mudança)
- Notas privadas por concorrente (ex: "Seu maior rival", "Referência boas práticas")

**Dashboard:**

- Lista todos concorrentes monitorados
- Última atualização
- Últimas 5 novidades
- Gráfico evolução nota Google (30 dias)
- Comparativo: Sua nota vs média concorrentes

***

## 4. Requisitos Não-Funcionais

### 4.1 Performance

- **PageSpeed:** >85 mobile, >90 desktop (Lighthouse)
- **LCP (Largest Contentful Paint):** <2.5s
- **FCP (First Contentful Paint):** <1.8s
- **CLS (Cumulative Layout Shift):** <0.1
- **TTFB (Time to First Byte):** <600ms
- **Total page size:** <2MB (images optimized WebP)

**Otimizações:**

- Code splitting Next.js (lazy load por rota)
- Image optimization (WebP, AVIF, srcset)
- Caching (browser, CDN Cloudflare futuro)
- Database indexes (PostgreSQL composite indexes)
- API response time: <200ms (p95)


### 4.2 Escalabilidade

- **Suportar:** 100+ clientes, 1.000+ consultas/dia no MVP
- **Database:** PostgreSQL com connection pooling (max 50 connections)
- **Storage:** MinIO escalável (adicionar nodes se necessário)
- **API:** Next.js pode escalar horizontalmente (múltiplas instâncias via Coolify load balancer)


### 4.3 Disponibilidade \& Uptime

- **Alvo:** 99.5% uptime (permitir ~3.6 horas downtime/mês)
- **Monitoramento:** Sentry (erros), UptimeRobot (health checks)
- **Alertas:** Email/Telegram se downtime > 5 minutos
- **Backup:** Diário (PostgreSQL + MinIO) → Backblaze B2
- **Restore:** Testado mensalmente (documentado)


### 4.4 Segurança

#### 4.4.1 Autenticação \& Autorização

- **Auth:** NextAuth.js (JWT + opcional OAuth Google)
- **Password:** Hash bcrypt, min 8 chars, complexity rules
- **Session:** Token válido 24h, refresh token para renewals
- **RBAC:** 3 roles (Admin, Vet, Atendente) com permissions granulares
- **2FA:** Opcional (Fase 2) - TOTP app


#### 4.4.2 Dados em Trânsito

- **HTTPS:** Obrigatório (Let's Encrypt via Coolify)
- **TLS:** 1.2+ (cipher suites fortes)
- **HSTS:** Max-age 31536000s (1 ano)


#### 4.4.3 Dados em Repouso

- **Database:** PostgreSQL encryption at rest (dm-crypt VPS)
- **Files:** MinIO encryption (s3-encryption headers)
- **Secrets:** Environment variables (não hardcoded, .env.local não commitado)


#### 4.4.4 CSRF \& XSS Protection

- **CSRF:** Tokens automáticos (NextAuth fornece)
- **XSS:** Content-Security-Policy header (script-src 'self' trusted origins)
- **Input validation:** Zod schemas em todas API routes
- **Output encoding:** React escape automático, innerHTML evitado


#### 4.4.5 Rate Limiting

- **Nginx:** 100 req/min por IP (brute-force protection login)
- **API:** 1.000 req/hora por user (por token JWT)
- **Whisper/GPT-4o:** Quotas por plan (50/mês starter, 200 pro, ilimitado enterprise)


#### 4.4.6 Logs \& Auditoria

- **Logs críticos:** Login, logout, criação/edição/deleção usuário
- **Logs prontuário:** Quem visualizou/editou, quando, o quê
- **Retenção:** 90 dias em database, 1 ano offsite
- **Acesso logs:** Apenas admin + auditador designado (Fase 2)


#### 4.4.7 LGPD Compliance

- **Consentimento:** Termo aceite obrigatório no signup
- **Dados sensíveis:** CPF, endereço (criptografia)
- **ROPA:** Registro Operações Processamento Dados (internamente mantido)
- **Direito esquecimento:** Script delete_user (deleta dados, mantém anônimo histórico se necessário legal)
- **Portabilidade:** Exportar JSON dados usuário (Fase 2)
- **Notificação breach:** Plano resposta se vazamento (processo documentado)


### 4.5 Conformidade \& Regulação

#### 4.5.1 Prontuários Veterinários

- **Legislação:** CFMV (Conselho Federal Medicina Veterinária)
- **Requisitos:**
    - Identificação veterinário responsável (CRM obrigatório)
    - Assinatura digital (data + nome + CRM)
    - Inalterabilidade histórico (não apagar, apenas adicionar)
    - Retenção mínima: 5 anos (após última consulta)


#### 4.5.2 Prescrições (Receitas)

- **Validade:** 30 dias (padrão ANVISA)
- **Medicamentos controlados:** Campos extras (CRM vet, nº receita sequencial)
- **Armazenamento:** Permanente (sujeito regulação)


#### 4.5.3 Dados Pessoais Tutor

- **Proteção:** LGPD compliance (acima)
- **Acesso:** Tutor acessa dados própios e pets
- **Retenção:** 2 anos após última interação (depois anonimiza)


### 4.6 Acessibilidade (WCAG 2.1 AA)

#### 4.6.1 Elementos Mínimos

- **Contraste:** 4.5:1 normal text, 3:1 large text
- **Navegação teclado:** Tab, Shift+Tab, Enter (sem mouse)
- **Focus visível:** Outline/background em focados
- **Labels:** Inputs com `<label for>` ou aria-label
- **Alt text:** Todas imagens (descritivo, não "foto" apenas)

```
- **Semantic HTML:** Heading hierarchy (h1→h2→h3), `<main>`, `<nav>`
```


#### 4.6.2 Forms

- **Erros:** Mensagens claras, campo destacado
- **Help text:** Abaixo input, associado aria-describedby
- **Placeholder:** Apenas exemplo (não remove label)
- **Required:** Asterisco + aria-required


#### 4.6.3 Modais \& Popups

- **Focus trap:** Foco confinado dentro modal (até fechar)
- **Escape fecha:** ESC key funciona
- **Close button:** "X" + "Fechar" texto, acessível


#### 4.6.4 Testing

- **Automated:** axe DevTools em CI/CD (detecta violations óbvias)
- **Manual:** Testes com screen reader (NVDA/JAWS) mês 2-3 MVP

***

## 5. Design System \& UI Guidelines

### 5.1 Cores (Mantém Digital Dog)

```css
--primary-blue: #00bcd4;
--dark-blue: #0a0e1a;
--darker-blue: #03050a;
--light-blue: #4dd0e1;
--glow-blue: rgba(0, 188, 212, 0.5);
--gradient-orange: #ff6b35;
--gradient-pink: #ff1744;
--gradient-primary: linear-gradient(135deg, #ff6b35 0%, #ff1744 100%);
--gradient-blue: linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%);
```


### 5.2 Tipografia

- **Heading:** Space Grotesk (web font) / fallback Poppins
- **Body:** Inter (web font)
- **Mono:** JetBrains Mono ou Fira Code
- **Sizes:**
    - H1: 3.2rem (bold 800)
    - H2: 2.4rem (bold 700)
    - H3: 1.8rem (bold 700)
    - Body: 1rem (normal 400)
    - Small: 0.875rem (normal 400)


### 5.3 Componentes Principais

#### CTA Botão Primário

- Background: gradient-primary (laranja→rosa)
- Padding: 12px 24px
- Border-radius: 8px
- Hover: Escurece 10% (opacity 0.9)
- Focus: Outline 3px primary-blue
- Font: 1rem, bold 600


#### CTA Botão Secundário

- Border: 2px solid primary-blue
- Background: transparent
- Color: primary-blue
- Hover: Background primary-blue, color white
- Focus: Outline 3px rgba(0,188,212,0.5)


#### Card Serviço/Informação

- Background: linear-gradient(135deg, rgba(0,188,212,0.05) 0%, rgba(255,107,53,0.02) 100%)
- Border-left: 4px primary-blue
- Padding: 20px
- Border-radius: 8px
- Hover: Transform translateY(-4px), shadow-lg


#### Input Form

- Border: 1px solid rgba(0,0,0,0.2)
- Border-radius: 6px
- Padding: 12px
- Font: 1rem
- Focus: Border primary-blue, box-shadow 0 0 0 3px rgba(0,188,212,0.2)


#### Badge/Tag

- Background: rgba(0,188,212,0.15)
- Color: primary-blue
- Padding: 4px 8px
- Border-radius: 12px
- Font-size: 0.85rem


### 5.4 Layout \& Spacing

- **Spacing scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px
- **Container max-width:** 1200px (desktop)
- **Mobile breakpoint:** 320px (xs), 640px (sm), 768px (md), 1024px (lg)
- **Grid:** 12-column (desktop), 6-col (tablet), 1-col (mobile)

***

## 6. User Stories \& Acceptance Criteria

### 6.1 Epic 1: Gestão de Agenda

#### US1.1: Criar Consulta

**Como** atendente, **quero** criar nova consulta, **para** que veterinário saiba agenda.

**Acceptance Criteria:**

- [ ] Modal criar abre com campos: Pet, Data/Hora, Vet, Tipo, Observações
- [ ] Pet search autocomplete (lista existentes)
- [ ] Data/hora picker mostra slots 1h disponíveis
- [ ] Vet dropdown lista vets ativos clínica
- [ ] Tipo select com opções: Rotina, Urgência, Retorno, Vacina, Exame, Cirurgia, Outro
- [ ] Salva em DB (PK id, FK tutor, FK pet, FK vet, datetime start, string observacoes, bool notificou_tutor)
- [ ] Tutor notificado email + SMS (se ativado)
- [ ] Consulta visível agenda (vet + tutor veem)
- [ ] Validação: Pet + data/hora + vet obrigatórios
- [ ] Erro se conflito horário (vet já tem outro evento) → aviso claro


#### US1.2: Cancelar Consulta com Justificativa

**Como** atendente/vet, **quero** cancelar consulta informando motivo, **para** que tutor saiba por quê.

**Acceptance Criteria:**

- [ ] Botão "Cancelar" em cada consulta agenda
- [ ] Modal: "Motivo?" (dropdown: No-show, Solicitação tutor, Solicitação vet, Emergência, Outro)
- [ ] Se "Outro" → textarea obrigatória
- [ ] Atendente requer justificativa (obrigatória)
- [ ] Veterinário requer justificativa (obrigatória)
- [ ] Consulta move para histórico (não deleta)
- [ ] Tutor notificado email: "Sua consulta de [pet] foi cancelada. Motivo: [motivo]"
- [ ] Admin pode ver histórico cancelamentos + motivos (relatório futuro)
- [ ] Validação: Motivo preenchido obrigatoriamente


#### US1.3: Visualizar Agenda Dia/Semana/Mês

**Como** veterinário, **quero** visualizar agenda em múltiplas visualizações, **para** planejar dia.

**Acceptance Criteria:**

- [ ] View Dia: 24h timeline, slots 1h each (08:00-18:00 + overflow)
- [ ] View Semana: 7 colunas (seg-dom), slots 1h
- [ ] View Mês: Grid calendário
- [ ] Eventos coloridos (cor diferente por vet)
- [ ] Clique evento → popover rápido (pet, tutor, observações)
- [ ] Clique "Ver detalhes" → abre página consulta completa
- [ ] Hoje destacado (background, border, etc)
- [ ] Navegação próx/prev mês/semana/dia
- [ ] Mobile: View dia padrão (semana/mês scrollável horizontalmente)


#### US1.4: Lembretes Automáticos

**Como** tutor, **quero** receber lembrete consulta, **para** não esquecer horário.

**Acceptance Criteria:**

- [ ] CRON job: -1 dia 08:00, -1h antes, +1h antes consulta
- [ ] Notificação: Email + SMS (tutor pode desativar por canal)
- [ ] Email template: "Amanhã você tem consulta com [VET] às [HORA] em [CLÍNICA]"
- [ ] SMS template: "[CLÍNICA]: Consulta [PET] com [VET] amanhã às [HORA]. Confirma presença?"
- [ ] Tutor pode clicar link email → confirmar presença (botão)
- [ ] Confirmar presença: notifica veterinário (via FRED chat)
- [ ] Tutor pode clicar botão SMS → reagendar/cancelar (link para portal tutor)

***

### 6.2 Epic 2: IA Prontuários

#### US2.1: Upload Áudio Consulta

**Como** veterinário, **quero** fazer upload áudio consulta, **para** que seja transcrito automaticamente.

**Acceptance Criteria:**

- [ ] Tela "Gravar/Fazer Upload" (2 abas)
- [ ] Aba Upload: Drag-drop ou file picker
- [ ] Formatos: .mp3, .wav, .m4a, .ogg, .webm
- [ ] Limite: 50MB, máximo 60min
- [ ] Validação file: Checar tamanho antes upload
- [ ] Upload progress bar (0-100%)
- [ ] Após upload: "Processando transcrição... (~2-5 minutos)"
- [ ] Notificação quando pronto (browser notification + email)
- [ ] Se erro: "Falha ao transcrever. Tente novamente" + botão retry
- [ ] Audio armazenado MinIO (path: `audios/{clinica_id}/{consulta_id}/original.mp3`)


#### US2.2: Geração Prontuário

**Como** veterinário, **quero** que prontuário seja gerado automaticamente da transcrição, **para** economizar tempo.

**Acceptance Criteria:**

- [ ] Após transcrição bem-sucedida: Chama GPT-4o com prompt customizado
- [ ] Extrai: Queixa, sintomas, exame, diagnóstico, diagnóstico diferencial, exames, medicamentos, orientações, retorno
- [ ] Output JSON estruturado
- [ ] Pre-preenche formulário editor prontuário
- [ ] Cada campo tem checkbox "✅ Correto" / "❌ Editar"
- [ ] Se editar → campo textarea (substitui IA)
- [ ] Se remover → campo some do formulário final
- [ ] Diagnóstico obrigatório (validação)


#### US2.3: Editor \& Confirmação Prontuário

**Como** veterinário, **quero** revisar/editar prontuário IA antes salvar, **para** garantir acurácia.

**Acceptance Criteria:**

- [ ] Formulário: Campos IA pré-preenchidos
- [ ] Cada campo editável inline ou expanded
- [ ] Checkboxes: ✅ Correto, ❌ Editar, ⊘ Remover
- [ ] Editor rich-text para campos múltiplas linhas
- [ ] Validação: Diagnóstico obrigatório, mínimo 1 campo preenchido
- [ ] Assinatura: Data + Nome + CRM (auto-preenchido do usuário)
- [ ] Botões: "Salvar", "Descartar", "Salvar + Gerar Receita"
- [ ] Após salvar: Redireciona histórico pet, mostra notification "Prontuário salvo"


#### US2.4: Histórico Prontuários

**Como** veterinário, **quero** visualizar prontuários anteriores, **para** referência futura.

**Acceptance Criteria:**

- [ ] Página histórico pet: Timeline vertical ordenada desc (mais recente primeiro)
- [ ] Card prontuário: Data, vet responsável, tipo, resumo (snippet primeiras 100 chars)
- [ ] Clique card → abre modal completo (leitura)
- [ ] Botão "Editar" (apenas se vet responsável + <48h criação)
- [ ] Botão "Gerar Receita" (abre modal receita)
- [ ] Botão "Imprimir/PDF" (download)
- [ ] Filtro por vet, data range

***

### 6.3 Epic 3: FRED Assistant

#### US3.1: Chat Flutuante Disponível

**Como** usuário, **quero** acessar FRED chat em qualquer página, **para** obter ajuda rápida.

**Acceptance Criteria:**

- [ ] Ícone FRED permanente canto inferior direito
- [ ] Clique ícone → abre chat (height 400px, width 350px fixed)
- [ ] Minimize button "-" → colapsa em ícone (ainda visível)
- [ ] Maximize button "+" → expande chat
- [ ] Close button "X" → desativa (pode reabrir ícone)
- [ ] Posição responsive (mobile: width 100%, bottom 0, right 0)
- [ ] Sempre disponível (exceto logout)
- [ ] Status "Online" + ícone verde


#### US3.2: Busca Natural Pacientes

**Como** veterinário, **quero** buscar pacientes por nome naturalmente, **para** acessar rápido.

**Acceptance Criteria:**

- [ ] Input chat: "Buscar [pet/tutor]"
- [ ] FRED busca DB (pets + tutores)
- [ ] Resposta: "Encontrei X resultados para '[termo]'"
- [ ] Lista clicável: Pet name + tutor name + data última consulta
- [ ] Clique item → mini-ficha (foto, idade, alergias, peso, últimas 3 consultas)
- [ ] Botões rápidos: "Ver histórico completo", "Agendar consulta", "Editar"
- [ ] Se não encontra: "Desculpe, não encontrei '[termo]'. Quer agendar novo pet?"


#### US3.3: Lembretes Proativos FRED

**Como** veterinário, **quero** receber lembretes FRED automáticos, **para** não esquecer próximos eventos.

**Acceptance Criteria:**

- [ ] CRON job: Executa a cada 30min durante horário clínica
- [ ] Verifica: Consultas próximas 2h, vacinas vencendo 7 dias, exames pendentes
- [ ] Envia notificação FRED: "[VET], você tem consulta com [PET] em 1h30"
- [ ] Notificação clicável → abre página consulta
- [ ] Badge vermelho em ícone FRED se notificação pendente
- [ ] Sound notification (silenciável em settings)


#### US3.4: Histórico Conversa FRED

**Como** veterinário, **quero** que FRED mantenha contexto conversa, **para** não repetir perguntas.

**Acceptance Criteria:**

- [ ] Chat mostra histórico últimas 10 mensagens
- [ ] Rola para baixo → vê mensagens anteriores
- [ ] Ao logout → limpa histórico (segurança)
- [ ] Ao login novamente → histórico zerado
- [ ] Não persiste entre sessões (design security)
- [ ] Todas mensagens logadas (auditoria backend, não visível user)

***

### 6.4 Epic 4: Farejador de Mercado

#### US4.1: Onboarding Farejador

**Como** novo usuário, **quero** configurar farejador de forma simples, **para** começar a monitorar concorrentes.

**Acceptance Criteria:**

- [ ] First-time access → Tour onboarding (3 telas)
- [ ] Tela 1: "Nome clínica" (input) + "Cidade" (input) + "Bairro" (input)
- [ ] Tela 2: Mostra Google Maps resultado (foto, endereço, nota, links)
- [ ] "É este lugar?" botões Sim/Não
- [ ] Se Sim → chama Gemini Grounding Search, busca concorrentes 5km raio
- [ ] Tela 3: Seu perfil (card) + Concorrentes detectados (lista)
- [ ] Cada concorrente: Nome, endereço, nota, links (Instagram, Facebook, etc)
- [ ] Salva seleção em DB (user_id, location, monitored_competitors)
- [ ] Após onboarding → dashboard farejador


#### US4.2: Jornal do Fred Diário

**Como** admin, **quero** ler relatório diário de mercado, **para** tomar decisões estratégicas.

**Acceptance Criteria:**

- [ ] CRON 06:00 AM daily: Executa farejador job
- [ ] Coleta dados: Seu negócio, novos concorrentes, mudanças reviews, posts redes
- [ ] Gera relatório: Seções Seu Negócio + Local + Concorrentes + Oportunidades
- [ ] Salva em DB (log_farejador table)
- [ ] Email enviado admin com relatório formatado
- [ ] Dashboard: Abre Jornal atual + últimas 30 edições (clicáveis)
- [ ] Leitura: Data, resumo, expandir seções
- [ ] Não há atualização em tempo real (apenas diário)


#### US4.3: Monitoramento Customizado

**Como** admin, **quero** adicionar concorrentes específicos, **para** monitorar mais perto.

**Acceptance Criteria:**

- [ ] Botão "Adicionar concorrente"
- [ ] Modal: "Nome clínica" + "Endereço" (ou Google Maps search)
- [ ] Busca no Google/Gemini → sugere resultado
- [ ] Confirma → salva em monitored_competitors
- [ ] Dashboard lista todos monitorados (auto-detectados + manuais)
- [ ] Cada card: Nome, nota atual, última atualização, botão "Remover"
- [ ] Botão "Monitorar intensamente" → notificação imediata se mudança nota/posts
- [ ] Campo notas privadas (memo por concorrente)


#### US4.4: Gráfico Evolução Notas

**Como** admin, **quero** ver evolução notas Google concorrentes, **para** acompanhar tendências.

**Acceptance Criteria:**

- [ ] Dashboard gráfico: Eixo X = data (30 dias), Y = nota (0-5 stars)
- [ ] Linha por concorrente (cores diferentes)
- [ ] Sua clínica destacada (linha mais grossa)
- [ ] Hover ponto → mostra data + nota + delta anterior
- [ ] Exportar CSV (30 dias histórico)

***

## 7. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USERS & AUTH ====================

model User {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  password        String   // bcrypt hash
  role            String   // "admin" | "veterinarian" | "attendant"
  crmNumber       String?  // CFMV registration (vets only)
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  consultations   Consultation[]
  prescriptions   Prescription[]
  medicalRecords  MedicalRecord[]
  
  @@index([clinicId])
  @@map("users")
}

// ==================== CLINIC ====================

model Clinic {
  id              String   @id @default(cuid())
  name            String
  address         String
  city            String
  state           String
  zipCode         String
  phone           String
  website         String?
  logo            String?  // MinIO path
  users           User[]
  
  // Settings
  consultationDuration Int @default(60) // minutes
  workStartHour   Int     @default(8)   // 08:00
  workEndHour     Int     @default(18)  // 18:00
  
  // Relations
  tutors          Tutor[]
  pets            Pet[]
  consultations   Consultation[]
  prescriptions   Prescription[]
  medicalRecords  MedicalRecord[]
  vaccinations    Vaccination[]
  fredarLogs      FredarLog[]
  monitors        CompetitorMonitor[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("clinics")
}

// ==================== TUTORS & PETS ====================

model Tutor {
  id              String   @id @default(cuid())
  cpf             String   // CPF unique per clinic
  name            String
  email           String
  phone           String
  secondPhone     String?
  address         String?
  city            String?
  state           String?
  zipCode         String?
  notes           String?  @db.Text
  active          Boolean  @default(true)
  
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  pets            Pet[]
  consultations   Consultation[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([clinicId, cpf])
  @@index([clinicId])
  @@map("tutors")
}

model Pet {
  id              String   @id @default(cuid())
  name            String
  species         String   // "dog" | "cat" | "rabbit" | "hamster" | "other"
  breed           String?
  sex             String   // "male" | "female"
  birthDate       DateTime?
  weight          Float?   // kg
  color           String?
  castrated       Boolean?
  castrationDate  DateTime?
  knownAllergies  String?  @db.Text
  continuousMeds  String?  @db.Text
  notes           String?  @db.Text
  photo           String?  // MinIO path
  active          Boolean  @default(true)
  
  tutorId         String
  tutor           Tutor    @relation(fields: [tutorId], references: [id], onDelete: Cascade)
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  consultations   Consultation[]
  medicalRecords  MedicalRecord[]
  vaccinations    Vaccination[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([tutorId])
  @@index([clinicId])
  @@map("pets")
}

// ==================== CONSULTATIONS & MEDICAL RECORDS ====================

model Consultation {
  id              String   @id @default(cuid())
  petId           String
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  tutorId         String
  tutor           Tutor    @relation(fields: [tutorId], references: [id], onDelete: Cascade)
  veterinarianId  String
  veterinarian    User     @relation(fields: [veterinarianId], references: [id], onDelete: SetNull)
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  type            String   // "routine" | "urgency" | "return" | "vaccine" | "exam" | "surgery" | "other"
  scheduledDate   DateTime
  status          String   @default("scheduled") // "scheduled" | "completed" | "cancelled" | "no-show"
  cancellationReason String? // "no-show" | "client-request" | "vet-request" | "emergency" | "other"
  notes           String?  @db.Text
  
  // Audio & Transcription
  audioFile       String?  // MinIO path (audios/{clinic}/{consultation}.mp3)
  transcription   String?  @db.Text // Raw Whisper output
  
  // Relations
  medicalRecord   MedicalRecord?
  prescription    Prescription?
  
  tutorNotified   Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([petId])
  @@index([tutorId])
  @@index([veterinarianId])
  @@index([clinicId])
  @@index([scheduledDate])
  @@map("consultations")
}

model MedicalRecord {
  id              String   @id @default(cuid())
  petId           String
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  veterinarianId  String
  veterinarian    User     @relation(fields: [veterinarianId], references: [id], onDelete: SetNull)
  
  consultationId  String   @unique
  consultation    Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  
  // Medical Info
  complaint       String   @db.Text // Queixa principal
  symptoms        String?  @db.Text // Sintomas
  examination     String?  @db.Text // Exame físico
  diagnosis       String   @db.Text // Diagnóstico
  differentialDx  String?  @db.Text // Diagnóstico diferencial
  testsOrdered    String?  @db.Text // Exames solicitados
  medications     String?  @db.Text // Medicamentos (formato JSON futura normalização)
  instructions    String?  @db.Text // Orientações tutor
  nextReturnDate  DateTime?
  additionalNotes String?  @db.Text
  
  // Signature
  signedByName    String
  signedByCRM     String
  signedAt        DateTime
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([petId])
  @@index([clinicId])
  @@map("medical_records")
}

model Prescription {
  id              String   @id @default(cuid())
  petId           String
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  veterinarianId  String
  veterinarian    User     @relation(fields: [veterinarianId], references: [id], onDelete: SetNull)
  
  consultationId  String   @unique
  consultation    Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)
  
  type            String   // "simple" | "controlled" | "special" | "certificate"
  medications     String   @db.Text // JSON format future: [{name, dose, frequency, duration}]
  instructions    String?  @db.Text
  validity        DateTime // 30 days from creation
  
  // Signature
  signedByName    String
  signedByCRM     String
  signedAt        DateTime
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([petId])
  @@index([clinicId])
  @@map("prescriptions")
}

// ==================== VACCINATIONS ====================

model Vaccination {
  id              String   @id @default(cuid())
  petId           String
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  vaccineName     String   // e.g., "V10", "Raiva", etc
  manufacturer    String?
  batchNumber     String?
  applicationDate DateTime
  nextDueDate     DateTime
  status          String   // "applied" | "scheduled" | "overdue"
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([petId])
  @@index([clinicId])
  @@index([nextDueDate])
  @@map("vaccinations")
}

// ==================== FREDAR (Chat & Monitoring) ====================

model FredarLog {
  id              String   @id @default(cuid())
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  userId          String?  // User who triggered query
  
  type            String   // "chat_message" | "patient_search" | "farejador_fetch" | "reminder"
  query           String?  @db.Text // Original user query
  response        String?  @db.Text // FRED response (truncated if too long)
  metadata        String?  @db.Text // JSON meta (e.g., patient_ids searched, etc)
  
  createdAt       DateTime @default(now())
  
  @@index([clinicId])
  @@index([createdAt])
  @@map("fredar_logs")
}

// ==================== COMPETITOR MONITORING ====================

model CompetitorMonitor {
  id              String   @id @default(cuid())
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  competitorName  String
  address         String
  city            String
  googleMapsUrl   String?
  website         String?
  instagram       String?  // Handle
  facebook        String?  // Page URL
  linkedin        String?  // Company URL
  phone           String?
  
  googleRating    Float?   // 0-5
  googleReviews   Int?     // Total review count
  operatingHours  String?  // e.g., "08:00-18:00"
  services        String?  @db.Text // Services offered (if found)
  prices          String?  @db.Text // Pricing info (if public)
  profilePhoto    String?  // MinIO path (thumbnail)
  
  monitored       Boolean  @default(true)
  intensiveMonitor Boolean @default(false)
  notes           String?  @db.Text // Admin's private notes
  
  lastUpdate      DateTime @default(now())
  createdAt       DateTime @default(now())
  
  @@index([clinicId])
  @@index([competitorName])
  @@map("competitor_monitors")
}

model FredarJournal {
  id              String   @id @default(cuid())
  clinicId        String
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  journalDate     DateTime // Date of report
  
  // Sections (JSON structures)
  clinicSection   String   @db.Text // JSON: {status, updates}
  localSection    String?  @db.Text // JSON: {new_competitors, rating_changes, etc}
  competitorSection String? @db.Text // JSON: {competitors: [{name, updates}]}
  opportunitiesSection String? @db.Text // JSON: {suggestions: [...]}
  
  emailSent       Boolean  @default(false)
  emailSentAt     DateTime?
  
  createdAt       DateTime @default(now())
  
  @@index([clinicId])
  @@index([journalDate])
  @@map("fredar_journals")
}

// ==================== BILLING & SUBSCRIPTIONS ====================

model Subscription {
  id              String   @id @default(cuid())
  clinicId        String   @unique
  clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  
  plan            String   // "starter" | "professional" | "enterprise"
  status          String   @default("active") // "active" | "trial" | "cancelled" | "past_due"
  
  trialStartDate  DateTime?
  trialEndDate    DateTime?
  
  subscriptionStartDate DateTime
  nextBillingDate DateTime
  
  stripeCustomerId String?
  stripeSubscriptionId String?
  
  monthlyPrice    Float
  
  cancellationReason String? // Reason if cancelled
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("subscriptions")
}
```


***

## 8. API Endpoints (MVP)

### Auth

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```


### Consultations

```
POST /api/consultations          # Create
GET /api/consultations           # List (filtered by vet/tutor)
GET /api/consultations/:id       # Get detail
PUT /api/consultations/:id       # Update
POST /api/consultations/:id/cancel # Cancel with reason
```


### Medical Records

```
POST /api/medical-records        # Create (from transcript)
GET /api/medical-records/:id     # Get
PUT /api/medical-records/:id     # Update
GET /api/medical-records/pet/:petId # List by pet
```


### Audio Transcription

```
POST /api/transcription/upload   # Upload audio file
POST /api/transcription/generate # Trigger Whisper
GET /api/transcription/:id       # Get transcription
```


### FRED Chat

```
POST /api/fredar/chat            # Send message
GET /api/fredar/search-patient   # Search patients
POST /api/fredar/set-reminder    # Create reminder
```


### Farejador

```
GET /api/fredar/competitors      # List competitors
POST /api/fredar/competitors     # Add competitor
PUT /api/fredar/competitors/:id  # Update
DELETE /api/fredar/competitors/:id # Remove
GET /api/fredar/journal/latest   # Get latest journal
GET /api/fredar/journal/:date    # Get journal by date
```


***

## 9. Roadmap Detalhado (12 Semanas)

### Sprint 1-2: Foundation (Semanas 1-2)

**Goal:** Project setup, auth, database, core components

- [ ] Repo setup (Next.js, TypeScript, Tailwind, Prisma)
- [ ] Database PostgreSQL + migrations
- [ ] Auth NextAuth.js (login, signup, JWT)
- [ ] Role-based middleware (admin, vet, attendant)
- [ ] Base layout (header, sidebar, footer)
- [ ] Design system components (buttons, forms, cards)
- [ ] Docker compose local dev
- [ ] Coolify deploy staging

**Deliverable:** Auth working, can login as different roles

***

### Sprint 3-4: Gestão Agenda (Semanas 3-4)

**Goal:** Agenda funcional com criar/editar/cancelar consultas

- [ ] Consultation model + migrations
- [ ] Tutors \& Pets CRUD
- [ ] Agenda visual (dia/semana/mês)
- [ ] Criar consulta modal
- [ ] Editar consulta
- [ ] Cancelar + justificativa
- [ ] Agenda filtering/search
- [ ] CRON lembretes email/SMS (mock twilio/mailgun)
- [ ] Tests (unit + E2E)

**Deliverable:** Full agenda management, lembretes enviados

***

### Sprint 5-6: IA Prontuários (Semanas 5-6)

**Goal:** Audio upload → Transcrição → Prontuário automático

- [ ] File upload to MinIO
- [ ] Whisper API integration (audio transcription)
- [ ] Geração prontuário form (pré-preenchido IA)
- [ ] Editor + confirmação campos
- [ ] Salvar medical record
- [ ] Histórico prontuários (pet timeline)
- [ ] Prescription generation (templates)
- [ ] Download PDF prontuário/receita
- [ ] Tests

**Deliverable:** Audio → Prontuário automático em 2min, veterinário confirma

***

### Sprint 7-8: FRED Chat (Semanas 7-8)

**Goal:** FRED floater chat, busca pacientes, lembretes proativos

- [ ] Floating chat component (min/max)
- [ ] Gemini SDK integration (chat responses)
- [ ] Patient search natural language
- [ ] Mini-ficha quick view
- [ ] Proactive reminders (CRON)
- [ ] Chat history (session-based)
- [ ] Grounding (all queries use DB first)
- [ ] Auditoria/logging mensagens
- [ ] Tests

**Deliverable:** FRED responde perguntas, busca pacientes, envia lembretes

***

### Sprint 9-10: Farejador (Semanas 9-10)

**Goal:** Competitor monitoring, Gemini Grounding Search, daily journal

- [ ] Onboarding (clínica + cidade + bairro)
- [ ] Gemini Grounding Search integration (competitor detection)
- [ ] Competitor data model + UI
- [ ] CRON daily "Jornal do Fred" (6h AM)
- [ ] Dashboard Farejador (cards concorrentes, gráficos)
- [ ] Adicionar concorrentes customizado
- [ ] Intensive monitoring + notificações
- [ ] Email template relatório diário
- [ ] Tests

**Deliverable:** Daily competitor intelligence, journal email, dashboard visual

***

### Sprint 11: QA \& Otimizações (Semana 11)

**Goal:** Performance, acessibilidade, segurança, compliance

- [ ] Performance audit (PageSpeed, Lighthouse)
- [ ] Accessibility audit (axe, WCAG AA)
- [ ] Security audit (HTTPS, headers, SQL injection, XSS)
- [ ] LGPD compliance checklist
- [ ] Backup/restore testing
- [ ] Load testing (100 users, 1000 consultas/dia)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness
- [ ] Error handling/fallbacks
- [ ] Final round bug fixes

**Deliverable:** Performance >85 mobile, acessibilidade AA, sem vulnerabilities críticas

***

### Sprint 12: Launch Prep \& Docs (Semana 12)

**Goal:** Ready for beta testing

- [ ] User manual (tutorial in-app + PDF)
- [ ] Admin guide (setup, configuration, billing)
- [ ] Technical documentation (API, deployment)
- [ ] Staging ↔ Production checklist
- [ ] Monitoring alerts setup (Sentry, UptimeRobot)
- [ ] Support email setup + auto-responder
- [ ] Legal docs (ToS, Privacy Policy LGPD, CFMV compliance)
- [ ] Final UX review + tweaks
- [ ] Beta signup landing page (waitlist)
- [ ] Announcement email template

**Deliverable:** Production-ready MVP, documented, monitored, legal compliant

***

## 10. Dependências \& Integrações

### APIs Externas

| API | Função | Plan | Custo |
| :-- | :-- | :-- | :-- |
| OpenAI Whisper | Áudio transcrição | Pay-as-you-go | \$0.006 min (60min = \$6) |
| OpenAI GPT-4o | Geração prontuários | Pay-as-you-go | ~\$20k tokens (10k resp) = \$0.30-0.60 prontuário |
| Google Gemini 2.5 Flash | FRED chat + Farejador | Free 15k/day + Pay-as-you-go | ~\$0.075 per 1M input tokens |
| Stripe/Pagar.me | Pagamento assinatura | 2.99% + R\$ 0.49 | Per transaction |
| Twilio (futuro SMS) | Lembretes SMS | Pay-as-you-go | \$0.0075 SMS |
| Mailgun/Sendgrid | Email transacional | Free 1.000/mês + Pay | \$0.30/1k beyond |

### Ambiente Variáveis Necessários

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://fred.digitaldog.pet"
NEXTAUTH_SECRET="random-64-chars"
NEXTAUTH_GOOGLE_ID="..."
NEXTAUTH_GOOGLE_SECRET="..."

# APIs IA
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="AIza..."

# Storage
MINIO_ENDPOINT="minio:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Email
MAILGUN_API_KEY="key-..."
MAILGUN_DOMAIN="mg.digitaldog.pet"

# SMS (Fase 2)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."

# Stripe/Pagar.me
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."

# Sentry
SENTRY_DSN="https://..."

# Coolify
COOLIFY_API_TOKEN="..."
```


***

## 11. Riscos Técnicos \& Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
| :-- | :-- | :-- | :-- |
| **Latência transcrição** (Whisper demora >5min) | Média | Médio | Async processing + UI feedback, espectativa clara (2-5min para 60min) |
| **Custo APIs insustentável** (Whisper 1000 transcrições = R\$ 600/mês) | Baixa | Alto | Monitorar quota diário, limites por plano, self-hosted Whisper Fase 2 |
| **Gemini rate limit** (Grounding Search blocking) | Baixa | Alto | Perplexity API backup, cache respostas 24h, Firecrawl MCP Fase 2 |
| **LGPD data breach** (dados sensíveis exposed) | Baixa | Crítico | Criptografia at-rest/transit, logs auditoria, backup seguro, política response |
| **Performance VPS** (>200 clientes causam lentidão) | Média | Médio | Monitorar via Coolify, upgrade VPS/multi-VPS, cache Redis Fase 2 |
| **Pronunciamento IA impreciso** (veterinário não confia) | Média | Alto | Always confirmação humana, fine-tuning prompt, feedback loop, glossário custom |
| **Usuário atendente deleta prontuário acidentalmente** | Baixa | Alto | Soft delete (não apagar, apenas marcar inactive), logs auditoria, backup |
| **Concorrentes bloquear farejador** (robots.txt) | Média | Médio | Respeitar robots.txt, Firecrawl for approval needed, diversificar sources |
