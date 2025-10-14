# Implementazione Storico Accessi - Solo Ultimo Accesso per Tipo

## 📋 Requisiti Implementati

Modificata la gestione dello storico accessi su Firebase per mantenere solo l'ultimo accesso per ciascun tipo di utente (ospite, mister, dirigente).

## 🔧 Modifiche Tecniche

### 1. Importazione Firestore Query e Where

**File**: `index.html` - Linea 93

Aggiunte le importazioni di `query` e `where` da Firebase Firestore:

```javascript
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, updateDoc, increment, deleteDoc, getDocs, arrayUnion, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
```

Aggiunti anche i riferimenti globali:

```javascript
window.query = query;
window.where = where;
```

### 2. Modifica Funzione logAccess()

**Comportamento nuovo**: Prima di salvare un nuovo accesso, cerca e cancella tutti gli accessi precedenti dello stesso tipo (role).

```javascript
async function logAccess(role, userCode = null) {
    try {
        if (!window.db || !window.collection || !window.addDoc || !currentCompanyDocumentId) {
            console.log('⚠️ Access log not available (missing Firestore or company ID)');
            return;
        }
        
        const accessLogBasePath = `societa/${currentCompanyDocumentId}`;
        const accessLogRef = window.collection(window.db, `${accessLogBasePath}/access_log`);
        
        // Delete previous accesses of the same role
        if (window.query && window.where && window.getDocs && window.deleteDoc && window.doc) {
            try {
                const q = window.query(accessLogRef, window.where('role', '==', role));
                const querySnapshot = await window.getDocs(q);
                
                // Delete all previous accesses of this role
                const deletePromises = [];
                querySnapshot.forEach(doc => {
                    const docRef = window.doc(window.db, `${accessLogBasePath}/access_log`, doc.id);
                    deletePromises.push(window.deleteDoc(docRef));
                });
                
                if (deletePromises.length > 0) {
                    await Promise.all(deletePromises);
                    console.log(`🗑️ Deleted ${deletePromises.length} previous access(es) for role: ${role}`);
                }
            } catch (deleteError) {
                console.error('⚠️ Error deleting previous accesses:', deleteError);
                // Continue even if deletion fails
            }
        }
        
        const accessData = {
            codiceSocieta: currentCompanyCode || 'N/A',
            role: role,
            userCode: userCode || 'N/A',
            timestamp: new Date().toISOString(),
            societaDocumentId: currentCompanyDocumentId
        };
        
        await window.addDoc(accessLogRef, accessData);
        console.log('✅ Access logged:', accessData);
    } catch (error) {
        console.error('❌ Error logging access:', error);
    }
}
```

**Flusso di esecuzione**:
1. Verifica che Firestore sia disponibile
2. Crea una query per trovare tutti gli accessi con lo stesso `role`
3. Cancella tutti gli accessi trovati
4. Salva il nuovo accesso

### 3. Modifica Funzione loadAccessLog()

**Comportamento nuovo**: Raggruppa gli accessi per role e mostra solo il più recente per ogni tipo.

```javascript
async function loadAccessLog() {
    try {
        // ... validation code ...
        
        const querySnapshot = await window.getDocs(accessLogRef);
        
        if (querySnapshot.empty) {
            accessLogList.innerHTML = '<p class="text-center text-gray-500">Nessun dato disponibile.</p>';
            return;
        }
        
        // Group accesses by role and keep only the most recent for each
        const accessByRole = {};
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const role = data.role;
            
            // If we don't have this role yet, or if this access is more recent
            if (!accessByRole[role] || new Date(data.timestamp) > new Date(accessByRole[role].timestamp)) {
                accessByRole[role] = { ...data, id: doc.id };
            }
        });
        
        // Convert to array and sort by timestamp descending
        const accessLogs = Object.values(accessByRole);
        accessLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (accessLogs.length === 0) {
            accessLogList.innerHTML = '<p class="text-center text-gray-500">Nessun dato disponibile.</p>';
            return;
        }
        
        // Display access logs (max 3 items: one per role)
        // ... rendering code ...
    } catch (error) {
        console.error('❌ Error loading access log:', error);
        accessLogList.innerHTML = '<p class="text-center text-red-500">Errore nel caricamento dello storico accessi.</p>';
    }
}
```

**Logica di raggruppamento**:
1. Carica tutti gli accessi dal database
2. Raggruppa per `role` mantenendo solo il più recente
3. Converte in array e ordina per timestamp
4. Mostra al massimo 3 elementi (uno per dirigente, uno per mister, uno per ospite)

### 4. Aggiornamento Messaggio Interfaccia

**File**: `index.html` - Linea 1431-1433

Aggiornato il messaggio informativo per riflettere il nuovo comportamento:

```html
<div class="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800 mb-4">
    <strong>ℹ️ Info:</strong> Ultimo accesso per ciascun tipo di utente (dirigenti, mister e ospiti)
</div>
```

## 📊 Prima/Dopo

| Aspetto | ❌ Prima | ✅ Dopo |
|---------|----------|---------|
| **Accessi salvati** | Tutti gli accessi | Solo ultimo per tipo |
| **Numero elementi** | Illimitato | Max 3 (uno per tipo) |
| **Duplicati** | Sì, molti duplicati | No, un solo accesso per tipo |
| **Messaggio vuoto** | "Nessun accesso registrato" | "Nessun dato disponibile" |
| **Cancellazione** | Manuale | Automatica al nuovo login |

## 🎯 Vantaggi

1. **Database più pulito**: Solo 3 documenti al massimo nella collezione `access_log` per ogni società
2. **Performance migliore**: Meno documenti da caricare e visualizzare
3. **Interfaccia più chiara**: Lista sempre concisa e facile da leggere
4. **Storage ridotto**: Firestore viene utilizzato in modo più efficiente

## ✅ Funzionalità Garantite

- ✅ Solo dirigenti possono vedere lo storico (click sul nome società)
- ✅ Ultimo accesso per dirigente viene salvato e visualizzato
- ✅ Ultimo accesso per mister viene salvato e visualizzato
- ✅ Ultimo accesso per ospite viene salvato e visualizzato
- ✅ Accessi precedenti dello stesso tipo vengono cancellati automaticamente
- ✅ Messaggio "Nessun dato disponibile" quando il database è vuoto
- ✅ Ordinamento per timestamp (più recente in alto)
- ✅ Badge colorati per tipo utente (arancione=dirigente, verde=mister, giallo=ospite)

## 🧪 Test

File di test creato: `test_access_log_last_only.html`

### Scenari di Test

#### 1. Dirigente effettua login multipli
- **GIVEN**: Un dirigente fa login 3 volte
- **WHEN**: Visualizza lo storico
- **THEN**: Vede solo l'ultimo accesso da dirigente

#### 2. Mister, Dirigente e Ospite fanno login
- **GIVEN**: Tutti e tre i tipi di utente fanno login
- **WHEN**: Dirigente visualizza lo storico
- **THEN**: Vede 3 accessi (uno per tipo)

#### 3. Nessun accesso registrato
- **GIVEN**: Database vuoto senza accessi
- **WHEN**: Dirigente visualizza lo storico
- **THEN**: Vede "Nessun dato disponibile"

#### 4. Solo dirigenti vedono lo storico
- **GIVEN**: Mister o Ospite loggato
- **WHEN**: Guarda il nome società
- **THEN**: Nome non è cliccabile

## 📝 Note Implementative

### Gestione Errori
- Se la cancellazione degli accessi precedenti fallisce, il nuovo accesso viene comunque salvato
- Se Firestore non è disponibile, viene mostrato un messaggio di errore

### Compatibilità
- Funziona con tutte le modalità di login:
  - Login normale (password)
  - Login biometrico
  - Login ospite

### Performance
- Usa `Promise.all()` per cancellare gli accessi precedenti in parallelo
- Raggruppa in memoria invece di fare query multiple

## 🔐 Firestore

### Struttura Dati
**Path**: `societa/{documentId}/access_log`

**Documento**:
```javascript
{
  codiceSocieta: "ACM2024",
  role: "dirigente",              // 'mister' | 'dirigente' | 'guest'
  userCode: "DIR001",              // Codice utente o 'N/A'
  timestamp: "2025-10-14T12:20:00.000Z",
  societaDocumentId: "abc123def456"
}
```

### Query Utilizzate
- `query(collection, where('role', '==', role))` - Trova accessi dello stesso tipo
- `getDocs(collection)` - Carica tutti gli accessi
- `deleteDoc(doc)` - Cancella un documento

## 📚 File Modificati

- `index.html` - Modifiche alle funzioni `logAccess()` e `loadAccessLog()`
- `test_access_log_last_only.html` - Nuovo file di test per la funzionalità

---

**Data Implementazione**: 14 Ottobre 2025  
**Status**: ✅ Completato
