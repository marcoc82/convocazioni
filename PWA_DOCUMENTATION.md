# 📱 PWA Documentation - Rosterkick Convocazioni

## Overview
L'applicazione Rosterkick è ora una Progressive Web App (PWA) completa che può essere installata su dispositivi mobili e desktop per un'esperienza app-like con supporto offline.

---

## ✨ Caratteristiche PWA

### 1. Installabilità
- **Mobile (Android/iOS)**: L'app può essere aggiunta alla home screen
- **Desktop (Windows/Mac/Linux)**: L'app può essere installata come applicazione standalone
- **Prompt di installazione**: Banner automatico quando l'app è installabile

### 2. Funzionalità Offline
- **Cache intelligente**: File statici (HTML, CSS, JS, immagini, icone) vengono salvati in cache
- **Accesso offline**: L'app funziona anche senza connessione internet
- **Offline fallback**: Se una pagina non è disponibile, viene mostrata la pagina principale dalla cache

### 3. Esperienza App-Like
- **Display standalone**: L'app gira a schermo intero senza la UI del browser
- **Splash screen**: Schermata di caricamento con icona e colori del brand
- **Theme color**: Colore personalizzato della barra del browser

---

## 📥 Come Installare la PWA

### Su Android (Chrome/Edge)

1. **Tramite Browser:**
   - Apri l'app nel browser Chrome o Edge
   - Clicca sui tre puntini (⋮) in alto a destra
   - Seleziona "Installa app" o "Aggiungi a schermata Home"
   - Conferma l'installazione

2. **Tramite Banner In-App:**
   - Apri l'app nel browser
   - Nella schermata di login, apparirà il pulsante "📱 Installa App sul Dispositivo"
   - Clicca sul pulsante e conferma

3. **Risultato:**
   - L'app verrà aggiunta alla home screen
   - Icona: Logo Rosterkick
   - Nome: "Rosterkick"
   - L'app si aprirà in modalità fullscreen senza la barra del browser

### Su iOS (Safari)

1. **Tramite Safari:**
   - Apri l'app in Safari
   - Tocca il pulsante "Condividi" (icona quadrato con freccia verso l'alto)
   - Scorri verso il basso e seleziona "Aggiungi a Home"
   - Personalizza il nome se necessario e tocca "Aggiungi"

2. **Limitazioni iOS:**
   - Il banner di installazione in-app non è supportato da Safari
   - Il prompt deve essere fatto manualmente tramite il menu Condividi
   - Il service worker ha funzionalità limitate su iOS

3. **Risultato:**
   - L'app verrà aggiunta alla home screen
   - Si aprirà in modalità standalone (senza barra Safari)

### Su Desktop (Windows/Mac/Linux)

#### Chrome/Edge:
1. Apri l'app nel browser
2. Clicca sull'icona di installazione (➕) nella barra degli indirizzi (a destra)
3. Oppure: Menu (⋮) → "Installa Rosterkick..."
4. Conferma l'installazione nella finestra popup

#### Firefox:
1. Firefox non supporta nativamente l'installazione PWA come Chrome
2. È possibile usare estensioni come "PWA for Firefox"
3. Oppure usare l'app dal browser normalmente

#### Risultato Desktop:
- L'app verrà installata come applicazione standalone
- Apparirà nel menu Start/Applicazioni
- Si aprirà in una finestra dedicata senza la UI del browser
- Può essere aggiunta alla taskbar

---

## 🔌 Funzionalità Offline

### Cosa Funziona Offline
✅ **Completamente disponibile offline:**
- Interfaccia utente completa
- File HTML, CSS, JavaScript
- Icone e immagini del brand
- Font Google (Inter)
- Librerie CDN (Tailwind CSS, html2canvas)

⚠️ **Richiede connessione:**
- Autenticazione Firebase
- Caricamento dati da database
- Salvataggio convocazioni
- Generazione PDF con dati remoti

### Come Funziona la Cache
1. **Al primo caricamento:**
   - Il service worker viene registrato
   - Tutti i file statici vengono salvati in cache
   - Console log: "✅ Service Worker registrato con successo"

2. **Visite successive:**
   - I file vengono serviti dalla cache (velocità massima)
   - Se disponibile, la rete viene usata per aggiornamenti
   - Se offline, viene usata solo la cache

3. **Aggiornamenti:**
   - Quando viene deployata una nuova versione
   - Il service worker rileva l'aggiornamento
   - Console log: "🔄 Nuova versione disponibile! Ricarica la pagina per aggiornare."
   - Ricarica manuale necessaria per applicare l'aggiornamento

### Gestione Cache
- **Nome cache attuale:** `polis-convocazioni-v9.36`
- **Pulizia automatica:** Le vecchie cache vengono eliminate automaticamente
- **Strategia:** Cache First, poi Network
- **Fallback:** Se la rete fallisce, usa la cache

---

## 🧪 Come Testare la PWA

### Test di Installabilità

#### Su Mobile:
1. **Android Chrome:**
   - Apri l'app in Chrome
   - Verifica che appaia il banner "Installa app"
   - Installa e verifica che l'icona appaia nella home screen
   - Apri l'app installata e verifica che sia fullscreen

2. **iOS Safari:**
   - Apri l'app in Safari
   - Usa "Aggiungi a Home"
   - Verifica che l'icona appaia nella home screen
   - Apri e verifica la modalità standalone

#### Su Desktop:
1. **Chrome/Edge:**
   - Apri l'app
   - Verifica l'icona di installazione nella barra degli indirizzi
   - Installa e verifica che appaia nel menu Start/Applicazioni
   - Apri l'app installata e verifica la finestra standalone

### Test Offline

1. **Installa l'app** (seguire le istruzioni sopra)

2. **Testa il funzionamento online:**
   - Apri l'app installata
   - Fai login normalmente
   - Naviga tra le varie schermate
   - Verifica che tutto funzioni

3. **Testa il funzionamento offline:**
   - Con l'app aperta, attiva la modalità aereo (o disconnetti WiFi)
   - Chiudi completamente l'app
   - Riapri l'app
   - Verifica che l'interfaccia si carichi correttamente
   - Verifica che i file statici siano disponibili

4. **Verifica Console Developer:**
   - Apri DevTools (F12)
   - Tab "Application" → "Service Workers"
   - Verifica che il service worker sia attivo
   - Tab "Application" → "Cache Storage"
   - Verifica che `polis-convocazioni-v9.36` contenga i file

### Test Audit PWA (Chrome DevTools)

1. **Apri Chrome DevTools** (F12)
2. **Tab "Lighthouse"**
3. **Seleziona categoria "Progressive Web App"**
4. **Click "Generate report"**

Aspettative per un buon score:
- ✅ Fast and reliable (offline ready)
- ✅ Installable
- ✅ PWA optimized
- ✅ Manifest configuration correct
- ✅ Service worker registered

---

## 🔧 Dettagli Tecnici

### File PWA Principali

#### 1. manifest.json
```json
{
  "name": "Rosterkick",
  "short_name": "Rosterkick",
  "version": "V9.36",
  "description": "creare le convocazioni per il weekend",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#1e293b",
  "icons": [...]
}
```

**Campi chiave:**
- `name`: Nome completo dell'app
- `short_name`: Nome breve per la home screen
- `display: standalone`: Modalità fullscreen senza browser UI
- `start_url`: URL di partenza quando l'app viene aperta
- `theme_color`: Colore della barra superiore (mobile)
- `background_color`: Colore dello splash screen

#### 2. service-worker.js
```javascript
const CACHE_NAME = 'polis-convocazioni-v9.36';
const urlsToCache = [
  './index.html',
  './manifest.json',
  // ... altri file statici
];
```

**Eventi gestiti:**
- `install`: Cache dei file statici al primo caricamento
- `fetch`: Intercetta richieste e serve dalla cache
- `activate`: Pulisce vecchie cache

#### 3. index.html - Registrazione Service Worker
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(registration => {
      console.log('✅ Service Worker registrato');
    });
}
```

#### 4. index.html - Install Prompt
```javascript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});
```

### Icone PWA
- **16x16**: favicon-16x16.png (browser tab)
- **32x32**: favicon-32x32.png (browser tab HD)
- **96x96**: favicon-96x96.png (Windows tiles)
- **192x192**: favicon-192x192.png (Android home screen)
- **512x512**: favicon-192x192.png (usato come 512x512, splash screen)

---

## 📊 Versione e Changelog

### Versione Attuale: V9.36

**Novità in V9.36:**
- ✅ Aggiunto link al manifest.json nell'HTML
- ✅ Registrazione automatica del service worker
- ✅ Banner di installazione nella schermata di login
- ✅ Gestione eventi PWA (beforeinstallprompt, appinstalled)
- ✅ Rilevamento modalità PWA standalone
- ✅ Fallback offline migliorato
- ✅ Cache versione aggiornata a v9.36
- ✅ Documentazione completa PWA

**File Modificati:**
- `index.html`: Aggiunto link manifest, service worker registration, install prompt
- `manifest.json`: Versione aggiornata a V9.36
- `service-worker.js`: Cache versione aggiornata, fallback offline migliorato
- `PWA_DOCUMENTATION.md`: Nuova documentazione (questo file)

---

## 🐛 Troubleshooting

### Il banner di installazione non appare

**Cause possibili:**
1. L'app è già installata
2. L'app non soddisfa i criteri PWA (manifest mancante, service worker non registrato)
3. Browser non supportato (Firefox standard, Safari)
4. La pagina è stata visitata meno di 30 secondi
5. L'utente ha già rifiutato l'installazione in passato

**Soluzioni:**
- Verifica che manifest.json sia accessibile (URL/manifest.json)
- Verifica che il service worker sia registrato (DevTools → Application → Service Workers)
- Usa Chrome o Edge per miglior supporto
- Aspetta almeno 30 secondi sulla pagina
- Prova in modalità incognito

### L'app non funziona offline

**Verifica:**
1. Service worker registrato? (DevTools → Application → Service Workers)
2. Cache popolata? (DevTools → Application → Cache Storage)
3. File nella cache? Verifica che `polis-convocazioni-v9.36` contenga tutti i file
4. Errori in console? Controlla la tab Console dei DevTools

**Soluzioni:**
- Ricarica la pagina con Ctrl+Shift+R (hard refresh)
- Cancella cache e ricarica
- Verifica che il service worker non sia bloccato
- Controlla che il dominio sia HTTPS (o localhost per test)

### L'app non si aggiorna

**Problema:** Nuova versione deployata ma l'app mostra ancora la vecchia

**Causa:** Service worker usa cache vecchia

**Soluzione:**
1. DevTools → Application → Service Workers
2. Check "Update on reload"
3. Ricarica la pagina
4. Oppure: Click "Unregister" e ricarica

### iOS non installa l'app

**Limitazioni iOS:**
- Safari non supporta il prompt automatico
- Deve essere fatto manualmente: Condividi → Aggiungi a Home
- Service worker ha funzionalità limitate
- Alcune API PWA non disponibili

---

## 🎯 Best Practices

### Per Utenti:
1. **Installa l'app** per esperienza ottimale
2. **Permetti notifiche** se richieste (funzionalità future)
3. **Mantieni l'app aggiornata** ricaricando quando richiesto
4. **Usa offline** per velocità massima

### Per Sviluppatori:
1. **Aggiorna versione cache** ad ogni deploy
2. **Testa sempre PWA** prima di committare
3. **Verifica Lighthouse score** (target: 90+)
4. **Documenta breaking changes** nel changelog
5. **Test su mobile reale** non solo emulatore

---

## 📚 Risorse Utili

### Documentazione:
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google - PWA Checklist](https://web.dev/pwa-checklist/)
- [Web.dev - PWA Training](https://web.dev/learn/pwa/)

### Strumenti Testing:
- Chrome DevTools → Lighthouse
- Chrome DevTools → Application
- [PWA Builder](https://www.pwabuilder.com/)
- [Manifest Generator](https://app-manifest.firebaseapp.com/)

### Browser Support:
- ✅ Chrome (Android/Desktop): Supporto completo
- ✅ Edge (Desktop): Supporto completo
- ⚠️ Safari (iOS): Supporto parziale
- ⚠️ Firefox: Supporto limitato
- ❌ Internet Explorer: Non supportato

---

## 🚀 Deployment Checklist

Prima di ogni deploy, verifica:

- [ ] Versione aggiornata in index.html (commento e badge)
- [ ] Versione aggiornata in manifest.json
- [ ] Versione cache aggiornata in service-worker.js
- [ ] Service worker registrazione funzionante
- [ ] Manifest accessibile e valido
- [ ] Tutte le icone presenti e accessibili
- [ ] Test offline funzionante
- [ ] Install prompt testato
- [ ] Lighthouse PWA score > 90
- [ ] Test su mobile reale Android
- [ ] Test su mobile reale iOS
- [ ] Test su desktop Chrome/Edge
- [ ] Documentazione aggiornata

---

## 📞 Supporto

Per problemi o domande su PWA:
1. Controlla questa documentazione
2. Verifica la console del browser (F12)
3. Controlla Troubleshooting section
4. Contatta il team di sviluppo

---

**Versione Documentazione:** V9.36  
**Data:** 2024  
**Autore:** GitHub Copilot Agent  
**Status:** ✅ Production Ready
