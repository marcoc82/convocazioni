/**
 * Snippet JavaScript completo per la ricerca di una società in Firestore tramite il campo "codici"
 * 
 * Questo file dimostra come:
 * - Inizializzare Firebase con configurazione fittizia
 * - Effettuare una query sulla collection "societa" dove il campo "codici" corrisponde al codice inserito
 * - Restituire i dati della società trovata (nome, config, giocatori) oppure null se non trovata
 * - Utilizzare la funzione con esempi pratici
 */

// ============================
// 1. INIZIALIZZAZIONE FIREBASE
// ============================

// Importazione dei moduli Firebase necessari
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configurazione Firebase fittizia - SOSTITUIRE CON I PROPRI DATI
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:your-app-id",
    measurementId: "G-YOUR-MEASUREMENT-ID"
};

// Inizializzazione dell'app Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================================
// 2. FUNZIONE DI RICERCA SOCIETÀ
// ================================

/**
 * Cerca una società in Firestore tramite il campo "codici"
 * 
 * @param {string} codice - Il codice della società da cercare
 * @returns {Promise<Object|null>} - Oggetto con i dati della società o null se non trovata
 */
async function cercaSocietaDaCodice(codice) {
    try {
        // Validazione input
        if (!codice || typeof codice !== 'string' || codice.trim() === '') {
            console.error('Codice società non valido');
            return null;
        }

        // Normalizzazione del codice (rimuove spazi e converte in uppercase)
        const codiceNormalizzato = codice.trim().toUpperCase();

        // Creazione della query per cercare nella collection "societa"
        // dove il campo "codici" corrisponde al codice inserito
        const societaRef = collection(db, 'societa');
        const q = query(societaRef, where('codici', '==', codiceNormalizzato));

        // Esecuzione della query
        const querySnapshot = await getDocs(q);

        // Verifica se sono stati trovati risultati
        if (querySnapshot.empty) {
            console.log(`Nessuna società trovata con codice: ${codiceNormalizzato}`);
            return null;
        }

        // Se trovata più di una società (caso non comune), prende la prima
        if (querySnapshot.size > 1) {
            console.warn(`Trovate ${querySnapshot.size} società con lo stesso codice. Restituisco la prima.`);
        }

        // Estrazione dei dati della prima società trovata
        const societaDoc = querySnapshot.docs[0];
        const societaData = societaDoc.data();

        // Strutturazione dei dati di ritorno
        const risultato = {
            id: societaDoc.id,
            nome: societaData.nome || 'Nome non disponibile',
            config: societaData.config || {},
            giocatori: societaData.giocatori || [],
            codici: societaData.codici,
            // Eventuali altri campi utili
            dataCreazione: societaData.dataCreazione || null,
            attiva: societaData.attiva !== undefined ? societaData.attiva : true
        };

        console.log(`Società trovata: ${risultato.nome}`);
        return risultato;

    } catch (error) {
        console.error('Errore durante la ricerca della società:', error);
        throw error;
    }
}

// ===============================
// 3. FUNZIONE DI RICERCA AVANZATA
// ===============================

/**
 * Ricerca avanzata società con supporto per codici multipli o ricerca parziale
 * 
 * @param {string} codice - Il codice da cercare
 * @param {Object} opzioni - Opzioni di ricerca
 * @returns {Promise<Array|null>} - Array di società trovate o null
 */
async function cercaSocietaAvanzata(codice, opzioni = {}) {
    try {
        const { 
            ricercaParziale = false, 
            soloAttive = true,
            limite = 10 
        } = opzioni;

        const codiceNormalizzato = codice.trim().toUpperCase();
        const societaRef = collection(db, 'societa');
        
        let q;
        
        if (ricercaParziale) {
            // Per ricerca parziale, cerca codici che iniziano con il valore inserito
            q = query(
                societaRef, 
                where('codici', '>=', codiceNormalizzato),
                where('codici', '<=', codiceNormalizzato + '\uf8ff')
            );
        } else {
            // Ricerca esatta
            q = query(societaRef, where('codici', '==', codiceNormalizzato));
        }

        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return null;
        }

        const risultati = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Filtro per società attive se richiesto
            if (soloAttive && data.attiva === false) {
                return;
            }

            risultati.push({
                id: doc.id,
                nome: data.nome || 'Nome non disponibile',
                config: data.config || {},
                giocatori: data.giocatori || [],
                codici: data.codici,
                dataCreazione: data.dataCreazione || null,
                attiva: data.attiva !== undefined ? data.attiva : true
            });
        });

        return risultati.slice(0, limite);

    } catch (error) {
        console.error('Errore durante la ricerca avanzata:', error);
        throw error;
    }
}

// ========================
// 4. ESEMPI DI UTILIZZO
// ========================

/**
 * Esempi pratici di utilizzo delle funzioni
 */
async function esempiUtilizzo() {
    console.log('=== ESEMPI DI UTILIZZO ===\n');

    try {
        // Esempio 1: Ricerca semplice
        console.log('1. Ricerca società con codice "ABC123":');
        const societa1 = await cercaSocietaDaCodice('ABC123');
        
        if (societa1) {
            console.log(`   ✓ Trovata: ${societa1.nome}`);
            console.log(`   - Giocatori: ${societa1.giocatori.length}`);
            console.log(`   - Attiva: ${societa1.attiva}`);
        } else {
            console.log('   ✗ Società non trovata');
        }

        // Esempio 2: Gestione errori
        console.log('\n2. Ricerca con codice vuoto:');
        const societa2 = await cercaSocietaDaCodice('');
        console.log(`   Risultato: ${societa2}`);

        // Esempio 3: Ricerca avanzata
        console.log('\n3. Ricerca avanzata con opzioni:');
        const societa3 = await cercaSocietaAvanzata('ABC', {
            ricercaParziale: true,
            soloAttive: true,
            limite: 5
        });
        
        if (societa3 && societa3.length > 0) {
            console.log(`   ✓ Trovate ${societa3.length} società:`);
            societa3.forEach((s, index) => {
                console.log(`      ${index + 1}. ${s.nome} (${s.codici})`);
            });
        } else {
            console.log('   ✗ Nessuna società trovata');
        }

        // Esempio 4: Utilizzo in una funzione async
        console.log('\n4. Utilizzo pratico in applicazione:');
        await verificaAccessoSocieta('XYZ789');

    } catch (error) {
        console.error('Errore negli esempi:', error);
    }
}

/**
 * Esempio di funzione che utilizza la ricerca società
 * per verificare l'accesso di un utente
 */
async function verificaAccessoSocieta(codiceInserito) {
    try {
        console.log(`   Verifica accesso per codice: ${codiceInserito}`);
        
        const societa = await cercaSocietaDaCodice(codiceInserito);
        
        if (!societa) {
            console.log('   ✗ Accesso negato: società non trovata');
            return false;
        }

        if (!societa.attiva) {
            console.log('   ✗ Accesso negato: società non attiva');
            return false;
        }

        console.log(`   ✓ Accesso consentito alla società: ${societa.nome}`);
        console.log(`   - Configurazione disponibile: ${Object.keys(societa.config).length} impostazioni`);
        console.log(`   - Giocatori registrati: ${societa.giocatori.length}`);
        
        return true;

    } catch (error) {
        console.error('   ✗ Errore durante la verifica:', error);
        return false;
    }
}

// ===========================
// 5. EXPORT DELLE FUNZIONI
// ===========================

// Esportazione delle funzioni per uso in altri moduli
export { 
    cercaSocietaDaCodice, 
    cercaSocietaAvanzata, 
    esempiUtilizzo, 
    verificaAccessoSocieta 
};

// Per utilizzo diretto in console o script
window.cercaSocietaDaCodice = cercaSocietaDaCodice;
window.cercaSocietaAvanzata = cercaSocietaAvanzata;
window.esempiUtilizzo = esempiUtilizzo;

// ============================
// 6. AUTO-ESECUZIONE ESEMPI
// ============================

// Decommentare la riga seguente per eseguire automaticamente gli esempi
// esempiUtilizzo();

console.log('✓ Snippet caricato correttamente. Funzioni disponibili:');
console.log('  - cercaSocietaDaCodice(codice)');
console.log('  - cercaSocietaAvanzata(codice, opzioni)');
console.log('  - esempiUtilizzo()');
console.log('\nPer testare, esegui: esempiUtilizzo()');