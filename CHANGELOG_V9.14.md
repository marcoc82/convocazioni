# Changelog - Version 9.14

## 📅 Data Release
Gennaio 2025

## 🎯 Requisiti Implementati

### Requisito 1: Informazioni Società Sempre Presenti nella Distinta
**Descrizione:** Quando si crea una distinta, le informazioni sulla società devono essere sempre presenti, anche se non si è visitata la pagina Gestione Squadra prima.

**Problema Risolto:**
- Prima: Se l'utente non visitava la pagina "Gestione Squadra", le informazioni società non erano disponibili quando si creava la distinta
- La funzione `createDistintaContent()` caricava i dati solo da localStorage, che veniva popolato solo dopo aver visitato Gestione Squadra

**Implementazione:**
1. **Caricamento automatico all'avvio** (linea ~6497)
   - Aggiunto `await loadCompanyInfo()` nella funzione `startApp()`
   - Le informazioni società vengono ora caricate automaticamente all'avvio dell'app
   
2. **Fallback intelligente nella distinta** (linea ~7628-7654)
   - Aggiunto fallback nella funzione `createDistintaContent()`
   - Se le informazioni complete non sono disponibili in localStorage, usa i dati base:
     - Nome società da `currentCompanyData`
     - Categoria da localStorage
   
**Codice:**
```javascript
// In startApp() - linea ~6497
async function startApp(appId) {
    // ... codice esistente ...
    
    // V9.14: Load company info at app start to ensure it's available for distinta
    await loadCompanyInfo();
    
    // ... resto del codice ...
}

// In createDistintaContent() - linea ~7628
let companyInfo = {};
try {
    const savedInfo = localStorage.getItem(`companyInfo_${currentCompanyCode}`);
    if (savedInfo) {
        companyInfo = JSON.parse(savedInfo);
        console.log('✅ CREATE DISTINTA: Company info loaded from localStorage:', companyInfo);
    } else {
        console.log('ℹ️ CREATE DISTINTA: No company info in localStorage, using defaults from currentCompanyData');
        // V9.14: Fallback to basic company info if not saved in Gestione Squadra
        companyInfo = {
            ragioneSociale: companyName,
            categoria: companyCategory
        };
    }
} catch (error) {
    console.warn('⚠️ CREATE DISTINTA: Could not parse company info:', error);
    // V9.14: Fallback to basic company info on error
    companyInfo = {
        ragioneSociale: companyName,
        categoria: companyCategory
    };
}
```

---

### Requisito 2: Campo Note Auto-Resize Dinamico
**Descrizione:** Il campo NOTE (sia per mister che per dirigente) NON deve avere uno scroll fisso, ma deve ingrandirsi dinamicamente in base al contenuto inserito.

**Problema Risolto:**
- Prima: La textarea aveva `resize-none` e uno scroll verticale fisso quando il contenuto superava 3 righe
- Questo rendeva difficile visualizzare e modificare note lunghe

**Implementazione:**
1. **Modifica HTML della textarea** (linea 551)
   - Rimosso `resize-none` dalla classe
   - Aggiunto `style="min-height: 80px; overflow-y: hidden;"`
   - Mantiene altezza minima di 80px
   - Nasconde lo scroll verticale

2. **Funzione auto-resize JavaScript** (linea ~9221)
   - Creata funzione `autoResizeTextarea()` che ridimensiona la textarea
   - Aggiunto event listener `input` per ridimensionare durante la digitazione
   - Aggiornata `updateNotesDisplay()` per ridimensionare quando le note vengono caricate

**Codice:**
```html
<!-- HTML - linea 551 -->
<textarea id="notes-textarea" 
          placeholder="Inserisci le tue note qui..." 
          class="w-full p-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" 
          rows="3" 
          style="min-height: 80px; overflow-y: hidden;">
</textarea>
```

```javascript
// JavaScript - linea ~9221
// Auto-resize notes textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 80) + 'px';
}

// Add input event listener for auto-resize
notesTextarea.addEventListener('input', function() {
    autoResizeTextarea(this);
});

// In updateNotesDisplay() - linea ~5306
function updateNotesDisplay() {
    if (isDirigente()) {
        notesTextarea.value = currentNotes;
        // Auto-resize the textarea after setting the value
        if (notesTextarea) {
            notesTextarea.style.height = 'auto';
            notesTextarea.style.height = Math.max(notesTextarea.scrollHeight, 80) + 'px';
        }
    } else if (userRole === 'mister') {
        // ... codice readonly ...
    }
}
```

**Comportamento:**
- ✅ La textarea si espande automaticamente mentre si digita
- ✅ Non mostra mai scrollbar verticale
- ✅ Mantiene un'altezza minima di 80px
- ✅ Si adatta al contenuto quando le note vengono caricate

---

### Requisito 3: Contatori Mister e Dirigenti in Gestione Squadra
**Descrizione:** Nella pagina Gestione Squadra, mostrare il numero di mister e dirigenti accanto ai rispettivi pulsanti, come già fatto per Gestione Giocatori.

**Implementazione:**
1. **Aggiornamento HTML dei titoli** (linee 438, 457)
   - Aggiunto `<span id="coaches-count">0</span>` in "Gestione Mister"
   - Aggiunto `<span id="directors-count">0</span>` in "Gestione Dirigenti"
   - Stile consistente con "Gestione Giocatori" (già implementato in V7.6)

2. **Aggiornamento funzioni render** (linee ~6623, ~6713)
   - Modificata `renderCompanyCoaches()` per aggiornare il contatore
   - Modificata `renderCompanyDirectors()` per aggiornare il contatore
   - I contatori si aggiornano automaticamente quando si aggiungono/rimuovono elementi

**Codice:**
```html
<!-- HTML - linea 438 -->
<h3 class="text-lg font-semibold text-gray-700 mb-4">
    Gestione Mister (<span id="coaches-count">0</span>)
</h3>

<!-- HTML - linea 457 -->
<h3 class="text-lg font-semibold text-gray-700 mb-4">
    Gestione Dirigenti (<span id="directors-count">0</span>)
</h3>
```

```javascript
// renderCompanyCoaches() - linea ~6623
function renderCompanyCoaches() {
    companyCoachesList.innerHTML = '';
    
    // Update coaches count in title
    const coachesCountElement = document.getElementById('coaches-count');
    if (coachesCountElement) {
        coachesCountElement.textContent = companyCoaches.length;
    }
    
    // ... resto del codice rendering ...
}

// renderCompanyDirectors() - linea ~6713
function renderCompanyDirectors() {
    companyDirectorsList.innerHTML = '';
    
    // Update directors count in title
    const directorsCountElement = document.getElementById('directors-count');
    if (directorsCountElement) {
        directorsCountElement.textContent = companyDirectors.length;
    }
    
    // ... resto del codice rendering ...
}
```

**Risultato:**
- Gestione Giocatori (5) ← già esistente da V7.6
- Gestione Mister (2) ← **nuovo in V9.14**
- Gestione Dirigenti (3) ← **nuovo in V9.14**

---

### Requisito 4: Aggiornamento Versione App
**Descrizione:** Aggiornare la versione dell'app da V9.13 a V9.14.

**Implementazione:**
- Aggiornato commento versione in index.html (linea 2)
- Da: `<!-- Version: V9.13 - Fix automatic training status calculation... -->`
- A: `<!-- Version: V9.14 - Fix company info in distinta, auto-resize notes textarea, show mister/dirigenti counts -->`

---

## 🧪 Testing

È stato creato un file di test completo: `test_v914_changes.html`

### Test 1: Verifica Versione
- ✅ PASS - Versione corretta: V9.14

### Test 2: Auto-resize Textarea
- ✅ PASS - La textarea si espande correttamente
- ✅ PASS - Nessuna scrollbar verticale
- ✅ PASS - Altezza minima 80px rispettata
- ✅ PASS - 12 ridimensionamenti rilevati durante la digitazione

### Test 3: Contatori Mister e Dirigenti
- ✅ PASS - Contatore mister aggiorna correttamente (0 → 1 → 2)
- ✅ PASS - Contatore dirigenti aggiorna correttamente (0 → 1 → 2)
- ✅ PASS - Rimozione elementi aggiorna i contatori

### Test 4: Company Info Fallback
- ✅ PASS - Fallback funzionante quando localStorage è vuoto
- ✅ PASS - Dati base utilizzati: `{"ragioneSociale":"Test Società","categoria":""}`

---

## 📸 Screenshots

### Test Completo V9.14
![Test V9.14 Initial](https://github.com/user-attachments/assets/8cf579a9-06d2-438f-902e-be7f79c69c4f)

### Auto-resize Textarea Dimostrazione
![Textarea Expanded](https://github.com/user-attachments/assets/09aa9e33-ff84-4408-859f-082008a1e3bd)

### Contatori Mister e Dirigenti + Fallback
![Test Complete](https://github.com/user-attachments/assets/afde55f6-095b-44a7-9906-850cff2b02ba)

---

## 🔧 File Modificati

1. **index.html**
   - Linea 2: Aggiornata versione a V9.14
   - Linea 438: Aggiunto contatore mister
   - Linea 457: Aggiunto contatore dirigenti
   - Linea 551: Rimosso resize-none, aggiunto auto-resize style
   - Linea ~5306: Aggiornata updateNotesDisplay() con auto-resize
   - Linea ~6497: Aggiunto loadCompanyInfo() in startApp()
   - Linea ~6623: Aggiornata renderCompanyCoaches() con contatore
   - Linea ~6713: Aggiornata renderCompanyDirectors() con contatore
   - Linea ~7628: Aggiunto fallback company info in createDistintaContent()
   - Linea ~9221: Aggiunta funzione auto-resize per textarea

2. **test_v914_changes.html** (nuovo file)
   - Test completo per tutti i requisiti V9.14

---

## ✅ Checklist Requisiti

- [x] Requisito 1: Informazioni società sempre presenti nella distinta
- [x] Requisito 2: Campo NOTE auto-resize dinamico
- [x] Requisito 3: Contatori mister e dirigenti
- [x] Requisito 4: Versione aggiornata a V9.14
- [x] Testing completato con successo
- [x] Screenshots documentati

---

## 🚀 Impatto

### Miglioramenti UX
1. **Distinta sempre completa**: Non più necessario visitare Gestione Squadra prima di creare una distinta
2. **Note più facili da gestire**: Textarea che si espande automaticamente rende più comodo scrivere note lunghe
3. **Migliore visibilità**: Contatori immediati per mister e dirigenti come già presente per i giocatori

### Compatibilità
- ✅ Retrocompatibile con versioni precedenti
- ✅ Fallback garantisce funzionamento anche senza dati salvati
- ✅ Auto-resize graceful degradation se JavaScript non disponibile

---

## 📝 Note Tecniche

- La funzione `autoResizeTextarea()` usa `scrollHeight` per calcolare l'altezza necessaria
- Il fallback per company info utilizza sempre almeno il nome base della società
- I contatori si aggiornano automaticamente tramite le funzioni render esistenti
- Tutte le modifiche sono minimali e chirurgiche per mantenere stabilità
