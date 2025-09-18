# 🔍 Esempio Output Debug Logging - cercaSocietaDaCodice

Questo documento mostra come apparirebbero i log di debug quando le funzioni `cercaSocietaDaCodice` e `cercaSocietaAvanzata` vengono eseguite.

## 📋 Esempio 1: Ricerca Semplice Successiva

```javascript
await cercaSocietaDaCodice('POLIS2013');
```

**Output Debug Atteso:**
```
🔍 DEBUG - cercaSocietaDaCodice - Input originale: {
  codice: "POLIS2013",
  tipo: "string", 
  lunghezza: 9
}

📝 DEBUG - Codice normalizzato: {
  originale: "POLIS2013",
  normalizzato: "POLIS2013",
  trasformazioni: "trim() + toUpperCase()"
}

📂 DEBUG - Collection path: societa

🔎 DEBUG - Query costruita: {
  collection: "societa",
  campo: "codici",
  operatore: "==",
  valore: "POLIS2013",
  tipoQuery: "ricerca esatta"
}

⚡ DEBUG - Esecuzione query in corso...

📊 DEBUG - Risultati query: {
  numeroDocumenti: 1,
  isEmpty: false,
  timestamp: "2024-01-15T10:30:45.123Z"
}

📄 DEBUG - Dettagli documento trovato: {
  documentId: "abc123def456",
  esisteCampoNome: true,
  esisteCampoConfig: true,
  esisteCampoGiocatori: true,
  esisteCampoCodici: true,
  esisteCampoAttiva: true,
  numeroCampiTotali: 8,
  campiDisponibili: ["nome", "codici", "config", "giocatori", "attiva", "dataCreazione", "categoria", "responsabile"]
}

✅ DEBUG - Dati estratti e strutturati: {
  id: "abc123def456",
  nome: "ASD Polis 2013",
  numeroGiocatori: 25,
  numeroConfigurazioni: 4,
  codici: "POLIS2013",
  attiva: true,
  dataCreazione: "2023-09-01T00:00:00Z"
}

✅ Società trovata: ASD Polis 2013
```

## 📋 Esempio 2: Ricerca che Non Trova Risultati

```javascript
await cercaSocietaDaCodice('CODICE_INESISTENTE');
```

**Output Debug Atteso:**
```
🔍 DEBUG - cercaSocietaDaCodice - Input originale: {
  codice: "CODICE_INESISTENTE",
  tipo: "string",
  lunghezza: 17
}

📝 DEBUG - Codice normalizzato: {
  originale: "CODICE_INESISTENTE", 
  normalizzato: "CODICE_INESISTENTE",
  trasformazioni: "trim() + toUpperCase()"
}

📂 DEBUG - Collection path: societa

🔎 DEBUG - Query costruita: {
  collection: "societa",
  campo: "codici", 
  operatore: "==",
  valore: "CODICE_INESISTENTE",
  tipoQuery: "ricerca esatta"
}

⚡ DEBUG - Esecuzione query in corso...

📊 DEBUG - Risultati query: {
  numeroDocumenti: 0,
  isEmpty: true,
  timestamp: "2024-01-15T10:31:12.456Z"
}

❌ DEBUG - Nessuna società trovata con codice: CODICE_INESISTENTE
```

## 📋 Esempio 3: Ricerca Avanzata Parziale

```javascript
await cercaSocietaAvanzata('POLIS', {
  ricercaParziale: true,
  soloAttive: false,
  limite: 3
});
```

**Output Debug Atteso:**
```
🔍 DEBUG - cercaSocietaAvanzata - Input originale: {
  codice: "POLIS",
  tipo: "string",
  lunghezza: 5,
  opzioni: { ricercaParziale: true, soloAttive: false, limite: 3 }
}

⚙️ DEBUG - Opzioni elaborate: {
  ricercaParziale: true,
  soloAttive: false,
  limite: 3,
  tipoRicerca: "parziale"
}

📝 DEBUG - Codice normalizzato: {
  originale: "POLIS",
  normalizzato: "POLIS", 
  trasformazioni: "trim() + toUpperCase()"
}

📂 DEBUG - Collection path: societa

🔎 DEBUG - Query costruita (ricerca parziale): {
  collection: "societa",
  campo: "codici",
  condizione1: ">= POLIS",
  condizione2: "<= POLIS\uf8ff",
  tipoQuery: "ricerca parziale (range)"
}

⚡ DEBUG - Esecuzione query in corso...

📊 DEBUG - Risultati query: {
  numeroDocumenti: 3,
  isEmpty: false,
  timestamp: "2024-01-15T10:32:01.789Z"
}

📄 DEBUG - Documento 1: {
  documentId: "doc1",
  nome: "ASD Polis 2013", 
  codici: "POLIS2013",
  attiva: true,
  numeroGiocatori: 25
}

📄 DEBUG - Documento 2: {
  documentId: "doc2",
  nome: "Polis Calcio",
  codici: "POLIS_CALCIO_2024",
  attiva: false,
  numeroGiocatori: 18
}

📄 DEBUG - Documento 3: {
  documentId: "doc3", 
  nome: "Polisportiva Elite",
  codici: "POLIS_ELITE",
  attiva: true,
  numeroGiocatori: 30
}

✅ DEBUG - Riepilogo ricerca avanzata: {
  documentiTrovatiInQuery: 3,
  documentiEsaminati: 3,
  documentiEsclusiPerAttivita: 0,
  risultatiDopoFiltri: 3,
  risultatiFinaliDopoLimite: 3,
  limiteApplicato: 3,
  filtroAttivaApplicato: false
}
```

## 📋 Esempio 4: Gestione Errori Input Non Valido

```javascript
await cercaSocietaDaCodice('');
```

**Output Debug Atteso:**
```
🔍 DEBUG - cercaSocietaDaCodice - Input originale: {
  codice: "",
  tipo: "string",
  lunghezza: 0
}

❌ DEBUG - Codice società non valido
```

## 📋 Esempio 5: Gestione Errore Firebase

```javascript
// Se si verifica un errore di connessione o altro
await cercaSocietaDaCodice('TEST123');
```

**Output Debug Atteso in caso di errore:**
```
🔍 DEBUG - cercaSocietaDaCodice - Input originale: {
  codice: "TEST123",
  tipo: "string", 
  lunghezza: 7
}

📝 DEBUG - Codice normalizzato: {
  originale: "TEST123",
  normalizzato: "TEST123",
  trasformazioni: "trim() + toUpperCase()"
}

📂 DEBUG - Collection path: societa

🔎 DEBUG - Query costruita: {
  collection: "societa", 
  campo: "codici",
  operatore: "==",
  valore: "TEST123",
  tipoQuery: "ricerca esatta"
}

⚡ DEBUG - Esecuzione query in corso...

💥 DEBUG - Errore durante la ricerca della società: {
  messaggio: "FirebaseError: Missing or insufficient permissions.",
  stack: "Error stack trace...", 
  timestamp: "2024-01-15T10:33:15.321Z"
}
```

## 🎯 Vantaggi del Debug Logging

1. **🔍 Tracciabilità Completa**: Ogni passo della ricerca è tracciato
2. **📊 Metriche Dettagliate**: Numero di risultati, performance, filtri applicati
3. **🐛 Debug Facilitato**: Facile identificazione di problemi di configurazione
4. **📈 Monitoraggio**: Possibilità di analizzare l'uso delle funzioni
5. **🛠️ Sviluppo**: Supporto durante lo sviluppo e testing

## 📞 Come Utilizzare i Log

1. **Apri la Console del Browser** (F12 → Console)
2. **Esegui le funzioni di ricerca**
3. **Monitora i log colorati e strutturati**
4. **Analizza eventuali problemi basandoti sui dettagli forniti**

I log utilizzano emoji per facilitare la lettura e comprensione dei diversi tipi di informazioni.