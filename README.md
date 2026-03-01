# Memora 🧠

Un'applicazione mobile premium progettata per supportare i pazienti affetti da Alzheimer e i loro caregiver, offrendo strumenti intuitivi per la gestione quotidiana, la memoria e la socialità.

## 🎨 Design & Branding
L'applicazione segue l'identità visiva ufficiale di **Airalzh Onlus** ed è stata rinominata **Memora** per riflettere la sua missione.
- **Palette Colori**: Viola Vibrante (`#9C69A7`), Prugna Scuro (`#4A304F`) e Lilla Chiarissimo (`#F7F3FA`).
- **Icona**: Logo moderno con cervello stilizzato in palette ufficiale.
- **Interfaccia**: Design mobile-first stile iOS, ottimizzato per l'accessibilità e la facilità d'uso.

## 🚀 Funzionalità Principali

### ✅ Gestione Attività (Todolist)
Una lista quotidiana chiara per gestire medicine, idratazione e appuntamenti. Include funzioni di:
- Inserimento rapido di nuovi task.
- Spunta di completamento con feedback visivo.
- Cancellazione rapida.

### 📸 MemoraBook (Social Feed)
Uno spazio sicuro per condividere momenti e pensieri con la comunità.
- **Post Interattivi**: Condivisione di messaggi di testo e immagini.
- **Caricamento Foto**: Supporto per l'upload di immagini con ridimensionamento automatico intelligente per prestazioni ottimali.
- **Gestione Contenuti**: Possibilità di modificare ed eliminare i propri post.
- **Lightbox**: Visualizzazione delle immagini a tutto schermo per una migliore visibilità.

### 🆘 Sicurezza & Emergenza (SOS)
- **Contatti SOS**: Numero di emergenza configurabile per chiamate rapide.
- **Supporto Tecnico**: Collegamento diretto al servizio "Pronto Alzheimer".

### ⚙️ Personalizzazione & PWA
- **Caratteri Grandi**: Modalità accessibilità per una lettura facilitata.
- **Installabile**: Configurazione PWA completa per aggiungere l'app alla Home dello smartphone con icona dedicata.

## 🛠️ Tecnologie Utilizzate
- **Frontend**: React + Vite
- **Icone**: Lucide-React
- **Database & Real-time**: Supabase (Database + Auth + Storage per immagini)
- **PWA**: Web App Manifest & Apple Touch Support

## 📦 Installazione Locale

```bash
# Clona il repository
git clone https://github.com/CosmoNetinfo/AlzheimerApp.git

# Entra nella cartella
cd AlzheimerApp

# Installa le dipendenze
npm install

# Avvia l'app in modalità sviluppo
npm run dev
```

### 🗄️ Configurazione Database
Per configurare correttamente Supabase (Database, Auth e Storage per le foto profilo), segui la **[Guida Supabase](GUIDA_SUPABASE.md)**.

---

## 👥 Per i Collaboratori
Se stai lavorando a questo progetto, è **fondamentale** seguire queste regole:
1. Leggi sempre il file **[PROGETTO_RECAP.md](PROGETTO_RECAP.md)** per conoscere lo stato attuale dei lavori.
2. Ogni volta che fai un push, aggiorna la sezione **Changelog** in fondo a `PROGETTO_RECAP.md`.

*Sviluppato con dedizione da **Daniele Spalletti** ([cosmonet.info](https://www.cosmonet.info)) per migliorare la qualità della vita quotidiana attraverso la tecnologia.*
