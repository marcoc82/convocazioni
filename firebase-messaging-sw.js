// Firebase Cloud Messaging Service Worker
// Questo file gestisce le notifiche push in background

importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD87fLjZfQO1gDOzqJZAdvlqSthBYN3XSU",
    authDomain: "polis-2013.firebaseapp.com",
    projectId: "polis-2013",
    storageBucket: "polis-2013.appspot.com",
    messagingSenderId: "607738543737",
    appId: "1:607738543737:web:9b108502b8f1b61ef4dea8",
    measurementId: "G-94FT2YQNBM"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Recupera l'istanza di messaging
const messaging = firebase.messaging();

// Gestione notifiche in background
messaging.onBackgroundMessage((payload) => {
    console.log('📬 [firebase-messaging-sw.js] Ricevuta notifica in background:', payload);
    
    const notificationTitle = payload.notification?.title || 'Nuova Convocazione';
    const notificationOptions = {
        body: payload.notification?.body || 'È stata creata una nuova convocazione',
        icon: '/convocazioni/icon-512.png',
        badge: '/convocazioni/favicon-96x96.png',
        tag: 'convocazione-notification',
        data: payload.data,
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Apri App'
            },
            {
                action: 'close',
                title: 'Chiudi'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestione click sulla notifica
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 [firebase-messaging-sw.js] Click sulla notifica:', event.notification.tag);
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        // Apri o porta in primo piano l'app
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUninstalled: false })
                .then((clientList) => {
                    // Se c'è già una finestra aperta, portala in primo piano
                    for (let client of clientList) {
                        if (client.url.includes('/convocazioni/') && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Altrimenti apri una nuova finestra
                    if (clients.openWindow) {
                        return clients.openWindow('/convocazioni/index.html');
                    }
                })
        );
    }
});
