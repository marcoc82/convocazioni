# Changelog - Version 9.49

## 📋 Requisiti Implementati

### 1. ✅ Checkbox nelle sessioni di allenamento (Già Verde)
**Requisito:** Il flag di "presente" deve essere sempre di colore verde, sia su desktop che mobile.

**Stato:** ✅ GIÀ IMPLEMENTATO in V9.6

**Verifica:** 
- Checkbox già utilizza `text-green-600` e `focus:ring-green-500`
- File: index.html (riga ~7895)

```html
<input type="checkbox" 
       class="training-attendance-checkbox w-5 h-5 text-green-600 rounded focus:ring-green-500" 
       data-session-id="${session.id}" 
       data-player="${player}"
       ${isChecked ? 'checked' : ''}>
```

---

### 2. ✅ Tema Dark/Light sulla pagina di login
**Requisito:** Nella pagina di login, aggiungi in alto a destra un'icona che permette di scegliere tra tema dark e tema normale. Il tema scelto deve essere memorizzato (localStorage/cookie) e riutilizzato automaticamente al prossimo accesso.

**Stato:** ✅ COMPLETATO

**Implementazione:**

#### HTML Aggiunto (linea ~500)
```html
<!-- Theme Toggle Button (visible on login screen) -->
<button id="theme-toggle-button" class="hidden bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
    <svg id="theme-icon-sun" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
    <svg id="theme-icon-moon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
</button>
```

#### CSS Dark Mode Styles (linea ~450)
```css
/* Dark Mode Styles */
body.dark-mode {
    background-color: #1f2937;
}
body.dark-mode .bg-white {
    background-color: #374151 !important;
}
body.dark-mode .bg-gray-50 {
    background-color: #4b5563 !important;
}
body.dark-mode .bg-gray-100 {
    background-color: #374151 !important;
}
body.dark-mode .text-gray-700,
body.dark-mode .text-gray-800 {
    color: #e5e7eb !important;
}
/* ... più stili dark mode ... */
```

#### JavaScript Theme Toggle Logic (linea ~2161)
```javascript
// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIconSun.classList.remove('hidden');
    themeIconMoon.classList.add('hidden');
} else {
    document.body.classList.remove('dark-mode');
    themeIconSun.classList.add('hidden');
    themeIconMoon.classList.remove('hidden');
}

// Theme toggle click handler
themeToggleButton.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    if (isDarkMode) {
        localStorage.setItem('theme', 'dark');
        themeIconSun.classList.remove('hidden');
        themeIconMoon.classList.add('hidden');
    } else {
        localStorage.setItem('theme', 'light');
        themeIconSun.classList.add('hidden');
        themeIconMoon.classList.remove('hidden');
    }
});
```

**Caratteristiche:**
- Toggle button visibile solo sulla schermata di login
- Icona luna 🌙 per attivare dark mode
- Icona sole ☀️ per tornare a light mode
- Tema salvato in localStorage
- Tema caricato automaticamente al prossimo accesso
- Transizione fluida tra temi

---

### 3. ✅ Funzionalità Cambio Password
**Requisito:** Quando accedi come mister o dirigente, nella schermata di inserimento password, aggiungi la possibilità di cambiare password: aggiungi un tasto "Cambia password" che apre una modale/form, aggiorna la password direttamente su Firebase e notifica l'utente del successo/fallimento.

**Stato:** ✅ COMPLETATO

**Implementazione:**

#### Pulsante "Cambia Password" (linea ~632)
```html
<button type="button" id="change-password-button" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 hidden">
    🔑 Cambia Password
</button>
```

#### Modal Cambio Password (linea ~636)
```html
<div id="change-password-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Cambia Password</h3>
        <form id="change-password-form" class="flex flex-col gap-4">
            <div>
                <label for="current-password-input" class="block text-sm font-medium text-gray-700 mb-1">Password Attuale</label>
                <input type="password" id="current-password-input" placeholder="Inserisci password attuale" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500" required>
            </div>
            <div>
                <label for="new-password-input" class="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
                <input type="password" id="new-password-input" placeholder="Inserisci nuova password" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500" required>
            </div>
            <div>
                <label for="confirm-new-password-input" class="block text-sm font-medium text-gray-700 mb-1">Conferma Nuova Password</label>
                <input type="password" id="confirm-new-password-input" placeholder="Conferma nuova password" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500" required>
            </div>
            <div class="flex gap-2">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2">
                    Salva
                </button>
                <button type="button" id="close-change-password-modal" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2">
                    Annulla
                </button>
            </div>
        </form>
        <div id="change-password-message" class="mt-4 text-center text-sm font-medium hidden"></div>
    </div>
</div>
```

#### Logica Cambio Password - Demo Mode (linea ~2551)
```javascript
changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password-input').value;
    const newPassword = document.getElementById('new-password-input').value;
    const confirmNewPassword = document.getElementById('confirm-new-password-input').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        changePasswordMessage.textContent = 'Tutti i campi sono obbligatori';
        changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
        changePasswordMessage.classList.remove('hidden');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        changePasswordMessage.textContent = 'Le nuove password non coincidono';
        changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
        changePasswordMessage.classList.remove('hidden');
        return;
    }
    
    if (newPassword.length < 6) {
        changePasswordMessage.textContent = 'La password deve essere di almeno 6 caratteri';
        changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
        changePasswordMessage.classList.remove('hidden');
        return;
    }
    
    // Check current password
    const expectedPassword = currentCompanyData?.passwords?.[pendingRole];
    if (currentPassword !== expectedPassword) {
        changePasswordMessage.textContent = 'Password attuale non corretta';
        changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
        changePasswordMessage.classList.remove('hidden');
        return;
    }
    
    // Update password in Firebase (demo mode saves to localStorage)
    try {
        if (currentCompanyData) {
            // Update in memory
            if (!currentCompanyData.passwords) {
                currentCompanyData.passwords = {};
            }
            currentCompanyData.passwords[pendingRole] = newPassword;
            
            // Save to localStorage for demo
            localStorage.setItem('companyData', JSON.stringify(currentCompanyData));
            
            changePasswordMessage.textContent = 'Password cambiata con successo!';
            changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-green-600';
            changePasswordMessage.classList.remove('hidden');
            
            // Close modal after 2 seconds
            setTimeout(() => {
                changePasswordModal.classList.add('hidden');
            }, 2000);
        }
    } catch (error) {
        console.error('Error changing password:', error);
        changePasswordMessage.textContent = 'Errore nel cambio password. Riprova.';
        changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
        changePasswordMessage.classList.remove('hidden');
    }
});
```

#### Logica Cambio Password - Main Mode (linea ~10789)
```javascript
// Update password in Firebase
try {
    if (currentCompanyDocumentId && window.db) {
        const passwordField = pendingRole === 'mister' ? 'misterPassword' : 'dirigentePassword';
        await window.updateDoc(window.doc(window.db, 'societa', currentCompanyDocumentId), {
            [`config.${passwordField}`]: newPassword
        });
        
        // Update local cache
        if (currentCompanyData.data && currentCompanyData.data.config) {
            currentCompanyData.data.config[passwordField] = newPassword;
        }
        
        changePasswordMessage.textContent = 'Password cambiata con successo!';
        changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-green-600';
        changePasswordMessage.classList.remove('hidden');
        
        // Close modal after 2 seconds
        setTimeout(() => {
            changePasswordModal.classList.add('hidden');
        }, 2000);
    } else {
        throw new Error('Firebase non disponibile');
    }
} catch (error) {
    console.error('Error changing password:', error);
    changePasswordMessage.textContent = 'Errore nel cambio password. Riprova.';
    changePasswordMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
    changePasswordMessage.classList.remove('hidden');
}
```

#### Visibilità Button (linea ~2404 e ~7588)
```javascript
function showPasswordEntry(role) {
    hideAllScreens();
    pendingRole = role;
    rolePrompt.textContent = `Inserisci la password per ${role === 'mister' ? 'Mister' : 'Dirigente'}:`;
    passwordInput.value = '';
    passwordEntryScreen.classList.remove('hidden');
    
    // Show change password button for mister and dirigente roles
    const changePasswordButton = document.getElementById('change-password-button');
    if (changePasswordButton && (role === 'mister' || role === 'dirigente')) {
        changePasswordButton.classList.remove('hidden');
    } else if (changePasswordButton) {
        changePasswordButton.classList.add('hidden');
    }
    
    // ... resto del codice ...
}
```

**Caratteristiche:**
- Button visibile solo per ruoli 'mister' e 'dirigente'
- Modal con 3 campi: password attuale, nuova password, conferma password
- Validazioni:
  - Tutti i campi obbligatori
  - Password nuova deve coincidere con conferma
  - Password minimo 6 caratteri
  - Password attuale deve essere corretta
- Aggiornamento Firebase in produzione
- Aggiornamento localStorage in demo mode
- Notifiche di successo/fallimento
- Modal si chiude automaticamente dopo 2 secondi in caso di successo

---

## 📊 Modifiche File

### index.html
- **Linea ~450**: Aggiunti stili CSS per dark mode
- **Linea ~500**: Aggiunto theme toggle button
- **Linea ~632**: Aggiunto button "Cambia Password"
- **Linea ~636**: Aggiunta modal cambio password
- **Linea ~2161**: Aggiunta logica theme toggle
- **Linea ~2404**: Modificata funzione showPasswordEntry (demo mode)
- **Linea ~2551**: Aggiunta logica cambio password (demo mode)
- **Linea ~7588**: Modificata funzione showPasswordEntry (main mode)
- **Linea ~10789**: Aggiunta logica cambio password (main mode)

### manifest.json
- **Linea 4**: Versione aggiornata da "V9.48" a "V9.49"

---

## 🎯 Test Eseguiti

### Test Tema Dark/Light
✅ Theme toggle button visibile sulla schermata login  
✅ Click sul button cambia da light a dark mode  
✅ Tema salvato in localStorage  
✅ Tema caricato correttamente al reload della pagina  
✅ Icone cambiano (luna/sole) in base al tema  
✅ Stili dark mode applicati correttamente a tutti gli elementi  

### Test Cambio Password
✅ Button "Cambia Password" visibile per Mister  
✅ Button "Cambia Password" visibile per Dirigente  
✅ Modal si apre correttamente  
✅ Validazione campi obbligatori funziona  
✅ Validazione password non coincidenti funziona  
✅ Validazione lunghezza minima funziona  
✅ Validazione password attuale corretta funziona  
✅ Messaggi di errore visualizzati correttamente  
✅ Modal si chiude con button Annulla  

### Test Checkbox Allenamenti
✅ Checkbox già verde (text-green-600) da V9.6  
✅ Focus ring verde (focus:ring-green-500)  

---

## 📸 Screenshot

### Schermata Login - Light Mode
![Login Light Mode](https://github.com/user-attachments/assets/fa851308-b10d-46fe-abb3-1c8acad8d992)

### Schermata Login - Dark Mode
![Login Dark Mode](https://github.com/user-attachments/assets/d69c548a-0c03-49ab-9ab0-7fed610a5ec8)

### Password Entry con Button Cambio Password
![Password Entry](https://github.com/user-attachments/assets/1f8b67ea-4414-4b1f-aca5-226aba0f00e4)

### Modal Cambio Password
![Change Password Modal](https://github.com/user-attachments/assets/acbe9eb4-645d-4f36-9abb-defadf2df45a)

---

## ✅ Riepilogo

- ✅ **Requisito 1**: Checkbox allenamenti verdi - **GIÀ IMPLEMENTATO** in V9.6
- ✅ **Requisito 2**: Tema Dark/Light con localStorage - **COMPLETATO**
- ✅ **Requisito 3**: Cambio password per Mister/Dirigente - **COMPLETATO**

**Versione:** V9.49  
**Data:** 2024-01-09  
**Stato:** ✅ PRONTO PER IL DEPLOYMENT
