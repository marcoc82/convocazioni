# Reset Automatico Indisponibilità - Fix e Miglioramenti

## 🐛 Problema Risolto

### Bug Originale
Il reset automatico delle indisponibilità avveniva **ogni lunedì a mezzanotte** invece che **la domenica a mezzanotte** come richiesto.

**Requisito originale:** "Ogni settimana (la domenica sera) bisogna resettare automaticamente lo stato delle indisponibilità per tutti i giocatori"

### Causa del Bug
La funzione `getLastMonday()` calcolava l'inizio della settimana come il lunedì alle 00:00, quindi:
- Domenica → Restituiva il lunedì della settimana PRECEDENTE
- Lunedì → Restituiva il lunedì della settimana CORRENTE
- **Risultato:** Reset avveniva il lunedì, non la domenica

## ✅ Soluzione Implementata

### 1. Fix della Logica di Reset

**Vecchio codice (Bug):**
```javascript
const getLastMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};
```

**Nuovo codice (Fix):**
```javascript
const getLastSunday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    // Se è domenica (day = 0), siamo già all'inizio settimana
    // Altrimenti sottrai i giorni per arrivare a domenica
    const diff = day === 0 ? 0 : day;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
};
```

**Comportamento corretto:**
- **Domenica 00:00** → Restituisce domenica corrente (nuova settimana) → ✅ **RESET!**
- **Lunedì-Sabato** → Restituisce domenica della settimana corrente → ❌ Nessun reset

### 2. Aggiunta Display Data Reset

**Nuovo elemento HTML sopra le note:**
```html
<div id="reset-timestamp-display" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg hidden">
    <p class="text-sm text-blue-700">
        <span class="font-semibold">🔄 Ultimo reset indisponibilità:</span>
        <span id="reset-timestamp-text" class="ml-1">-</span>
    </p>
</div>
```

**Funzione JavaScript per aggiornare il display:**
```javascript
function updateResetTimestampDisplay() {
    const RESET_KEY = 'lastUnavailabilityReset';
    const lastResetStr = localStorage.getItem(RESET_KEY);
    
    if (lastResetStr && resetTimestampDisplay && resetTimestampText) {
        const lastResetDate = new Date(lastResetStr);
        const formattedDate = lastResetDate.toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        resetTimestampText.textContent = formattedDate;
        resetTimestampDisplay.classList.remove('hidden');
    } else if (resetTimestampDisplay) {
        resetTimestampDisplay.classList.add('hidden');
    }
}
```

**Posizionamento:** Il display appare sopra la sezione "Note (Segnate dal Dirigente)" sia per il Mister che per il Dirigente.

## 📊 Test e Verifica

### Test Logic Comparison

| Data/Ora Test | Vecchia Logica (Monday) | Nuova Logica (Sunday) | Reset? |
|---------------|------------------------|----------------------|--------|
| Dom 19 Gen 10:00 | Lun 13 Gen (settimana prec.) | Dom 19 Gen (settimana corr.) | ✅ SÌ |
| Lun 20 Gen 10:00 | Lun 20 Gen | Dom 19 Gen | ❌ NO |
| Mar 21 Gen 10:00 | Lun 20 Gen | Dom 19 Gen | ❌ NO |
| Sab 25 Gen 10:00 | Lun 20 Gen | Dom 19 Gen | ❌ NO |
| Dom 26 Gen 10:00 | Lun 20 Gen | Dom 26 Gen | ✅ SÌ |

### Screenshot del Test
![Test Reset Logic](https://github.com/user-attachments/assets/7cf8c30c-eae4-497e-95da-381094cefe9a)

Il test mostra chiaramente:
- **Vecchia logica:** Inizio settimana lunedì 29 settembre
- **Nuova logica:** Inizio settimana domenica 5 ottobre
- **Differenza:** 6 giorni (una settimana di anticipo)
- **✅ È Domenica! Con la nuova logica il reset si attiva!**

## 📁 File Modificati

| File | Modifiche | Righe |
|------|-----------|-------|
| `index.html` | Fix logica reset + display timestamp | ~50 righe |
| `index_backup.html` | Aggiunta display timestamp | ~8 righe |
| `test_reset_fix.html` | Nuovo file di test | Nuovo |

## 🔄 Integrazione

### Quando viene chiamata la funzione di update:

1. **Al caricamento delle note** (riga ~3771):
   ```javascript
   const notesUnsub = window.onSnapshot(notesDocRef, (docSnap) => {
       // ... caricamento note ...
       updateNotesDisplay();
       updateResetTimestampDisplay(); // ← Chiamata aggiunta
   });
   ```

2. **Dopo un reset automatico** (riga ~2460):
   ```javascript
   async function resetUnavailablePlayersInFirebase() {
       // ... reset firebase ...
       renderPlayers();
       updateUnavailablePlayersView();
       updateResetTimestampDisplay(); // ← Chiamata aggiunta
   }
   ```

## ✅ Risultati

### Prima del Fix:
- ❌ Reset avveniva lunedì a mezzanotte
- ❌ Nessuna visibilità sulla data dell'ultimo reset
- ❌ Non conforme al requisito "domenica sera"

### Dopo il Fix:
- ✅ Reset avviene domenica a mezzanotte (00:00)
- ✅ Display visibile della data/ora ultimo reset
- ✅ Conforme al requisito originale
- ✅ Il dirigente può verificare quando è avvenuto l'ultimo reset

## 🎯 Comportamento Atteso

### Scenario Tipico (Domenica 00:00):
1. L'applicazione carica i dati delle indisponibilità
2. La funzione `checkAndResetWeeklyUnavailability()` viene chiamata
3. Rileva che è domenica 00:00 (nuova settimana)
4. Chiama `resetUnavailablePlayersInFirebase()`
5. Cancella tutte le indisponibilità da Firebase
6. Aggiorna il display con la nuova data di reset
7. Il dirigente vede "🔄 Ultimo reset indisponibilità: domenica 5 ottobre 2025 alle ore 00:00"

### localStorage
- **Key:** `lastUnavailabilityReset`
- **Value:** ISO timestamp della domenica 00:00 della settimana corrente
- **Esempio:** `"2025-10-05T00:00:00.000Z"`

## 📝 Note Tecniche

- La settimana ora inizia domenica alle 00:00 (giorno 0 in JavaScript)
- Formato data italiano con giorno della settimana, data completa e ora
- Il display è visibile solo se esiste un reset precedente in localStorage
- Compatibile con entrambi i ruoli (Mister e Dirigente)
- Nessun breaking change: funzionalità esistenti non alterate

## 🔍 Verifica Manuale

Per verificare il fix:
1. Aprire `test_reset_fix.html` nel browser
2. Selezionare una domenica alle 00:00
3. Cliccare "Esegui Test"
4. Verificare che la nuova logica mostri la domenica come inizio settimana
5. Verificare che il sistema rilevi che è domenica e attivi il reset
