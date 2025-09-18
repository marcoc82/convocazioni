import { cercaSocietaAvanzata } from './cercaSocietaDaCodice.js';

async function testRicercaAvanzata() {
    // Ricerca parziale: cerca tutti i codici che iniziano con "POLIS2013"
    const risultati = await cercaSocietaAvanzata('POLIS2013', {
        ricercaParziale: true,
        soloAttive: false, // oppure true, se vuoi solo attive
        limite: 10
    });

    if (risultati && risultati.length > 0) {
        console.log("DEBUG - Società trovate (query avanzata):", risultati);
    } else {
        console.log("DEBUG - Nessuna società trovata (query avanzata).");
    }
}

testRicercaAvanzata();