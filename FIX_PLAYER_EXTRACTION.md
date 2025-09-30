# Fix: Player Data Extraction from Nested Structure

## Problem
The player loading function in `edit_convocation.html` was unable to load players because the data structure in Firestore had changed. Players data is now stored in a nested structure where fields are inside `raw.nome`:

```
giocatoreData.raw.nome.numero
giocatoreData.raw.nome.nome
giocatoreData.raw.nome.dataNascita
giocatoreData.raw.nome.matricola
```

The old code was trying to access these fields directly from the root document, causing players to not be loaded.

## Solution
Updated the `loadConvocation()` function in `edit_convocation.html` to:

1. **Extract from nested structure**: Check if `raw.nome` exists and extract fields from there
2. **Fallback to legacy format**: If `raw.nome` doesn't exist, fall back to direct field access for backward compatibility
3. **Enhanced logging**: Added comprehensive debug logs showing:
   - Complete raw document structure
   - Which extraction method was used (nested or fallback)
   - Whether each player was successfully added or ignored
4. **Validation**: Players without required fields (numero, nome) are properly logged and ignored

## Code Changes

### Before
```javascript
giocatoriSnapshot.forEach((doc) => {
    const giocatoreData = doc.data();
    console.log('📄 Giocatore trovato:', {
        id: doc.id,
        numero: giocatoreData.numero,
        nome: giocatoreData.nome,
        dataNascita: giocatoreData.dataNascita,
        matricola: giocatoreData.matricola
    });
    
    if (giocatoreData.numero && giocatoreData.nome) {
        companyPlayers.push({
            numero: giocatoreData.numero,
            nome: giocatoreData.nome,
            dataNascita: giocatoreData.dataNascita,
            matricola: giocatoreData.matricola
        });
    }
});
```

### After
```javascript
giocatoriSnapshot.forEach((doc) => {
    const giocatoreData = doc.data();
    
    // Log raw structure for debugging
    console.log('📄 Giocatore documento completo:', {
        id: doc.id,
        rawData: giocatoreData
    });
    
    // Extract fields from nested structure (raw.nome) with fallback to direct fields
    let numero, nome, dataNascita, matricola;
    
    // Try nested structure first (raw.nome.campo)
    if (giocatoreData.raw && giocatoreData.raw.nome) {
        numero = giocatoreData.raw.nome.numero;
        nome = giocatoreData.raw.nome.nome;
        dataNascita = giocatoreData.raw.nome.dataNascita;
        matricola = giocatoreData.raw.nome.matricola;
        console.log('✅ Dati estratti da raw.nome:', {
            numero, nome, dataNascita, matricola
        });
    }
    // Fallback to direct fields (legacy structure)
    else {
        numero = giocatoreData.numero;
        nome = giocatoreData.nome;
        dataNascita = giocatoreData.dataNascita;
        matricola = giocatoreData.matricola;
        console.log('ℹ️ Dati estratti direttamente (fallback):', {
            numero, nome, dataNascita, matricola
        });
    }
    
    // Store giocatore objects with numero and nome
    if (numero && nome) {
        companyPlayers.push({
            numero: numero,
            nome: nome,
            dataNascita: dataNascita,
            matricola: matricola
        });
        console.log('➕ Giocatore aggiunto alla lista:', `${numero} ${nome}`);
    } else {
        console.warn('⚠️ Giocatore ignorato (mancano numero o nome):', {
            id: doc.id, numero, nome
        });
    }
});
```

## Testing

### Unit Test
Created `/tmp/test_player_extraction.js` that validates:
- ✅ Correct extraction from nested `raw.nome` structure
- ✅ Fallback to legacy direct field structure  
- ✅ Proper handling of missing required fields
- ✅ All players with valid data are loaded correctly

### UI Test
Created visual test page that demonstrates:
- Players with nested structure (raw.nome) are extracted correctly
- Legacy format players work via fallback
- Players missing required fields are properly ignored
- Player list displays correctly in the UI

## Expected Console Output

When loading players, you should now see detailed logs like:

```
🔄 [DEBUG] Caricamento giocatori da Firestore...
   📍 Percorso: societa/XXX/giocatori
   📄 Giocatore documento completo: { id: 'player1', rawData: {...} }
   ✅ Dati estratti da raw.nome: { numero: '1', nome: 'BERNUCCI ROMEO', ... }
   ➕ Giocatore aggiunto alla lista: 1 BERNUCCI ROMEO
   ...
✅ [DEBUG] Giocatori caricati dalla subcollection con successo
   📊 Totale giocatori: 4
   👥 Lista giocatori: 1 BERNUCCI ROMEO, 7 CALLIKU ANDREA, ...
```

## Verification

The fix has been tested and verified to:
1. ✅ Extract player data from the nested `raw.nome` structure
2. ✅ Provide detailed logging for debugging
3. ✅ Maintain backward compatibility with legacy data
4. ✅ Properly validate and filter players
5. ✅ Display players correctly in the UI

## Files Modified
- `edit_convocation.html` - Updated player loading logic in `loadConvocation()` function
