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
- [ ] Push notifications permission testato
- [ ] FCM token generato correttamente

---

## 🔔 Notifiche Push (V9.52)

### Panoramica
A partire dalla versione V9.52, Rosterkick supporta le notifiche push tramite Firebase Cloud Messaging (FCM). Quando viene creata una nuova convocazione, gli utenti riceveranno una notifica push sul loro dispositivo.

### File FCM

#### 1. firebase-messaging-sw.js
Service Worker dedicato per la gestione delle notifiche in background.

**Funzionalità:**
- Gestisce le notifiche quando l'app è chiusa o in background
- Mostra notifiche con titolo, corpo e icona personalizzati
- Gestisce il click sulle notifiche per aprire l'app
- Supporta azioni sulle notifiche (Apri, Chiudi)

**Configurazione:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD87fLjZfQO1gDOzqJZAdvlqSthBYN3XSU",
    authDomain: "polis-2013.firebaseapp.com",
    projectId: "polis-2013",
    storageBucket: "polis-2013.appspot.com",
    messagingSenderId: "607738543737",
    appId: "1:607738543737:web:9b108502b8f1b61ef4dea8",
    measurementId: "G-94FT2YQNBM"
};
```

#### 2. Integrazione in index.html
Script FCM integrato alla fine del file per gestire:
- Richiesta permessi notifiche
- Generazione token FCM
- Gestione notifiche in foreground
- Salvataggio token nel database

### Come Funziona

#### 1. Richiesta Permessi
Quando l'utente fa il login, l'app richiede automaticamente il permesso per le notifiche:

```javascript
// Chiamata dopo il login
await initializePushNotifications();
```

**Stati dei Permessi:**
- **default**: L'utente non ha ancora risposto → verrà richiesto
- **granted**: Permesso concesso → le notifiche funzionano
- **denied**: Permesso negato → le notifiche non funzionano

#### 2. Generazione Token FCM
Una volta concesso il permesso, viene generato un token FCM univoco per il dispositivo:

```javascript
const token = await getFCMToken();
// Token viene salvato nel database Firestore
```

**Struttura Database:**
```
fcm_tokens/
  {companyCode}/
    tokens/
      {userId}: {
        token: "fcm-token-string",
        timestamp: Date,
        userAgent: "browser-info",
        companyCode: "company-code"
      }
```

#### 3. Invio Notifiche (Backend)
Il backend (Cloud Function o API) invia notifiche quando viene creata una convocazione:

**Cloud Function Example:**
```javascript
const admin = require('firebase-admin');

async function sendConvocationNotification(companyCode, convocationData) {
    // Recupera tutti i token FCM per la società
    const tokensSnapshot = await admin.firestore()
        .collection('fcm_tokens')
        .doc(companyCode)
        .collection('tokens')
        .get();
    
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    
    // Crea il messaggio
    const message = {
        notification: {
            title: 'Nuova Convocazione',
            body: `${convocationData.matchType} - ${convocationData.date}`,
        },
        data: {
            convocationId: convocationData.id,
            type: 'new_convocation'
        },
        tokens: tokens
    };
    
    // Invia la notifica
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notifiche inviate: ${response.successCount}/${tokens.length}`);
}
```

**REST API Example:**
```bash
curl -X POST https://fcm.googleapis.com/v1/projects/polis-2013/messages:send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "FCM_TOKEN",
      "notification": {
        "title": "Nuova Convocazione",
        "body": "Campionato - Domenica 15/01"
      },
      "data": {
        "convocationId": "conv123",
        "type": "new_convocation"
      }
    }
  }'
```

### Setup Backend

#### 1. Ottenere la Chiave VAPID
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il progetto "polis-2013"
3. Vai su **Impostazioni Progetto** → **Cloud Messaging**
4. Nella sezione **Web Push certificates**, genera o copia la chiave VAPID
5. Sostituisci `YOUR_VAPID_KEY_HERE` in index.html con la chiave ottenuta

**File da modificare:** `index.html` linea ~13115
```javascript
const token = await window.getToken(window.messaging, {
    vapidKey: 'BPx...YOUR_ACTUAL_VAPID_KEY...xyz', // Sostituisci qui
    serviceWorkerRegistration: registration
});
```

#### 2. Configurare Cloud Function
Crea una Cloud Function che si attiva quando viene creata una convocazione:

**functions/index.js:**
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendConvocationNotification = functions.firestore
    .document('convocations_history/{convocationId}')
    .onCreate(async (snap, context) => {
        const convocation = snap.data();
        const companyCode = convocation.companyCode;
        
        // Recupera i token FCM
        const tokensSnapshot = await admin.firestore()
            .collection('fcm_tokens')
            .doc(companyCode)
            .collection('tokens')
            .get();
        
        if (tokensSnapshot.empty) {
            console.log('Nessun token FCM trovato');
            return;
        }
        
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
        
        // Crea il messaggio
        const message = {
            notification: {
                title: 'Nuova Convocazione Rosterkick',
                body: `${convocation.matchType} - ${convocation.formattedDate}`,
            },
            data: {
                convocationId: context.params.convocationId,
                companyCode: companyCode,
                type: 'new_convocation'
            }
        };
        
        // Invia a tutti i dispositivi
        const response = await admin.messaging().sendMulticast({
            ...message,
            tokens: tokens
        });
        
        console.log(`Notifiche inviate: ${response.successCount}/${tokens.length}`);
        
        // Rimuovi token non validi
        const tokensToRemove = [];
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                tokensToRemove.push(tokens[idx]);
            }
        });
        
        // Cleanup token non validi
        if (tokensToRemove.length > 0) {
            const batch = admin.firestore().batch();
            tokensToRemove.forEach(token => {
                const tokenDoc = tokensSnapshot.docs.find(doc => doc.data().token === token);
                if (tokenDoc) {
                    batch.delete(tokenDoc.ref);
                }
            });
            await batch.commit();
        }
        
        return response;
    });
```

**Deploy:**
```bash
firebase deploy --only functions
```

### Test e Debug

#### Test Notification Permission
```javascript
// Nella console del browser
await window.requestNotificationPermission();
```

#### Test Notification Locale
```javascript
// Nella console del browser
window.testNotification();
```

#### Verificare Token FCM
```javascript
// Nella console del browser
const token = await window.getFCMToken();
console.log('FCM Token:', token);
```

#### Debug Service Worker
1. Apri DevTools (F12)
2. Vai su **Application** → **Service Workers**
3. Verifica che `firebase-messaging-sw.js` sia registrato
4. Controlla eventuali errori nella console

#### Test Notifica Background
1. Chiudi o minimizza l'app
2. Invia una notifica tramite Firebase Console:
   - Vai su **Cloud Messaging**
   - Clicca **Send your first message**
   - Inserisci titolo e testo
   - Clicca **Send test message**
   - Incolla il token FCM
   - Clicca **Test**

### Browser Support

| Browser | Desktop | Mobile | Note |
|---------|---------|--------|------|
| Chrome | ✅ | ✅ | Pieno supporto |
| Firefox | ✅ | ✅ | Pieno supporto |
| Edge | ✅ | ✅ | Pieno supporto |
| Safari | ⚠️ | ❌ | Supporto limitato desktop, nessun supporto mobile |
| Opera | ✅ | ✅ | Pieno supporto |

**Note Safari:**
- Safari su macOS: Supporto parziale (richiede macOS 13+)
- Safari su iOS: Non supporta Web Push API
- Alternativa iOS: considerare notifiche in-app o wrapper nativo

### Troubleshooting

#### Notifiche non arrivano
1. **Verifica permessi:** `Notification.permission` deve essere `"granted"`
2. **Verifica token:** Controlla che il token FCM sia stato generato
3. **Verifica service worker:** `firebase-messaging-sw.js` deve essere registrato
4. **Verifica VAPID key:** La chiave VAPID deve essere corretta
5. **Controlla console:** Cerca errori nella console del browser

#### Token non viene generato
1. **VAPID key mancante:** Sostituisci `YOUR_VAPID_KEY_HERE` con la chiave reale
2. **Service worker non registrato:** Controlla in DevTools → Application
3. **HTTPS richiesto:** Le notifiche funzionano solo su HTTPS (o localhost)
4. **Browser non supportato:** Verifica compatibilità browser

#### Service worker conflicts
Se hai già un service worker (`service-worker.js`), `firebase-messaging-sw.js` viene registrato separatamente con scope `/convocazioni/`. Questo evita conflitti.

### Sicurezza

#### Token FCM
- **Non pubblico:** I token FCM non devono essere condivisi pubblicamente
- **Validità:** I token possono scadere e devono essere rigenerati
- **Cleanup:** Rimuovi token non validi dal database

#### Chiave VAPID
- **Non committare:** Non committare la chiave VAPID nel codice
- **Environment variables:** Usa variabili d'ambiente per produzione
- **Firebase Console:** Genera nuove chiavi se compromesse

#### Server Key
- **Backend only:** La Server Key deve essere usata solo lato backend
- **Non esporre:** Mai esporre la Server Key nel codice client

### Best Practices

1. **Richiedi permessi al momento giusto:** Non chiedere permessi all'avvio, ma dopo il login
2. **Spiega il valore:** Mostra all'utente perché le notifiche sono utili
3. **Rispetta le preferenze:** Permetti all'utente di disabilitare le notifiche
4. **Test regolari:** Testa le notifiche su diversi dispositivi e browser
5. **Cleanup token:** Rimuovi token non validi dal database
6. **Rate limiting:** Limita il numero di notifiche per evitare spam
7. **Personalizzazione:** Personalizza le notifiche per tipo di convocazione

---

## 📞 Supporto

Per problemi o domande su PWA:
1. Controlla questa documentazione
2. Verifica la console del browser (F12)
3. Controlla Troubleshooting section
4. Contatta il team di sviluppo

---

**Versione Documentazione:** V9.52  
**Data:** 2025  
**Autore:** GitHub Copilot Agent  
**Status:** ✅ Production Ready con Push Notifications
