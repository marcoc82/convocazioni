# Changelog - Version 7.5

## 📋 Requisito

**Problem Statement:**
> 1. Nella pagina del Dirigente, nel campo "Giocatori che hai segnato come non disponibili", mostra i nomi dei giocatori in grassetto (usa <strong> o una classe CSS come font-bold).
> 2. Quando accedi come Mister, se selezioni un giocatore che è stato segnato come non disponibile dal Dirigente e lo convochi ugualmente, il tasto del giocatore nella UI deve avere un bordo blu (ad esempio border-blue-500 o simile), così che sia evidente che è stato convocato nonostante l'indisponibilità.

---

## 📊 Comportamento

### Requisito 1: Bold Player Names in Dirigente View

**Prima (V7.4):**
- Nella vista Dirigente, i nomi dei giocatori nella lista "Giocatori che hai segnato come non disponibili" erano visualizzati in testo normale (non grassetto)
- Solo nella vista Mister i nomi erano in grassetto (implementato in V6.7)

**Dopo (V7.5):**
- Nella vista Dirigente, i nomi dei giocatori sono ora visualizzati in **grassetto** utilizzando `<strong class="font-bold">`
- Mantiene la stessa formattazione già presente nella vista Mister

**Rendering HTML (Dirigente View):**
```html
<li class="font-medium">
    <strong class="font-bold">10 ROSSI MARIO</strong>: Infortunato
</li>
<li class="font-medium">
    <strong class="font-bold">5 VERDI GIUSEPPE</strong>: Non disponibile Domenica
</li>
```

**Visualizzazione:**
- **10 ROSSI MARIO**: Infortunato
- **5 VERDI GIUSEPPE**: Non disponibile Domenica

---

### Requisito 2: Blue Border for Unavailable Players Called Up by Mister

**Prima (V7.4):**
- Quando il Mister convocava un giocatore non disponibile usando "Convoca ugualmente", il giocatore veniva visualizzato con lo stesso stile dei giocatori disponibili convocati (classe `selected-mister`)
- Non era visivamente evidente che il giocatore era stato convocato nonostante l'indisponibilità

**Dopo (V7.5):**
- Quando il Mister convoca un giocatore non disponibile, viene aggiunta la classe CSS `unavailable-forced`
- Questa classe applica un **bordo blu distintivo** (3px solid) per evidenziare che il giocatore è stato convocato nonostante l'indisponibilità

**CSS Aggiunto:**
```css
.player-item.selected-mister.unavailable-forced {
    border: 3px solid #3b82f6;
    border-color: #3b82f6;
}
```

**Comportamento:**
- Il bordo blu viene applicato quando si clicca "Convoca ugualmente" nel modale di avviso
- Il bordo blu viene rimosso quando si clicca "Togli dalla convocazione"
- Il bordo blu viene rimosso quando si resettano le selezioni del Mister

---

## ✅ Soluzione Implementata

### 1. Modifica della Funzione `updateUnavailablePlayersView()`

**File:** `index.html`  
**Linea:** ~4139-4161

**Prima (V7.4):**
```javascript
// V6.7: When Mister views the list, make player names bold
if (userRole === 'mister') {
    li.innerHTML = `<strong class="font-bold">${player}</strong>: ${statusText}`;
} else {
    li.textContent = `${player}: ${statusText}`;
}
```

**Dopo (V7.5):**
```javascript
// V6.7: When Mister views the list, make player names bold
// V7.5: Also make player names bold for Dirigente view
if (userRole === 'mister' || isDirigente()) {
    li.innerHTML = `<strong class="font-bold">${player}</strong>: ${statusText}`;
} else {
    li.textContent = `${player}: ${statusText}`;
}
```

**Cambiamenti:**
- Aggiunto check `|| isDirigente()` per applicare grassetto anche quando il Dirigente visualizza la lista
- Ora sia Mister che Dirigente vedono i nomi dei giocatori in grassetto
- Utilizzato `innerHTML` per supportare il tag `<strong>`

---

### 2. Aggiunta Classe CSS `unavailable-forced`

**File:** `index.html`  
**Linea:** ~97-99

**CSS Aggiunto:**
```css
/* V7.5: Unavailable player called up by Mister - distinctive blue border */
.player-item.selected-mister.unavailable-forced {
    border: 3px solid #3b82f6;
    border-color: #3b82f6;
}
```

**Descrizione:**
- Applica un bordo blu più spesso (3px) per distinguere i giocatori non disponibili convocati
- Si applica solo quando il giocatore ha entrambe le classi `selected-mister` e `unavailable-forced`

---

### 3. Aggiornamento Event Handler `convocaComunqueButton`

**File:** `index.html`  
**Linea:** ~6997-7008

**Prima (V7.4):**
```javascript
if (playerItem) {
    playerItem.classList.add('selected-mister');
    updateSelectedPlayersLiveList(tempUnavailablePlayerName, true);
}
```

**Dopo (V7.5):**
```javascript
if (playerItem) {
    playerItem.classList.add('selected-mister', 'unavailable-forced');
    updateSelectedPlayersLiveList(tempUnavailablePlayerName, true);
}
```

**Cambiamenti:**
- Aggiunta classe `unavailable-forced` quando il giocatore viene convocato nonostante l'indisponibilità

---

### 4. Aggiornamento Event Handler `togliConvocazioneButton`

**File:** `index.html`  
**Linea:** ~7010-7021

**Prima (V7.4):**
```javascript
if (playerItem) {
    playerItem.classList.remove('selected-mister');
    updateSelectedPlayersLiveList(tempUnavailablePlayerName, false);
}
```

**Dopo (V7.5):**
```javascript
if (playerItem) {
    playerItem.classList.remove('selected-mister', 'unavailable-forced');
    updateSelectedPlayersLiveList(tempUnavailablePlayerName, false);
}
```

**Cambiamenti:**
- Rimozione classe `unavailable-forced` quando il giocatore viene tolto dalla convocazione

---

### 5. Aggiornamento Funzione `resetMisterSelectionsWithoutConfirm()`

**File:** `index.html`  
**Linea:** ~3469-3475

**Prima (V7.4):**
```javascript
selectedPlayers.forEach(player => {
    player.classList.remove('selected-mister');
});
```

**Dopo (V7.5):**
```javascript
selectedPlayers.forEach(player => {
    player.classList.remove('selected-mister', 'unavailable-forced');
});
```

**Cambiamenti:**
- Rimozione classe `unavailable-forced` quando si resettano tutte le selezioni del Mister

---

### 6. Aggiornamento Versione

**File:** `index.html`  
**Linea:** 2

**Prima:**
```html
<!-- Version: V7.4 - Rounded up all percentages to integers (no decimals) in "Presenze Allenamenti" and "Riepilogo Convocazioni" -->
```

**Dopo:**
```html
<!-- Version: V7.5 - Bold player names in Dirigente unavailable list, blue border for unavailable players called by Mister -->
```

---

## 🎯 Visual Comparison

### Dirigente View - Unavailable Players List

**Prima (V7.4):**
```
Giocatori che hai segnato come non disponibili
• 10 ROSSI MARIO: Infortunato                    ← Normal weight
• 5 VERDI GIUSEPPE: Non disponibile Domenica     ← Normal weight
```

**Dopo (V7.5):**
```
Giocatori che hai segnato come non disponibili
• 10 ROSSI MARIO: Infortunato                    ← Bold name
• 5 VERDI GIUSEPPE: Non disponibile Domenica     ← Bold name
```

---

### Mister View - Player Selection UI

**Scenario:** Giocatore "10 ROSSI MARIO" è segnato come non disponibile dal Dirigente

**Prima (V7.4):**
- Quando il Mister clicca "Convoca ugualmente", il giocatore appare con lo stesso stile degli altri giocatori convocati
- Non è visivamente evidente che il giocatore è stato convocato nonostante l'indisponibilità

**Dopo (V7.5):**
- Quando il Mister clicca "Convoca ugualmente", il giocatore appare con un **bordo blu distintivo (3px solid)**
- È immediatamente chiaro che questo giocatore è stato convocato nonostante sia segnalato come non disponibile

---

## 📝 Test Cases

### Test 1: Dirigente View - Bold Player Names
1. Accedi come Dirigente
2. Segna alcuni giocatori come non disponibili
3. Verifica che nella sezione "Giocatori che hai segnato come non disponibili" i nomi dei giocatori siano in grassetto

**Risultato Atteso:** ✅ I nomi dei giocatori devono essere visualizzati in grassetto

---

### Test 2: Mister View - Blue Border on Forced Call-up
1. Accedi come Mister
2. Il Dirigente ha segnato "10 ROSSI MARIO" come non disponibile
3. Clicca sul giocatore "10 ROSSI MARIO"
4. Appare il modale di avviso
5. Clicca su "Convoca ugualmente"
6. Verifica che il tasto del giocatore abbia un bordo blu distintivo

**Risultato Atteso:** ✅ Il tasto del giocatore deve avere un bordo blu più spesso (3px) rispetto agli altri giocatori convocati

---

### Test 3: Mister View - Remove Blue Border on Deselection
1. Continua dal Test 2
2. Clicca nuovamente sul giocatore "10 ROSSI MARIO" (che ora ha il bordo blu)
3. Clicca su "Togli dalla convocazione"
4. Verifica che il bordo blu sia stato rimosso

**Risultato Atteso:** ✅ Il tasto del giocatore torna allo stile normale (rosso) per giocatori non disponibili

---

### Test 4: Mister View - Reset Selections
1. Convoca alcuni giocatori disponibili e alcuni non disponibili (con "Convoca ugualmente")
2. Clicca sul pulsante "Annulla" o reset
3. Verifica che tutti i bordi blu vengano rimossi

**Risultato Atteso:** ✅ Tutti i giocatori tornano allo stato iniziale, senza classi `selected-mister` o `unavailable-forced`

---

## 🔧 Technical Notes

### Perché usare `unavailable-forced` come classe separata?
- **Separazione delle responsabilità:** `selected-mister` indica che il giocatore è convocato, `unavailable-forced` indica che è stato convocato nonostante l'indisponibilità
- **Facilità di manutenzione:** Possiamo modificare lo stile dei giocatori non disponibili convocati senza influenzare gli altri giocatori convocati
- **Chiarezza del codice:** Il nome della classe descrive chiaramente il suo scopo

### Perché un bordo blu?
- Il blu è già il colore principale per le selezioni del Mister (classe `selected-mister`)
- Un bordo più spesso (3px invece del default) lo rende visivamente distintivo
- Mantiene la coerenza visiva con il resto dell'interfaccia

---

## ✅ Verification Checklist

- [x] **Requisito 1:** Player names in bold for Dirigente view
- [x] **Requisito 2:** Blue border for unavailable players called up by Mister
- [x] Version updated to V7.5
- [x] Comments and logs updated with V7.5 references
- [x] Changelog created (CHANGELOG_V7.5.md)
- [x] CSS class added for distinctive blue border
- [x] Event handlers updated to add/remove blue border class
- [x] Reset function updated to clean up blue border class

---

## 🎉 Summary

Version 7.5 successfully implements both requirements:

1. ✅ **Bold player names in Dirigente view** - Now Dirigente sees player names in bold in the "Giocatori che hai segnato come non disponibili" section, making it easier to identify players at a glance

2. ✅ **Blue border for unavailable players called by Mister** - When Mister calls up an unavailable player using "Convoca ugualmente", the player button displays a distinctive 3px blue border, making it immediately clear that this player was called up despite being marked as unavailable

These changes improve the user experience by providing better visual feedback and making important information more visible.
