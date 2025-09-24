// Main.js - Diagnostic Logging for Company Verification
console.log('🔄 [MAIN.JS] Caricamento main.js iniziato...');

// Function to add diagnostic log to HTML
function addDiagnosticLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logArea = document.getElementById('diagnostic-log-area');
    
    if (logArea) {
        const logEntry = document.createElement('div');
        logEntry.className = `diagnostic-log-entry diagnostic-${type}`;
        
        // Color coding based on type
        let colorClass = 'text-gray-700';
        let prefix = 'ℹ️';
        
        switch(type) {
            case 'success':
                colorClass = 'text-green-700';
                prefix = '✅';
                break;
            case 'error':
                colorClass = 'text-red-700';
                prefix = '❌';
                break;
            case 'warning':
                colorClass = 'text-yellow-700';
                prefix = '⚠️';
                break;
            case 'debug':
                colorClass = 'text-blue-700';
                prefix = '🔍';
                break;
        }
        
        logEntry.innerHTML = `
            <span class="text-xs text-gray-500">[${timestamp}]</span>
            <span class="${colorClass}"> ${prefix} ${message}</span>
        `;
        
        logArea.appendChild(logEntry);
        
        // Auto-scroll to bottom
        logArea.scrollTop = logArea.scrollHeight;
        
        // Limit to last 50 entries
        const entries = logArea.querySelectorAll('.diagnostic-log-entry');
        if (entries.length > 50) {
            entries[0].remove();
        }
    }
    
    // Also log to console
    console.log(`🔍 [DIAGNOSTIC] ${message}`);
}

// Make addDiagnosticLog globally available
window.addDiagnosticLog = addDiagnosticLog;

// Initialize diagnostic logging when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ [MAIN.JS] DOM caricato, inizializzazione diagnostic logging...');
    addDiagnosticLog('Main.js caricato e inizializzato correttamente', 'success');
    
    // Find the verify company button
    const verifyButton = document.getElementById('verify-company-button');
    
    if (verifyButton) {
        addDiagnosticLog('Bottone "verify-company-button" trovato con successo', 'success');
        
        // Add click listener to the button
        verifyButton.addEventListener('click', function() {
            addDiagnosticLog('Bottone "Verifica" cliccato dall\'utente', 'debug');
        });
        
        addDiagnosticLog('Event listener aggiunto al bottone di verifica', 'success');
    } else {
        addDiagnosticLog('ERRORE: Bottone "verify-company-button" NON trovato!', 'error');
    }
});

console.log('✅ [MAIN.JS] Caricamento main.js completato');