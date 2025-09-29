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
    apiKey: "AIzaSyD87fLjZfQO1gDOzqJZAdvlqSthBYN3XSU",
    authDomain: "polis-2013.firebaseapp.com",
    projectId: "polis-2013",
    storageBucket: "polis-2013.appspot.com",
    messagingSenderId: "607738543737",
    appId: "1:607738543737:web:9b108502b8f1b61ef4dea8",
    measurementId: "G-94FT2YQNBM"
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
        // Log dell'input originale
        console.log('🔍 DEBUG - cercaSocietaDaCodice - Input originale:', {
            codice: codice,
            tipo: typeof codice,
            lunghezza: codice ? codice.length : 0
        });

        // Validazione input
        if (!codice || typeof codice !== 'string' || codice.trim() === '') {
            console.error('❌ DEBUG - Codice società non valido');
            return null;
        }

        // Normalizzazione del codice (rimuove spazi e converte in uppercase)
        const codiceNormalizzato = codice.trim().toUpperCase();
        console.log('📝 DEBUG - Codice normalizzato:', {
            originale: codice,
            normalizzato: codiceNormalizzato,
            trasformazioni: 'trim() + toUpperCase()'
        });

        // Creazione della query per cercare nella collection "societa"
        // Primo tentativo: cerca nel campo "codici" (accesso normale)
        const collectionPath = 'societa';
        const societaRef = collection(db, collectionPath);
        
        console.log('📂 DEBUG - Collection path:', collectionPath);
        
        let q = query(societaRef, where('codici', '==', codiceNormalizzato));
        
        console.log('🔎 DEBUG - Query costruita per codici:', {
            collection: collectionPath,
            campo: 'codici',
            operatore: '==',
            valore: codiceNormalizzato,
            tipoQuery: 'ricerca normale'
        });

        // Esecuzione della prima query (codici normali)
        console.log('⚡ DEBUG - Esecuzione query codici in corso...');
        let querySnapshot = await getDocs(q);

        // Log del numero di risultati trovati per codici normali
        console.log('📊 DEBUG - Risultati query codici:', {
            numeroDocumenti: querySnapshot.size,
            isEmpty: querySnapshot.empty,
            timestamp: new Date().toISOString()
        });

        // Se non trovato nei codici normali, prova nei codici ospite
        if (querySnapshot.empty) {
            console.log('🔍 DEBUG - Codice non trovato in "codici", tentativo con "ospitecode"...');
            
            q = query(societaRef, where('ospitecode', '==', codiceNormalizzato));
            
            console.log('🔎 DEBUG - Query costruita per ospitecode:', {
                collection: collectionPath,
                campo: 'ospitecode',
                operatore: '==',
                valore: codiceNormalizzato,
                tipoQuery: 'ricerca ospite'
            });

            // Esecuzione della seconda query (codici ospite)
            console.log('⚡ DEBUG - Esecuzione query ospitecode in corso...');
            querySnapshot = await getDocs(q);

            // Log del numero di risultati trovati per codici ospite
            console.log('📊 DEBUG - Risultati query ospitecode:', {
                numeroDocumenti: querySnapshot.size,
                isEmpty: querySnapshot.empty,
                timestamp: new Date().toISOString()
            });
        }

        // Verifica se sono stati trovati risultati in entrambe le query
        if (querySnapshot.empty) {
            console.log(`❌ DEBUG - Nessuna società trovata con codice: ${codiceNormalizzato} (cercato in "codici" e "ospitecode")`);
            return null;
        }

        // Se trovata più di una società (caso non comune), prende la prima
        if (querySnapshot.size > 1) {
            console.warn(`⚠️ DEBUG - Trovate ${querySnapshot.size} società con lo stesso codice. Restituisco la prima.`);
        }

        // Estrazione dei dati della prima società trovata
        const societaDoc = querySnapshot.docs[0];
        const societaData = societaDoc.data();

        // Determina se questo è un accesso ospite o normale
        const isGuestLogin = societaData.ospitecode === codiceNormalizzato;

        console.log('📄 DEBUG - Dettagli documento trovato:', {
            documentId: societaDoc.id,
            isGuestLogin: isGuestLogin,
            esisteCampoNome: 'nome' in societaData,
            esisteCampoConfig: 'config' in societaData,
            esisteCampoGiocatori: 'giocatori' in societaData,
            esisteCampoCodici: 'codici' in societaData,
            esisteCampoOspitecode: 'ospitecode' in societaData,
            esisteCampoAttiva: 'attiva' in societaData,
            numeroCampiTotali: Object.keys(societaData).length,
            campiDisponibili: Object.keys(societaData)
        });

        // Strutturazione dei dati di ritorno
        const risultato = {
            id: societaDoc.id,
            nome: societaData.nome || 'Nome non disponibile',
            config: societaData.config || {},
            giocatori: societaData.giocatori || [],
            codici: societaData.codici,
            ospitecode: societaData.ospitecode,
            isGuestLogin: isGuestLogin,
            // Eventuali altri campi utili
            dataCreazione: societaData.dataCreazione || null,
            attiva: societaData.attiva !== undefined ? societaData.attiva : true
        };

        console.log('✅ DEBUG - Dati estratti e strutturati:', {
            id: risultato.id,
            nome: risultato.nome,
            numeroGiocatori: risultato.giocatori.length,
            numeroConfigurazioni: Object.keys(risultato.config).length,
            codici: risultato.codici,
            ospitecode: risultato.ospitecode,
            isGuestLogin: risultato.isGuestLogin,
            attiva: risultato.attiva,
            dataCreazione: risultato.dataCreazione
        });

        console.log(`✅ Società trovata: ${risultato.nome} ${risultato.isGuestLogin ? '(Accesso Ospite)' : '(Accesso Normale)'}`);
        return risultato;

    } catch (error) {
        console.error('💥 DEBUG - Errore durante la ricerca della società:', {
            messaggio: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
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
        console.log('🔍 DEBUG - cercaSocietaAvanzata - Input originale:', {
            codice: codice,
            tipo: typeof codice,
            lunghezza: codice ? codice.length : 0,
            opzioni: opzioni
        });

        const { 
            ricercaParziale = false, 
            soloAttive = true,
            limite = 10 
        } = opzioni;

        console.log('⚙️ DEBUG - Opzioni elaborate:', {
            ricercaParziale,
            soloAttive,
            limite,
            tipoRicerca: ricercaParziale ? 'parziale' : 'esatta'
        });

        const codiceNormalizzato = codice.trim().toUpperCase();
        console.log('📝 DEBUG - Codice normalizzato:', {
            originale: codice,
            normalizzato: codiceNormalizzato,
            trasformazioni: 'trim() + toUpperCase()'
        });

        const collectionPath = 'societa';
        const societaRef = collection(db, collectionPath);
        console.log('📂 DEBUG - Collection path:', collectionPath);
        
        let q;
        
        if (ricercaParziale) {
            // Per ricerca parziale, cerca codici che iniziano con il valore inserito
            const endValue = codiceNormalizzato + '\uf8ff';
            q = query(
                societaRef, 
                where('codici', '>=', codiceNormalizzato),
                where('codici', '<=', endValue)
            );
            
            console.log('🔎 DEBUG - Query costruita (ricerca parziale):', {
                collection: collectionPath,
                campo: 'codici',
                condizione1: `>= ${codiceNormalizzato}`,
                condizione2: `<= ${endValue}`,
                tipoQuery: 'ricerca parziale (range)'
            });
        } else {
            // Ricerca esatta
            q = query(societaRef, where('codici', '==', codiceNormalizzato));
            
            console.log('🔎 DEBUG - Query costruita (ricerca esatta):', {
                collection: collectionPath,
                campo: 'codici',
                operatore: '==',
                valore: codiceNormalizzato,
                tipoQuery: 'ricerca esatta'
            });
        }

        console.log('⚡ DEBUG - Esecuzione query in corso...');
        const querySnapshot = await getDocs(q);

        console.log('📊 DEBUG - Risultati query:', {
            numeroDocumenti: querySnapshot.size,
            isEmpty: querySnapshot.empty,
            timestamp: new Date().toISOString()
        });
        
        if (querySnapshot.empty) {
            console.log('❌ DEBUG - Nessuna società trovata con i criteri specificati');
            return null;
        }

        const risultati = [];
        let documentiEsaminati = 0;
        let documentiEsclusiPerAttivita = 0;
        
        querySnapshot.forEach((doc) => {
            documentiEsaminati++;
            const data = doc.data();
            
            console.log(`📄 DEBUG - Documento ${documentiEsaminati}:`, {
                documentId: doc.id,
                nome: data.nome || 'N/D',
                codici: data.codici,
                attiva: data.attiva,
                numeroGiocatori: data.giocatori ? data.giocatori.length : 0
            });
            
            // Filtro per società attive se richiesto
            if (soloAttive && data.attiva === false) {
                documentiEsclusiPerAttivita++;
                console.log(`⏭️ DEBUG - Documento escluso (società non attiva): ${doc.id}`);
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

        const risultatiFinali = risultati.slice(0, limite);

        console.log('✅ DEBUG - Riepilogo ricerca avanzata:', {
            documentiTrovatiInQuery: querySnapshot.size,
            documentiEsaminati,
            documentiEsclusiPerAttivita,
            risultatiDopoFiltri: risultati.length,
            risultatiFinaliDopoLimite: risultatiFinali.length,
            limiteApplicato: limite,
            filtroAttivaApplicato: soloAttive
        });

        return risultatiFinali;

    } catch (error) {
        console.error('💥 DEBUG - Errore durante la ricerca avanzata:', {
            messaggio: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
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

// ============================
// 6. AUTO-ESECUZIONE ESEMPI
// ============================

// Decommentare la riga seguente per eseguire automaticamente gli esempi
// esempiUtilizzo();

console.log('✓ Modulo caricato correttamente. Funzioni disponibili:');
console.log('  - cercaSocietaDaCodice(codice)');
console.log('  - cercaSocietaAvanzata(codice, opzioni)');
console.log('  - esempiUtilizzo()');
console.log('  - verificaAccessoSocieta(codice)');
console.log('\nQuando importato in demo-cercaSocietaDaCodice.html,');
console.log('le funzioni sono esposte globalmente per debugging da console F12.');

// Expose functions globally when not in a module context for compatibility
if (typeof window !== 'undefined') {
    window.cercaSocietaDaCodice = cercaSocietaDaCodice;
    window.cercaSocietaDaCodiceFn = cercaSocietaDaCodice; // For compatibility with demo interface
    console.log('✓ Funzioni esposte globalmente su window per compatibilità.');
}
