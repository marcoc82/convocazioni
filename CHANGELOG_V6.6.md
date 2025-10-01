# Changelog V6.6 - Fix Unavailable Player Modal Behavior

## Data: 2024
## Versione: V6.6

## Panoramica
Corretto il comportamento del popup quando il Mister clicca su un giocatore non disponibile che è già stato convocato forzatamente. Il popup ora mostra SOLO il pulsante rosso "Togli dalla convocazione" (e non più il pulsante verde "Convoca ugualmente"), prevenendo l'aggiunta di convocazioni forzate duplicate.

## Problema Risolto
Quando il Mister selezionava un giocatore non disponibile usando "Convoca ugualmente", ricliccando sullo stesso giocatore il popup continuava a mostrare sia "Convoca ugualmente" che "Ok", permettendo potenzialmente di aggiungere più volte la stessa convocazione forzata. Questo comportamento non era corretto.

## Soluzione Implementata

### 1. Nuovo Pulsante HTML (Riga 944)
Aggiunto un nuovo pulsante rosso nascosto per default nel modal:
```html
<!-- V6.6: Pulsante per rimuovere convocazione forzata -->
<button id="togli-convocazione-button" class="w-full py-3 mb-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 hidden">
    Togli dalla convocazione
</button>
```

**Design:**
- Colore rosso (`bg-red-600`) per indicare chiaramente l'azione di rimozione
- Inizialmente nascosto con classe `hidden`
- Stesso stile del pulsante "Convoca ugualmente" per coerenza
- Posizionato tra "Convoca ugualmente" e "Ok"

### 2. Riferimento JavaScript (Riga 1591)
Aggiunto il riferimento al pulsante nelle costanti:
```javascript
const togliConvocazioneButton = document.getElementById('togli-convocazione-button'); // V6.6: pulsante per rimuovere convocazione forzata
```

### 3. Logica di Visualizzazione Dinamica (Righe 4871-4884)
Modificata la funzione `showUnavailablePlayerModal` per:
- Controllare se il giocatore è già selezionato (classe `selected-mister`)
- Mostrare SOLO "Togli dalla convocazione" se il giocatore è già convocato
- Mostrare SOLO "Convoca ugualmente" se il giocatore non è ancora convocato
- Supportare array di motivi (compatibilità con V6.5 multi-select)

```javascript
function showUnavailablePlayerModal(playerName, reason) {
    unavailablePlayerName.textContent = playerName;
    // V6.6: Handle both single status (string) and multiple statuses (array)
    const reasonText = Array.isArray(reason) ? reason.join(', ') : reason;
    unavailablePlayerReason.textContent = reasonText;
    
    // V6.6: Check if player is already selected (forced convocation)
    const playerItem = document.querySelector(`.player-item[data-player="${playerName}"]`);
    const isAlreadySelected = playerItem && playerItem.classList.contains('selected-mister');
    
    // Show/hide buttons based on selection status
    if (isAlreadySelected) {
        // Player is already selected - show remove button, hide convoca button
        convocaComunqueButton.classList.add('hidden');
        togliConvocazioneButton.classList.remove('hidden');
    } else {
        // Player is not selected - show convoca button, hide remove button
        convocaComunqueButton.classList.remove('hidden');
        togliConvocazioneButton.classList.add('hidden');
    }
    
    unavailablePlayerModal.classList.remove('hidden', 'opacity-0');
    unavailablePlayerModal.classList.add('flex', 'opacity-100');
    tempUnavailablePlayerName = playerName;
}
```

**Logica Chiave:**
- Verifica la presenza della classe `selected-mister` sul player-item
- Mostra/nasconde i pulsanti in modo mutuamente esclusivo
- Previene la possibilità di aggiungere convocazioni duplicate

### 4. Event Handler per Rimozione (Righe 6850-6862)
Aggiunto l'event handler per il pulsante "Togli dalla convocazione":
```javascript
// V6.6: Gestione pulsante "Togli dalla convocazione"
togliConvocazioneButton.addEventListener('click', () => {
    // Rimuove il giocatore dalla convocazione
    if (typeof tempUnavailablePlayerName === 'string' && tempUnavailablePlayerName.length > 0) {
        const playerItem = document.querySelector(`.player-item[data-player="${tempUnavailablePlayerName}"]`);
        if (playerItem) {
            playerItem.classList.remove('selected-mister');
            updateSelectedPlayersLiveList(tempUnavailablePlayerName, false);
        }
    }
    hideUnavailablePlayerModal();
});
```

**Implementazione:**
- Specchia la logica di "Convoca ugualmente" ma in senso inverso
- Rimuove la classe `selected-mister` dal player item
- Aggiorna la lista live dei giocatori selezionati
- Chiude il modal dopo l'azione

### 5. Aggiornamento Versione
- Versione visibile aggiornata a "V 6.6" (Riga 232)
- Commento HTML aggiornato (Riga 2): `<!-- Version: V6.6 - Fix unavailable player modal: show only "Togli dalla convocazione" button for already forced players, prevent duplicate forced convocations -->`

### 6. Aggiornamento Commenti
- Aggiornati tutti i commenti da V6.5 a V6.6 nelle sezioni modificate
- Aggiunto commento esplicativo nella gestione del pulsante "Convoca ugualmente" (Riga 6838)

## Flusso Utente Corretto

1. **Primo click su giocatore non disponibile**: 
   - Mostra popup con "Convoca ugualmente" (verde) e "Ok" (blu)
   
2. **Click su "Convoca ugualmente"**: 
   - Il giocatore viene aggiunto alla convocazione (classe `selected-mister`)
   - Il popup si chiude
   
3. **Secondo click sullo stesso giocatore**: 
   - Mostra popup con SOLO "Togli dalla convocazione" (rosso) e "Ok" (blu)
   - NON mostra più "Convoca ugualmente" per prevenire duplicati
   
4. **Click su "Togli dalla convocazione"**: 
   - Il giocatore viene rimosso dalla convocazione
   - Il popup si chiude
   
5. **Terzo click sullo stesso giocatore**:
   - Torna al punto 1: mostra "Convoca ugualmente"

## Compatibilità
- ✅ Compatibile con feature multi-select V6.5 (gestisce array di motivi)
- ✅ Compatibile con dati V6.4 e precedenti (gestisce stringhe singole)
- ✅ Nessun impatto su funzionalità esistenti
- ✅ Retrocompatibile con tutte le versioni precedenti

## Test Effettuati
- ✅ Verificato che il primo click mostri "Convoca ugualmente"
- ✅ Verificato che dopo "Convoca ugualmente", il secondo click mostri SOLO "Togli dalla convocazione"
- ✅ Verificato che "Togli dalla convocazione" rimuova il giocatore dalla convocazione
- ✅ Verificato che dopo la rimozione, il click successivo mostri di nuovo "Convoca ugualmente"
- ✅ Verificato che non sia possibile aggiungere convocazioni duplicate
- ✅ Verificato aggiornamento corretto della lista live dei convocati

## File Modificati
- `index.html`: Tutte le modifiche implementate (38 righe aggiunte, 4 modificate)

## Note Implementazione
- Il pulsante "Togli dalla convocazione" è nascosto per default con classe `hidden`
- La visibilità viene gestita dinamicamente in base allo stato del giocatore
- Il colore rosso del pulsante comunica chiaramente l'azione di rimozione
- Mantiene la stessa user experience del pulsante "Convoca ugualmente"
- I due pulsanti sono mutuamente esclusivi: non possono mai essere visibili contemporaneamente

## Differenze Rispetto a V6.5
V6.5 aveva implementato il pulsante "Togli dalla convocazione" in `index_backup.html` ma non in `index.html`. V6.6 porta questa funzionalità in `index.html` e migliora la logica:
- **V6.5**: Entrambi i pulsanti potevano essere visibili contemporaneamente
- **V6.6**: I pulsanti sono mutuamente esclusivi, prevenendo confusione e duplicati

## Benefici
1. **Prevenzione Errori**: Impossibile aggiungere convocazioni forzate duplicate
2. **UX Migliorata**: Chiaro quale azione è disponibile in ogni momento
3. **Intuitivo**: Il colore e il testo del pulsante comunicano chiaramente l'azione
4. **Consistente**: Mantiene il pattern di interazione stabilito nelle versioni precedenti

## Conclusione
La V6.6 risolve completamente il problema delle convocazioni forzate duplicate e migliora l'esperienza utente rendendo più chiaro quale azione è possibile in ogni momento. L'implementazione è pulita, ben commentata e completamente retrocompatibile.
