import { cercaSocietaDaCodice, cercaSocietaAvanzata } from './cercaSocietaDaCodice.js';

/**
 * Test completo delle funzioni di ricerca società con debug dettagliato
 */
async function testCompleto() {
    console.log('🧪 ========== TEST COMPLETO RICERCA SOCIETÀ ==========\n');

    // Test 1: Ricerca semplice con codice valido
    console.log('📋 TEST 1: Ricerca semplice con cercaSocietaDaCodice');
    console.log('═'.repeat(60));
    try {
        const risultatoSemplice = await cercaSocietaDaCodice('POLIS2013');
        if (risultatoSemplice) {
            console.log('✅ Test 1 - Società trovata con ricerca semplice');
        } else {
            console.log('❌ Test 1 - Nessuna società trovata con ricerca semplice');
        }
    } catch (error) {
        console.error('💥 Test 1 - Errore:', error.message);
    }

    console.log('\n' + '═'.repeat(80) + '\n');

    // Test 2: Ricerca avanzata esatta
    console.log('📋 TEST 2: Ricerca avanzata esatta con cercaSocietaAvanzata');
    console.log('═'.repeat(60));
    try {
        const risultatoAvanzatoEsatto = await cercaSocietaAvanzata('POLIS2013', {
            ricercaParziale: false,
            soloAttive: false,
            limite: 10
        });
        if (risultatoAvanzatoEsatto && risultatoAvanzatoEsatto.length > 0) {
            console.log('✅ Test 2 - Società trovate con ricerca avanzata esatta:', risultatoAvanzatoEsatto.length);
        } else {
            console.log('❌ Test 2 - Nessuna società trovata con ricerca avanzata esatta');
        }
    } catch (error) {
        console.error('💥 Test 2 - Errore:', error.message);
    }

    console.log('\n' + '═'.repeat(80) + '\n');

    // Test 3: Ricerca avanzata parziale
    console.log('📋 TEST 3: Ricerca avanzata parziale con cercaSocietaAvanzata');
    console.log('═'.repeat(60));
    try {
        const risultatoAvanzatoParziale = await cercaSocietaAvanzata('POLIS', {
            ricercaParziale: true,
            soloAttive: false,
            limite: 5
        });
        if (risultatoAvanzatoParziale && risultatoAvanzatoParziale.length > 0) {
            console.log('✅ Test 3 - Società trovate con ricerca parziale:', risultatoAvanzatoParziale.length);
            console.log('📝 Società trovate:');
            risultatoAvanzatoParziale.forEach((societa, index) => {
                console.log(`   ${index + 1}. ${societa.nome} (${societa.codici}) - Attiva: ${societa.attiva}`);
            });
        } else {
            console.log('❌ Test 3 - Nessuna società trovata con ricerca parziale');
        }
    } catch (error) {
        console.error('💥 Test 3 - Errore:', error.message);
    }

    console.log('\n' + '═'.repeat(80) + '\n');

    // Test 4: Test con codice non esistente
    console.log('📋 TEST 4: Test con codice non esistente');
    console.log('═'.repeat(60));
    try {
        const risultatoNonEsistente = await cercaSocietaDaCodice('CODICE_INESISTENTE_XYZ123');
        if (risultatoNonEsistente) {
            console.log('⚠️ Test 4 - Risultato inaspettato: società trovata');
        } else {
            console.log('✅ Test 4 - Comportamento corretto: nessuna società trovata');
        }
    } catch (error) {
        console.error('💥 Test 4 - Errore:', error.message);
    }

    console.log('\n' + '═'.repeat(80) + '\n');

    // Test 5: Test con input non valido
    console.log('📋 TEST 5: Test gestione input non validi');
    console.log('═'.repeat(60));
    try {
        const testCodiceVuoto = await cercaSocietaDaCodice('');
        const testCodiceNull = await cercaSocietaDaCodice(null);
        const testCodiceUndefined = await cercaSocietaDaCodice(undefined);
        
        console.log('✅ Test 5 - Gestione input non validi completata');
        console.log(`   - Codice vuoto: ${testCodiceVuoto === null ? 'OK' : 'ERRORE'}`);
        console.log(`   - Codice null: ${testCodiceNull === null ? 'OK' : 'ERRORE'}`);
        console.log(`   - Codice undefined: ${testCodiceUndefined === null ? 'OK' : 'ERRORE'}`);
    } catch (error) {
        console.error('💥 Test 5 - Errore:', error.message);
    }

    console.log('\n🏁 ========== FINE TEST COMPLETO ==========');
}

/**
 * Test di ricerca avanzata (funzione originale migliorata)
 */
async function testRicercaAvanzata() {
    console.log('🔍 ========== TEST RICERCA AVANZATA ==========\n');
    
    // Ricerca parziale: cerca tutti i codici che iniziano con "POLIS2013"
    const risultati = await cercaSocietaAvanzata('POLIS2013', {
        ricercaParziale: true,
        soloAttive: false, // oppure true, se vuoi solo attive
        limite: 10
    });

    if (risultati && risultati.length > 0) {
        console.log("✅ DEBUG - Società trovate (query avanzata):", risultati);
        console.log(`📊 Numero società trovate: ${risultati.length}`);
    } else {
        console.log("❌ DEBUG - Nessuna società trovata (query avanzata).");
    }
}

// Esecuzione dei test
console.log('🚀 Avvio test delle funzioni di ricerca società...\n');

// Esegui il test completo
testCompleto().then(() => {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 Tutti i test completati. Controlla i log di debug sopra per i dettagli.');
}).catch(error => {
    console.error('💥 Errore durante l\'esecuzione dei test:', error);
});

// Esegui anche il test originale
setTimeout(() => {
    console.log('\n' + '='.repeat(80));
    testRicercaAvanzata();
}, 2000);