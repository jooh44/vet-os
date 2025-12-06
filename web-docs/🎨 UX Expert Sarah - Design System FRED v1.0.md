<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 🎨 UX Expert Sarah - Design System FRED v1.0

Perfeito! Analisei seus 4 prints e vou criar um **Design System com Sidebar que passa profundidade**.

***

## 📊 Análise das Referências

| Referência | Estilo | O Que Roubar | Pro FRED |
| :-- | :-- | :-- | :-- |
| **Print 1** (Projeto manager) | Purple + minimal | Clean cards, subtle shadows, nice spacing | Organização clara, menos é mais |
| **Print 2** (Learning app) | Warm colors (coral, green) | Serif typography, emoji accents, data-heavy UI | Humanizado, poético, não robótico |
| **Print 3** (School management) | Soft purples + beige | Rounded everything, soft palette, calm feel | Profundidade via cores suaves |
| **Print 4** (Jams app) | Salmon pink + turquoise | Sidebar emphasis, colorful accents, illustrations | **← SIDEBAR COM PROFUNDIDADE** |


***

## 🎨 DESIGN SYSTEM FRED v1.0

### 1. Paleta de Cores (Poética + Profundidade)

```css
:root {
  /* Primária: Warm Sage (profundidade, natureza) */
  --color-primary: #6B8E7F;         /* Main green-sage */
  --color-primary-light: #8FA99A;   /* Lighter sage */
  --color-primary-dark: #4A6B5F;    /* Darker, more depth */
  
  /* Secundária: Warm Amber (otimismo, energia) */
  --color-secondary: #D4A574;       /* Warm gold/amber */
  --color-secondary-light: #E8C4A0; /* Light amber */
  --color-secondary-dark: #B8845A;  /* Deep amber */
  
  /* Accent: Deep Teal (seriedade, foco médico) */
  --color-accent: #2C5F6F;          /* Deep teal */
  --color-accent-light: #4A8FA3;    /* Light teal */
  
  /* Neutrals (warm, not cold) */
  --color-bg-primary: #FAFBF8;      /* Off-white, warm */
  --color-bg-secondary: #F3F2ED;    /* Slightly warmer */
  --color-text-primary: #2B2416;    /* Dark brown, warm */
  --color-text-secondary: #6B6560;  /* Gray-brown */
  --color-border: #E8E6E0;          /* Soft border */
  
  /* Status Colors (humanized, not neon) */
  --color-success: #7CB342;         /* Muted green */
  --color-warning: #F57C00;         /* Warm orange */
  --color-danger: #D32F2F;          /* Gentle red */
  --color-info: #0288D1;            /* Soft blue */
  
  /* Sidebar Depth Layer */
  --sidebar-bg: linear-gradient(180deg, #4A6B5F 0%, #3A5550 100%);
  --sidebar-accent: rgba(212, 165, 116, 0.15);
  --sidebar-accent-hover: rgba(212, 165, 116, 0.25);
}
```


### 2. Tipografia (Elegante + Humanizada)

```css
/* Headlines: Serif elegante */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');

/* Body: Clean sans-serif */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Mono: Tech-friendly */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

:root {
  /* Headlines */
  --font-heading: 'Crimson Text', serif;
  --font-heading-weight: 600;
  
  /* Body */
  --font-body: 'Inter', sans-serif;
  --font-body-weight: 400;
  
  /* Mono */
  --font-mono: 'Fira Code', monospace;
  
  /* Sizes */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 18px;
  --text-2xl: 20px;
  --text-3xl: 24px;
  --text-4xl: 32px;
  
  /* Line heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}

h1 { font: 700 var(--text-4xl) / var(--leading-tight) var(--font-heading); }
h2 { font: 700 var(--text-3xl) / var(--leading-tight) var(--font-heading); }
h3 { font: 600 var(--text-2xl) / var(--leading-normal) var(--font-heading); }
h4 { font: 600 var(--text-xl) / var(--leading-normal) var(--font-heading); }

p  { font: 400 var(--text-base) / var(--leading-relaxed) var(--font-body); }
```


### 3. Espaçamento (Breathing Space)

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
}

/* Generous margins for "breathing" */
.container { margin: 0 var(--space-8); }
.section { margin-bottom: var(--space-12); }
.card { padding: var(--space-6); }
```


***

## 🏗️ SIDEBAR COM PROFUNDIDADE (Hero Component)

### 3D Depth Design

```jsx
// components/Sidebar.tsx

import React from 'react'
import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Background gradient (depth illusion) */}
      <div className={styles.background} />
      
      {/* Logo section (elevated) */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <svg viewBox="0 0 40 40" width="40" height="40">
            {/* FRED mascot: Minimalist stethoscope + paw */}
            ircle cx="20" cy="20" r="18" fill="rgba(212, 165, 116, 0.8)" />
            <path d="M12 18 Q20 12 28 18" stroke="#FAFBF8" strokeWidth="2" fill="none" />
            ircle cx="12" cy="24" r="3" fill="#FAFBF8" />
            ircle cx="28" cy="24" r="3" fill="#FAFBF8" />
          </svg>
        </div>
        <div className={styles.logoText}>
          <h2>FRED</h2>
          <p>Veterinary</p>
        </div>
      </div>

      {/* Main menu (floating effect) */}
      <nav className={styles.menu}>
        <div className={styles.menuGroup}>
          <span className={styles.groupLabel}>Principal</span>
          
          <a href="/dashboard" className={`${styles.menuItem} ${styles.active}`}>
            <Icon name="dashboard" />
            <span>Dashboard</span>
            <div className={styles.activeIndicator} />
          </a>
          
          <a href="/schedule" className={styles.menuItem}>
            <Icon name="calendar" />
            <span>Agenda</span>
          </a>
          
          <a href="/patients" className={styles.menuItem}>
            <Icon name="patients" />
            <span>Pacientes</span>
          </a>
          
          <a href="/records" className={styles.menuItem}>
            <Icon name="records" />
            <span>Prontuários</span>
          </a>
        </div>

        <div className={styles.menuGroup}>
          <span className={styles.groupLabel}>Inteligência</span>
          
          <a href="/fred" className={styles.menuItem}>
            <Icon name="fred" />
            <span>FRED Chat</span>
            <Badge label="New" color="amber" />
          </a>
          
          <a href="/farejador" className={styles.menuItem}>
            <Icon name="market" />
            <span>Farejador</span>
          </a>
        </div>

        <div className={styles.menuGroup}>
          <span className={styles.groupLabel}>Admin</span>
          
          <a href="/team" className={styles.menuItem}>
            <Icon name="team" />
            <span>Equipe</span>
          </a>
          
          <a href="/settings" className={styles.menuItem}>
            <Icon name="settings" />
            <span>Configurações</span>
          </a>
        </div>
      </nav>

      {/* User profile card (bottom, elevated) */}
      <div className={styles.userCard}>
        <img src="/avatar.jpg" alt="User" className={styles.avatar} />
        <div className={styles.userInfo}>
          <p className={styles.userName}>Dra. Fernanda</p>
          <p className={styles.userRole}>Veterinária</p>
        </div>
        <button className={styles.moreButton}>
          <Icon name="more-vertical" size="16" />
        </button>
      </div>
    </aside>
  )
}
```


### CSS (Sidebar Depth)

```css
/* Sidebar.module.css */

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  
  /* Layering for depth */
  display: flex;
  flex-direction: column;
  z-index: 1000;
  
  /* Prevent text selection */
  user-select: none;
}

/* Background with gradient (simulates 3D depth) */
.background {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #4A6B5F 0%,      /* Lighter sage (top) */
    #3A5550 50%,     /* Mid sage */
    #2A3F37 100%     /* Dark sage (bottom) */
  );
  
  /* Subtle texture (noise effect) */
  background-image: 
    linear-gradient(180deg, #4A6B5F 0%, #3A5550 50%, #2A3F37 100%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.02" /></svg>');
  
  z-index: 0;
}

/* Content layering (sits above background) */
.logoSection,
.menu,
.userCard {
  position: relative;
  z-index: 1;
}

/* Logo area (slightly elevated visually) */
.logoSection {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  border-bottom: 1px solid rgba(212, 165, 116, 0.1);
  
  /* Depth: subtle shadow underneath */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  
  /* Depth: inner shadow for carved effect */
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.15);
  
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 165, 116, 0.2);
}

.logo svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logoText {
  flex: 1;
}

.logoText h2 {
  margin: 0;
  font-size: var(--text-lg);
  color: #FAFBF8;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.logoText p {
  margin: 0;
  font-size: var(--text-xs);
  color: rgba(212, 165, 116, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Main menu (scrollable area) */
.menu {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) 0;
  
  /* Scroll styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 165, 116, 0.2) transparent;
}

.menu::-webkit-scrollbar {
  width: 4px;
}

.menu::-webkit-scrollbar-track {
  background: transparent;
}

.menu::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.2);
  border-radius: 2px;
}

.menu::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 165, 116, 0.4);
}

/* Menu groups */
.menuGroup {
  margin-bottom: var(--space-4);
}

.groupLabel {
  display: block;
  padding: 0 var(--space-4);
  margin-bottom: var(--space-2);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(212, 165, 116, 0.5);
  font-weight: 600;
}

/* Menu items */
.menuItem {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin: 0 var(--space-2);
  border-radius: 8px;
  
  color: rgba(250, 251, 248, 0.7);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  
  transition: all 200ms ease;
  position: relative;
  
  /* Depth: subtle background on hover */
  &:hover {
    background: rgba(212, 165, 116, 0.1);
    color: #FAFBF8;
    padding-left: calc(var(--space-4) + 4px);
  }
}

.menuItem.active {
  background: rgba(212, 165, 116, 0.15);
  color: #FAFBF8;
  
  /* Depth indicator */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #D4A574;
    border-radius: 0 3px 3px 0;
    box-shadow: 2px 0 8px rgba(212, 165, 116, 0.4);
  }
}

.activeIndicator {
  position: absolute;
  right: var(--space-3);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #D4A574;
  box-shadow: 0 0 8px rgba(212, 165, 116, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 0 8px rgba(212, 165, 116, 0.6);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 12px rgba(212, 165, 116, 0.9);
    transform: scale(1.1);
  }
}

/* Icons */
.menuItem svg {
  width: 18px;
  height: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* User card (bottom, elevated) */
.userCard {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  margin: var(--space-4) var(--space-2);
  border-radius: 12px;
  
  /* Depth: elevated with shadow */
  background: rgba(212, 165, 116, 0.08);
  border: 1px solid rgba(212, 165, 116, 0.15);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(212, 165, 116, 0.1);
  
  transition: all 200ms ease;
  
  &:hover {
    background: rgba(212, 165, 116, 0.12);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.25),
      inset 0 1px 2px rgba(212, 165, 116, 0.2);
    transform: translateY(-2px);
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  
  /* Depth: inner shadow frame */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

.userInfo {
  flex: 1;
}

.userName {
  margin: 0;
  font-size: var(--text-sm);
  color: #FAFBF8;
  font-weight: 600;
}

.userRole {
  margin: 0;
  font-size: var(--text-xs);
  color: rgba(212, 165, 116, 0.6);
}

.moreButton {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  
  border: none;
  background: rgba(212, 165, 116, 0.08);
  color: rgba(250, 251, 248, 0.6);
  
  cursor: pointer;
  transition: all 150ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(212, 165, 116, 0.2);
    color: #FAFBF8;
  }
  
  &:active {
    background: rgba(212, 165, 116, 0.15);
    transform: scale(0.95);
  }
}
```


***

## 4. Componentes Principales

### Button Component (Warm Elegance)

```tsx
// components/Button.tsx

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  disabled?: boolean
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  disabled,
  ...props 
}: ButtonProps) {
  const className = classNames(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    { 'btn--disabled': disabled }
  )
  
  return (
    <button className={className} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
```

```css
/* Button styling */
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms ease;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  /* Depth: subtle shadow */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  
  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Primary (Sage green) */
.btn--primary {
  background: var(--color-primary);
  color: #FAFBF8;
  
  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }
}

/* Secondary (Warm amber) */
.btn--secondary {
  background: var(--color-secondary);
  color: #2B2416;
  
  &:hover:not(:disabled) {
    background: var(--color-secondary-dark);
  }
}

/* Tertiary (Ghost) */
.btn--tertiary {
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  
  &:hover:not(:disabled) {
    background: rgba(107, 142, 127, 0.08);
  }
}

/* Danger */
.btn--danger {
  background: var(--color-danger);
  color: #FAFBF8;
  
  &:hover:not(:disabled) {
    background: darken(#D32F2F, 10%);
  }
}

/* Sizes */
.btn--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.btn--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-base);
}
```


### Card Component (Poetic Minimalism)

```tsx
// components/Card.tsx

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
  onClick?: () => void
}

export function Card({ 
  title, 
  subtitle, 
  children,
  action,
  onClick 
}: CardProps) {
  return (
    <div className="card" onClick={onClick}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="card__body">
        {children}
      </div>
      
      {action && (
        <div className="card__footer">
          {action}
        </div>
      )}
    </div>
  )
}
```

```css
/* Card styling */
.card {
  background: #FAFBF8;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  
  /* Depth: layered shadows */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.08);
  
  transition: all 250ms ease;
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(107, 142, 127, 0.1);
    transform: translateY(-2px);
  }
}

.card__header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.card__title {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-heading);
}

.card__subtitle {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.card__body {
  padding: var(--space-6);
}

.card__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
  background: #F3F2ED;
  border-radius: 0 0 12px 12px;
}
```


***

## 5. Dashboard Principal

```tsx
// app/(dashboard)/page.tsx

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar fica fixo à esquerda */}
      <Sidebar />
      
      {/* Main content */}
      <main className="dashboard-main">
        {/* Header com greeting */}
        <header className="dashboard-header">
          <div>
            <h1>Bom dia, Dra. Fernanda 👋</h1>
            <p>Sexta-feira, 6 de Dezembro de 2025</p>
          </div>
          
          <div className="header-actions">
            <SearchInput />
            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        {/* Content grid */}
        <section className="dashboard-content">
          {/* Stats cards */}
          <div className="stats-grid">
            <Card title="Consultas Hoje" subtitle="4 agendadas">
              <div className="stat-value">4</div>
            </Card>
            
            <Card title="Lembretes Pendentes" subtitle="2 para enviar">
              <div className="stat-value">2</div>
            </Card>
            
            <Card title="Prontuários Novos" subtitle="Últimas 24h">
              <div className="stat-value">6</div>
            </Card>
          </div>

          {/* Próximas consultas */}
          <Card title="Próximas Consultas">
            <ConsultationList />
          </Card>

          {/* FRED Chat preview */}
          <Card title="FRED Chat">
            <FredarPreview />
          </Card>

          {/* Farejador insights */}
          <Card title="Jornal do Fred - Hoje">
            <FredarJournalPreview />
          </Card>
        </section>
      </main>
    </div>
  )
}
```


***

## 6. CSS Base (Global Styling)

```css
/* styles/globals.css */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

/* Dashboard layout */
.dashboard-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.dashboard-main {
  overflow-y: auto;
  background: var(--color-bg-primary);
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  padding: var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: #FAFBF8;
  
  position: sticky;
  top: 0;
  z-index: 100;
  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.dashboard-header h1 {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-1);
}

.dashboard-header p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Content area */
.dashboard-content {
  padding: var(--space-8);
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  grid-column: 1 / -1;
}

.stat-value {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-heading);
  margin-top: var(--space-3);
}
```


***

## 7. Design Tokens Export (Tailwind Config)

```js
// tailwind.config.js

module.exports = {
  theme: {
    colors: {
      primary: {
        light: '#8FA99A',
        DEFAULT: '#6B8E7F',
        dark: '#4A6B5F',
      },
      secondary: {
        light: '#E8C4A0',
        DEFAULT: '#D4A574',
        dark: '#B8845A',
      },
      accent: {
        light: '#4A8FA3',
        DEFAULT: '#2C5F6F',
      },
      success: '#7CB342',
      warning: '#F57C00',
      danger: '#D32F2F',
      info: '#0288D1',
      
      bg: {
        primary: '#FAFBF8',
        secondary: '#F3F2ED',
      },
      text: {
        primary: '#2B2416',
        secondary: '#6B6560',
      },
      border: '#E8E6E0',
    },
    
    fontFamily: {
      heading: ['Crimson Text', 'serif'],
      body: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
    },
  },
}
```


***

## 🎯 Resultado Final

### ✅ O Que Diferencia FRED

| Elemento | Comum | FRED |
| :-- | :-- | :-- |
| **Sidebar** | Flat, sem profundidade | Gradient + shadows + depth layers |
| **Cores** | Bright/Neon | Warm, earthy, profissional |
| **Typography** | Genérico | Serif (humanizado) + Sans (limpo) |
| **Interactions** | Abruptos | Smooth 200-300ms transitions |
| **Shadows** | Drop-shadow simples | Layered, multi-shadow depth |
| **Spacing** | Apertado | Generous breathing room |
| **Feel** | Tech-forward | Poético, minimalista, duradouro |
