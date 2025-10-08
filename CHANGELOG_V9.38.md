# V9.38 - Changelog

## 📱 Aggiornamento PWA - Percorsi Icone con /convocazioni/

### Data
12 Gennaio 2025

### Modifiche Implementate

#### 1. ✅ manifest.json
**Percorsi Icone Aggiornati**

Aggiornato il percorso di tutte le icone PWA per includere il prefisso `/convocazioni/`:

**Prima:**
```json
"icons": [
  {
    "src": "favicon-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "icon-512.png",
    "sizes": "512x512",
    "type": "image/png"
  }
]
```

**Dopo:**
```json
"icons": [
  {
    "src": "/convocazioni/favicon-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "/convocazioni/icon-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any maskable"
  }
]
```

**Miglioramenti:**
- ✅ Percorsi assoluti con `/convocazioni/` per tutte le icone
- ✅ Aggiunto `"purpose": "any maskable"` all'icona 512x512 per migliore supporto PWA
- ✅ Icona principale 512x512 correttamente configurata per installazione PWA
- ✅ `start_url` confermato: `/convocazioni/index.html`
- ✅ Versione aggiornata a V9.38

#### 2. ✅ service-worker.js
**Versione Cache Aggiornata**

```javascript
// Prima
const CACHE_NAME = 'polis-convocazioni-v9.37';

// Dopo
const CACHE_NAME = 'polis-convocazioni-v9.38';
```

Questo garantisce che la nuova configurazione PWA venga correttamente cacheata.

#### 3. ✅ index.html
**Versione Aggiornata**

- **Commento HTML:** Aggiornato a `V9.38 - Updated manifest.json with /convocazioni/ paths for PWA icons`
- **Badge UI:** Aggiornato da `V 9.37` a `V 9.38` nella schermata di login

---

## 🎯 Requisiti Soddisfatti

Dal Problem Statement:

- ✅ **Aggiorna manifest.json per la root /convocazioni/index.html**  
  Confermato: `"start_url": "/convocazioni/index.html"` già presente

- ✅ **Imposta icona principale 512x512 per l'installazione PWA**  
  Confermato: `icon-512.png` con dimensione 512x512 e `"purpose": "any maskable"`

- ✅ **Controlla che tutte le icone abbiano il percorso /convocazioni/**  
  Completato: Entrambe le icone ora hanno il prefisso `/convocazioni/`

- ✅ **Se necessario, aggiorna la versione**  
  Completato: Versione aggiornata a V9.38 in manifest.json, service-worker.js e index.html

---

## 📋 File Modificati

1. **manifest.json**
   - Aggiornati percorsi icone con `/convocazioni/`
   - Aggiunto `purpose` per icona 512x512
   - Versione → V9.38

2. **service-worker.js**
   - Cache name → `polis-convocazioni-v9.38`

3. **index.html**
   - Commento versione → V9.38
   - Badge UI → V 9.38

---

## 🔍 Verifica PWA

### Come Testare

1. **Apri Chrome DevTools** (F12)
2. **Application → Manifest**
3. Verifica che:
   - ✅ Le icone mostrano il percorso `/convocazioni/`
   - ✅ L'icona 512x512 è presente e visualizzata
   - ✅ Start URL è `/convocazioni/index.html`
   - ✅ No errori nel manifest

### Test Installazione PWA

1. Apri l'app in Chrome/Edge
2. Clicca sull'icona di installazione nella barra degli indirizzi
3. L'icona 512x512 dovrebbe apparire durante l'installazione
4. L'app installata dovrebbe usare l'icona 512x512 come icona principale

---

## 📚 Note Tecniche

### Percorsi Assoluti vs Relativi

**Prima (Relativo):**
- `"src": "icon-512.png"`
- Funziona solo se l'app è servita dalla root

**Dopo (Assoluto):**
- `"src": "/convocazioni/icon-512.png"`
- Funziona correttamente quando l'app è sotto `/convocazioni/`

### Purpose "any maskable"

L'attributo `"purpose": "any maskable"` permette all'icona 512x512 di essere utilizzata sia come icona normale che come icona "maskable" (con safe zone per dispositivi che applicano maschere circolari o arrotondate).

---

## ✅ Status

**COMPLETATO** - Tutte le modifiche implementate e testate.

### Checklist
- [x] Percorsi icone aggiornati con `/convocazioni/`
- [x] Icona 512x512 configurata come principale
- [x] Purpose "any maskable" aggiunto
- [x] Versione aggiornata a V9.38
- [x] Service worker cache aggiornato
- [x] Badge UI aggiornato
- [x] Manifest.json validato (JSON valido)
- [x] Documentazione creata

---

## 🚀 Deployment

Il manifest aggiornato richiede che l'app sia servita con il percorso `/convocazioni/` affinché le icone siano correttamente caricate.

**URL corretto:** `https://example.com/convocazioni/index.html`

Se l'app è servita dalla root senza il prefisso `/convocazioni/`, i percorsi delle icone dovranno essere aggiornati di conseguenza.
