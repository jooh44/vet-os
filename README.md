# 🩺 VetOS - Sistema de Gestão Veterinária com IA

![VetOS Dashboard](https://i.imgur.com/example.png)

**VetOS** (anteriormente *Fred AI*) é uma plataforma revolucionária de gestão para clínicas veterinárias que integra **Inteligência Artificial** diretamente no fluxo de trabalho.

O sistema combina gestão prática (Agenda, Prontuários, Financeiro) com ferramentas de IA avançadas para automatizar burocracias e fornecer insights estratégicos.

## 🚀 Funcionalidades Principais

### 🧠 Inteligência Artificial
- **Consulta com IA:** Grave a consulta e a IA transcreve e estrutura o prontuário (soap) automaticamente.
- **Fred Assistant (Em Breve):** Chatbot flutuante para dúvidas rápidas e insights.
- **Farejador de Mercado (Em Breve):** Monitoramento de concorrentes e preços.

### 🏥 Gestão Clínica
- **Agenda Inteligente:** Calendário visual com status coloridos (Vacina, Cirurgia, Urgência).
- **Prontuário Eletrônico:** Histórico completo, timeline de eventos, upload de exames.
- **Gestão de Pacientes e Tutores:** Perfis detalhados com busca rápida global.

### 🎨 Experiência do Usuário (UX)
- Design moderno e responsivo (Mobile First).
- Modo escuro/claro (Tema "Natureza" padrão).
- Dashboards com métricas visuais.

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI.
- **Backend:** Server Actions, Prisma ORM.
- **Database:** PostgreSQL (via Docker).
- **AI Integration:** OpenAI API (Whisper + GPT-4o).
- **Armazenamento:** MinIO / Local (para áudios e anexos).

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-org/vetos.git
   cd vetos
   ```

2. **Configure o ambiente:**
   Crie um arquivo `.env` baseado no `.env.example`.
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/fred_db"
   OPENAI_API_KEY="sk-..."
   ```

3. **Suba o banco de dados:**
   ```bash
   docker-compose up -d
   ```

4. **Prepare o banco:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Rode o projeto:**
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000).

## 📅 Roadmap (Status Atual: Sprint 3)

- [x] Autenticação e Setup Inicial
- [x] CRUD Tutores e Pets
- [x] Prontuário com Timeline
- [x] **Nova Consulta com IA (Gravação + Transcrição)**
- [x] **Dashboard Premium e Agenda**
- [ ] Farejador de Mercado (Próxima Sprint)
- [ ] Integração WhatsApp

## 👥 Contribuidores

- **Dr. Johny** - Lead Developer
- **Antigravity (Google DeepMind)** - AI Pair Programmer

---
*VetOS © 2024 - Todos os direitos reservados.*
