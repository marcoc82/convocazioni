# 🔍 Ricerca Società in Firestore - cercaSocietaDaCodice.js

Questo repository contiene un snippet JavaScript completo per la ricerca di società in Firestore tramite il campo "codici".

## 📁 File Aggiunti

- **`cercaSocietaDaCodice.js`** - Snippet principale con tutte le funzioni di ricerca
- **`demo-cercaSocietaDaCodice.html`** - Pagina di demo interattiva per testare le funzioni

## 🚀 Caratteristiche

### Funzioni Principali

1. **`cercaSocietaDaCodice(codice)`** - Ricerca diretta per codice società
2. **`cercaSocietaAvanzata(codice, opzioni)`** - Ricerca avanzata con opzioni
3. **`esempiUtilizzo()`** - Esempi completi di utilizzo
4. **`verificaAccessoSocieta(codice)`** - Verifica accesso per codice

### Caratteristiche Tecniche

- ✅ Inizializzazione Firebase completa
- ✅ Query Firestore con `where` clause
- ✅ Gestione errori robusta
- ✅ Validazione input
- ✅ Documentazione JSDoc completa
- ✅ Esempi pratici di utilizzo
- ✅ Ricerca parziale e filtri avanzati

## 📊 Struttura Dati Attesa

Le società nella collection "societa" devono avere questa struttura:

```javascript
{
  "codici": "ABC123",              // Codice univoco della società
  "nome": "Nome Società",          // Nome della società
  "config": {                      // Configurazioni specifiche
    "campionato": "Serie A",
    "citta": "Milano"
  },
  "giocatori": [                   // Array dei giocatori
    "1 ROSSI MARIO",
    "2 BIANCHI LUIGI"
  ],
  "attiva": true,                  // Stato della società
  "dataCreazione": "2024-01-01"    // Data di creazione (opzionale)
}
```

## 🛠️ Setup e Configurazione

### 1. Configurazione Firebase

Modifica il file `cercaSocietaDaCodice.js` e sostituisci la configurazione fittizia:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:your-app-id",
    measurementId: "G-YOUR-MEASUREMENT-ID"
};
```

### 2. Utilizzo Base

```javascript
// Importa le funzioni
import { cercaSocietaDaCodice } from './cercaSocietaDaCodice.js';

// Cerca una società
const societa = await cercaSocietaDaCodice('ABC123');

if (societa) {
    console.log(`Trovata: ${societa.nome}`);
    console.log(`Giocatori: ${societa.giocatori.length}`);
} else {
    console.log('Società non trovata');
}
```

### 3. Ricerca Avanzata

```javascript
// Ricerca con opzioni avanzate
const risultati = await cercaSocietaAvanzata('ABC', {
    ricercaParziale: true,  // Cerca codici che iniziano con "ABC"
    soloAttive: true,       // Solo società attive
    limite: 10              // Massimo 10 risultati
});
```

## 🎮 Demo Interattiva

Apri `demo-cercaSocietaDaCodice.html` nel browser per:

- ✅ Testare le funzioni interattivamente
- ✅ Vedere esempi pratici in azione
- ✅ Verificare il corretto caricamento del modulo
- ✅ Ispezionare i risultati delle query

## 📝 Esempi di Utilizzo

Il file include esempi completi per:

1. **Ricerca Semplice** - Cerca società per codice esatto
2. **Gestione Errori** - Come gestire input non validi
3. **Ricerca Avanzata** - Utilizzo di filtri e opzioni
4. **Verifica Accesso** - Controllo validità e stato società

Esegui gli esempi con:

```javascript
import { esempiUtilizzo } from './cercaSocietaDaCodice.js';
await esempiUtilizzo();
```

## 🔧 Personalizzazione

### Campi Restituiti

La funzione restituisce un oggetto con:

```javascript
{
    id: "document-id",           // ID del documento Firestore
    nome: "Nome Società",        // Nome della società
    config: {},                  // Configurazioni
    giocatori: [],               // Array giocatori
    codici: "ABC123",            // Codice società
    dataCreazione: "2024-01-01", // Data creazione
    attiva: true                 // Stato attivo/inattivo
}
```

### Aggiungere Filtri

Modifica la funzione `cercaSocietaAvanzata` per aggiungere nuovi filtri:

```javascript
// Esempio: filtro per città
const q = query(
    societaRef, 
    where('codici', '==', codice),
    where('config.citta', '==', 'Milano')
);
```

## 🚨 Note Importanti

1. **Sicurezza**: Non esporre mai le chiavi Firebase nel codice client in produzione
2. **Indici**: Assicurati che Firestore abbia gli indici necessari per le query
3. **Performance**: La ricerca parziale può essere costosa su grandi dataset
4. **Validazione**: Sempre validare i dati prima dell'uso

## 🤝 Integrazione con il Progetto Esistente

Questo snippet è compatibile con la struttura Firebase esistente del progetto. Le funzioni possono essere facilmente integrate nel file `index.html` esistente o utilizzate come modulo separato.

## 📞 Support

Per problemi o domande, controlla:

1. Console del browser per errori Firebase
2. Configurazione Firebase (credenziali e regole)
3. Struttura dati nella collection "societa"
4. Connessione internet e permessi Firestore