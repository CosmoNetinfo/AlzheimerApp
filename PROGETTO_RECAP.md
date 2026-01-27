# 📋 MEMORA - Registro Sviluppo e Checklist

**Progetto**: Memora - App per supporto Alzheimer  
**Sviluppatori**: Daniele Spalletti & Michele Mosca (CosmoNet.info)  
**Cliente**: Airalzh  
**Ultimo Aggiornamento**: 27 Gennaio 2026

---

## 🎯 Obiettivo del Progetto

Creare una Progressive Web App (PWA) per supportare pazienti affetti da Alzheimer e i loro caregiver, fornendo strumenti per:
- Gestione attività quotidiane
- Monitoraggio dello stato emotivo
- Comunicazione tra paziente e rete di supporto
- Social network dedicato per condivisione esperienze

---

## ✅ FUNZIONALITÀ COMPLETATE

### 1. **Architettura Base** ✓
- [x] Setup React + Vite
- [x] Routing con React Router
- [x] Integrazione Supabase (Database + Auth)
- [x] PWA configurata (manifest.json, service worker)
- [x] Deploy automatico su Vercel
- [x] Repository GitHub configurato

### 2. **Sistema di Autenticazione** ✓
- [x] Pagina Login/Registrazione
- [x] Gestione ruoli utente (Paziente, Caregiver, Familiare, Operatore Sanitario)
- [x] Persistenza sessione con localStorage
- [x] Logout funzionante

### 3. **Design System Premium** ✓
- [x] Palette colori vibrant (Purple #7C3AED + Amber #F59E0B)
- [x] Design card-based moderno
- [x] Glassmorphism effects
- [x] Micro-animazioni e transizioni smooth
- [x] Typography professionale (system fonts)
- [x] Responsive layout mobile-first

### 4. **Homepage - Gestione Attività** ✓
- [x] Saluto personalizzato con nome utente
- [x] Data corrente in italiano
- [x] Card Agenda con gradient viola
- [x] Lista attività con checkbox interattivi
- [x] Aggiunta/eliminazione task
- [x] Orari per ogni attività
- [x] Persistenza task in localStorage
- [x] Link impostazioni in header (icona ingranaggio)

### 5. **Mood Tracker (Tracciamento Umore)** ✓
- [x] Tre stati emotivi: Felice, Neutro, Triste
- [x] Icone colorate (Smile, Meh, Frown)
- [x] **Logica basata su ruolo**:
  - Paziente: può selezionare il proprio umore (cliccabile)
  - Altri ruoli: vedono l'umore del paziente (read-only)
- [x] Persistenza in Supabase (tabella `profiles`)
- [x] Sincronizzazione real-time
- [x] Visualizzazione su Homepage
- [x] Visualizzazione su Profilo (badge per non-pazienti, selettore per pazienti)

### 6. **Pillola di Benessere** ✓
- [x] 10 citazioni motivazionali
- [x] Rotazione automatica giornaliera (basata su giorno dell'anno)
- [x] Card con design warm (giallo/ambra)
- [x] Icona cuore decorativa

### 7. **Chat AI (Memora Assistant)** ✓
- [x] Interfaccia chat moderna
- [x] Integrazione Google Gemini AI
- [x] Risposte contestuali e empatiche
- [x] Bubble messages con avatar
- [x] Auto-scroll ai nuovi messaggi
- [x] Persistenza conversazioni in localStorage

### 8. **Social Feed (MemoraBook)** ✓
- [x] Feed stile Facebook/Instagram
- [x] Creazione post con testo e immagini
- [x] Sistema like con persistenza
- [x] Commenti con thread
- [x] Like ai commenti
- [x] Upload immagini con compressione automatica
- [x] Lightbox per visualizzazione immagini
- [x] Timestamp relativi ("2 ore fa")
- [x] Persistenza completa in Supabase

### 9. **Profilo Utente** ✓
- [x] **Design minimale card-based** (nuovo!)
- [x] Avatar con iniziale o foto
- [x] Badge ruolo
- [x] **Mood badge** per caregiver (mostra umore paziente)
- [x] **Mood selector** per pazienti (3 pulsanti interattivi)
- [x] Card informazioni (email, ruolo, data iscrizione)
- [x] Card azioni rapide (Impostazioni, Post)
- [x] Pulsante logout rosso
- [x] Footer con credits

### 10. **Impostazioni** ✓
- [x] Gestione notifiche push (OneSignal + Fallback nativo)
- [x] Toggle caratteri grandi (accessibilità)
- [x] Numero SOS configurabile
- [x] Link rapido Pronto Alzheimer
- [x] Istruzioni per attivazione notifiche (iOS/Android)
- [x] Gestione permessi denied

### 11. **Notifiche Push** ✓
- [x] Integrazione OneSignal
- [x] Richiesta permessi intelligente
- [x] Supporto iOS (con istruzioni PWA)
- [x] Supporto Android
- [x] Fallback browser nativo
- [x] Gestione stati (granted/denied/default)

### 12. **Responsive Design** ✓
- [x] **Mobile**: Layout full-screen, barra inferiore
- [x] **Tablet**: Contenuto centrato (max 600px)
- [x] **Desktop**: 
  - Sidebar laterale sinistra (80px)
  - Contenuto centrato con effetto floating
  - Hover effects su navigazione
  - Background grigio esterno
- [x] Safe area insets per notch/home indicator
- [x] Transizioni smooth tra breakpoints

### 13. **Navigazione** ✓
- [x] Tab bar inferiore (mobile)
- [x] Sidebar laterale (desktop >600px)
- [x] 4 sezioni: Inizio, Chat, Social, Profilo
- [x] Icone Lucide React
- [x] Active state evidenziato
- [x] Animazioni di transizione

---

## 🚧 DA COMPLETARE / MIGLIORARE

### Priorità Alta 🔴
- [ ] **Testing completo su dispositivi reali**
  - [ ] Test iOS (Safari, PWA installata)
  - [ ] Test Android (Chrome, PWA installata)
  - [ ] Test notifiche push su tutti i device
- [ ] **Gestione errori robusta**
  - [ ] Offline mode (service worker)
  - [ ] Retry automatico chiamate API
  - [ ] Toast notifications per feedback utente
- [ ] **Sicurezza**
  - [ ] Validazione input lato client
  - [ ] Sanitizzazione contenuti post/commenti
  - [ ] Rate limiting chiamate AI
  - [ ] HTTPS obbligatorio

### Priorità Media 🟡
- [ ] **Funzionalità Social**
  - [ ] Modifica/eliminazione post propri
  - [ ] Modifica/eliminazione commenti propri
  - [ ] Filtri feed (solo amici, solo famiglia, ecc.)
  - [ ] Ricerca post
  - [ ] Hashtag
- [ ] **Profilo Utente**
  - [ ] Modifica foto profilo
  - [ ] Modifica bio
  - [ ] Modifica informazioni personali
  - [ ] Privacy settings
- [ ] **Attività**
  - [ ] Notifiche promemoria attività
  - [ ] Ricorrenza attività (giornaliera, settimanale)
  - [ ] Categorie attività (farmaci, appuntamenti, ecc.)
  - [ ] Statistiche completamento
- [ ] **Chat AI**
  - [ ] Cronologia conversazioni
  - [ ] Esportazione conversazioni
  - [ ] Suggerimenti contestuali
  - [ ] Integrazione calendario per promemoria

### Priorità Bassa 🟢
- [ ] **Gamification**
  - [ ] Badge achievements
  - [ ] Streak giornalieri
  - [ ] Punti per completamento attività
- [ ] **Analytics**
  - [ ] Dashboard statistiche per caregiver
  - [ ] Grafici andamento umore
  - [ ] Report settimanali/mensili
- [ ] **Integrations**
  - [ ] Calendario Google/Apple
  - [ ] Contatti telefono
  - [ ] Foto gallery
- [ ] **Accessibilità**
  - [ ] Screen reader optimization
  - [ ] Contrasto alto
  - [ ] Navigazione tastiera completa
  - [ ] Voice commands

---

## 🗂️ STRUTTURA PROGETTO

```
AlzheimerApp/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Service worker per offline
│   └── icons/                 # App icons (varie dimensioni)
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Header con titolo pagina
│   │   ├── TabBar.jsx         # Barra navigazione (responsive)
│   │   ├── TabBar.module.css  # Stili navigazione
│   │   └── Layout.jsx         # Layout wrapper
│   ├── pages/
│   │   ├── LoginPage.jsx      # Login/Registrazione
│   │   ├── ListPage.jsx       # Homepage - Attività
│   │   ├── ChatPage.jsx       # Chat AI
│   │   ├── FeedPage.jsx       # Social feed
│   │   ├── ProfilePage.jsx    # Profilo utente (minimale)
│   │   └── SettingsPage.jsx   # Impostazioni
│   ├── supabaseClient.js      # Config Supabase
│   ├── App.jsx                # Router principale
│   ├── index.css              # Stili globali + design system
│   └── main.jsx               # Entry point
├── .env                       # Variabili ambiente (Supabase, OneSignal, Gemini)
├── vite.config.js             # Config Vite
└── package.json               # Dipendenze
```

---

## 🎨 DESIGN TOKENS

### Colori
```css
--color-primary: #7C3AED        /* Vibrant Purple */
--color-primary-dark: #4C1D95   /* Deep Purple */
--color-accent: #F59E0B         /* Amber/Gold */
--color-bg-primary: #F9F9FB     /* Light Gray */
--color-bg-secondary: #FFFFFF   /* Pure White */
--color-text-primary: #1F2937   /* Deep Gray */
--color-success: #10B981        /* Green */
--color-error: #EF4444          /* Red */
```

### Spacing
- Tab bar height: 84px
- Header height: 60px
- Card border-radius: 24px
- Button border-radius: 12-20px

---

## 🔧 TECNOLOGIE UTILIZZATE

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Lucide React** - Icon library

### Backend & Services
- **Supabase** - Database PostgreSQL + Auth + Storage
- **Google Gemini AI** - Chat assistant
- **OneSignal** - Push notifications

### Deployment
- **Vercel** - Hosting + CI/CD
- **GitHub** - Version control

---

## 📊 DATABASE SCHEMA (Supabase)

### Tabella: `profiles`
```sql
- id (text, PK)
- name (text)
- surname (text)
- email (text)
- role (text) -- 'patient', 'caregiver', 'healthcare', 'family'
- bio (text)
- location (text)
- photo (text) -- base64 o URL
- current_mood (text) -- 'happy', 'neutral', 'sad'
- created_at (timestamp)
```

### Tabella: `posts`
```sql
- id (bigint, PK, auto)
- author (text)
- author_id (text)
- author_photo (text)
- text (text)
- image (text) -- base64
- likes (integer)
- created_at (timestamp)
```

### Tabella: `comments`
```sql
- id (bigint, PK, auto)
- post_id (bigint, FK -> posts)
- author_name (text)
- author_id (text)
- author_photo (text)
- text (text)
- likes (integer)
- created_at (timestamp)
```

---

## 🚀 DEPLOYMENT

### Vercel
- **URL Produzione**: https://alzheimer-app.vercel.app (o simile)
- **Auto-deploy**: Push su branch `main` → deploy automatico
- **Environment Variables**: Configurate su Vercel dashboard

### GitHub
- **Repository**: CosmoNetinfo/AlzheimerApp
- **Branch principale**: `main`
- **Commit messages**: Descrittivi e in italiano

---

## 📝 NOTE TECNICHE

### Gestione Stato
- **localStorage**: Tasks, user session, liked posts/comments
- **Supabase**: Posts, comments, profiles, mood
- **React State**: UI temporaneo, form inputs

### Performance
- Immagini compresse a max 1024px (post) e 512px (avatar)
- Lazy loading componenti (da implementare)
- Memoization con useMemo per calcoli pesanti

### Accessibilità
- Font size base: 18px (leggibilità)
- Toggle caratteri grandi disponibile
- Contrasti colori WCAG AA compliant
- Icone sempre accompagnate da testo

---

## 🐛 BUG NOTI

- [ ] Notifiche iOS richiedono PWA installata (limitazione Safari)
- [ ] Mood sync potrebbe avere lag su connessioni lente
- [ ] Immagini molto grandi potrebbero causare crash (da testare)

---

## 💡 IDEE FUTURE

- **Modalità Notte**: Dark mode per ridurre affaticamento visivo
- **Multi-lingua**: Supporto inglese, spagnolo
- **Video chiamate**: Integrazione Jitsi/Zoom per videochiamate famiglia
- **Geolocalizzazione**: Tracking posizione paziente (con consenso)
- **Wearable Integration**: Smartwatch per monitoraggio parametri vitali
- **Voice Assistant**: Comandi vocali per pazienti con difficoltà motorie

---

## 📞 CONTATTI

**Sviluppatori**: Daniele Spalletti & Michele Mosca  
**Azienda**: CosmoNet.info  
**Email**: info@cosmonet.info  
**Cliente**: Airalzh  

---

**Ultimo aggiornamento**: 27 Gennaio 2026, ore 02:17
