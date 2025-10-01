# Changelog V6.5 - Remove Button for Forced Convocations

## Data: 2024
## Versione: V6.5

## Panoramica
Aggiunto il pulsante rosso "Togli dalla convocazione" nel popup quando il Mister clicca su un giocatore non disponibile che è già stato convocato forzatamente.

## Problema Risolto
Quando il Mister selezionava un giocatore non disponibile usando "Convoca ugualmente", non c'era modo di rimuovere la convocazione forzata cliccando di nuovo sul giocatore. Il popup mostrava sempre solo "Convoca ugualmente" e "Ok".

## Soluzione Implementata

### 1. Nuovo Pulsante HTML (Riga 671)
Aggiunto un nuovo pulsante rosso nascosto per default:
```html
<button id="togli-convocazione-button" class="w-full py-3 mb-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 hidden">
    Togli dalla convocazione
</button>
```

### 2. Riferimento JavaScript (Riga 1150)
Aggiunto il riferimento al pulsante nelle costanti:
```javascript
const togliConvocazioneButton = document.getElementById('togli-convocazione-button');
```

### 3. Logica di Visualizzazione Dinamica (Righe 3233-3257)
Modificata la funzione `showUnavailablePlayerModal` per:
- Controllare se il giocatore è già selezionato (`selected-mister` class)
- Mostrare "Togli dalla convocazione" se il giocatore è già convocato
- Mostrare "Convoca ugualmente" se il giocatore non è ancora convocato
- Supportare array di motivi (compatibilità con V6.5 multi-select)

```javascript
function showUnavailablePlayerModal(playerName, reason) {
    unavailablePlayerName.textContent = playerName;
    // V6.5: Handle array of reasons (from multi-select feature)
    const reasonText = Array.isArray(reason) ? reason.join(', ') : reason;
    unavailablePlayerReason.textContent = reasonText;
    
    // V6.5: Check if player is already selected (forced convocation)
    const playerItem = document.querySelector(`.player-item[data-player="${playerName}"]`);
    const isAlreadySelected = playerItem && playerItem.classList.contains('selected-mister');
    
    // Show/hide buttons based on selection status
    if (isAlreadySelected) {
        convocaComunqueButton.classList.add('hidden');
        togliConvocazioneButton.classList.remove('hidden');
    } else {
        convocaComunqueButton.classList.remove('hidden');
        togliConvocazioneButton.classList.add('hidden');
    }
    
    unavailablePlayerModal.classList.remove('hidden', 'opacity-0');
    unavailablePlayerModal.classList.add('flex', 'opacity-100');
    tempUnavailablePlayerName = playerName;
}
```

### 4. Event Handler per Rimozione (Righe 3824-3835)
Aggiunto l'event handler per il pulsante "Togli dalla convocazione":
```javascript
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

### 5. Aggiornamento Versione
- Versione visibile aggiornata a "V 6.5" (Riga 214)
- Commento HTML aggiunto (Riga 2): `<!-- Version: V6.5 - Added remove button for forced convocations of unavailable players -->`

## Flusso Utente
1. **Primo click su giocatore non disponibile**: Mostra popup con "Convoca ugualmente" (verde)
2. **Click su "Convoca ugualmente"**: Il giocatore viene aggiunto alla convocazione (classe `selected-mister`)
3. **Secondo click sullo stesso giocatore**: Mostra popup con "Togli dalla convocazione" (rosso)
4. **Click su "Togli dalla convocazione"**: Il giocatore viene rimosso dalla convocazione

## Compatibilità
- ✅ Compatibile con feature multi-select V6.5 (gestisce array di motivi)
- ✅ Compatibile con dati V6.4 e precedenti (gestisce stringhe singole)
- ✅ Nessun impatto su funzionalità esistenti

## Test Effettuati
- ✅ Test manuale con file test_v65_remove_button.html
- ✅ Verificato corretto cambio tra "Convoca ugualmente" e "Togli dalla convocazione"
- ✅ Verificato aggiunta e rimozione dalla lista giocatori convocati
- ✅ Verificato aggiornamento live list dei convocati

## File Modificati
- `index_backup.html`: Tutte le modifiche implementate

## Note Implementazione
- Il pulsante "Togli dalla convocazione" è nascosto per default con classe `hidden`
- La visibilità viene gestita dinamicamente in base allo stato del giocatore
- Il colore rosso del pulsante comunica chiaramente l'azione di rimozione
- Mantiene la stessa user experience del pulsante "Convoca ugualmente"
