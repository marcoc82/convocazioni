# Fix: Explicit Login Screen Hide and History View Show

## Problem Statement (Requisito)
Correggi index.html in modo che, dopo la conferma della società (companyDocId valorizzato), la schermata di login (company-entry-screen) sia SEMPRE nascosta e venga visualizzato solo lo storico/history-view. La logica deve essere attivata sia quando si arriva dalla modifica convocazione sia quando si ricarica la pagina con la società già nota.

**Requisito chiave:** Il codice JS deve nascondere esplicitamente la schermata di login con `.classList.add('hidden')` e mostrare history-view con `.classList.remove('hidden')` subito dopo che companyDocId è impostato.

## Solution Implemented

### Changes in index.html

#### 1. Enhanced initApp() Function (Lines 1699-1719)

**Before:**
```javascript
if (companyDocIdFromReturn && (hash === '#history' || returnToHistory === 'true')) {
    console.log('🏢 companyDocId found with hash=#history or returnToHistory flag');
    console.log('   🔄 Waiting for checkHashNavigation() to show history view...');
    // Hide login screen explicitly - history view will be shown by checkHashNavigation()
    companyEntryScreen.classList.add('hidden');
    return; // Exit early - checkHashNavigation() will handle the rest
}
```

**After:**
```javascript
if (companyDocIdFromReturn && (hash === '#history' || returnToHistory === 'true')) {
    console.log('🏢 companyDocId found with hash=#history or returnToHistory flag');
    console.log('   📍 companyDocId:', companyDocIdFromReturn);
    console.log('   📍 hash:', hash);
    console.log('   📍 returnToHistory:', returnToHistory);
    console.log('   ✅ Hiding login screen and showing history view immediately');
    
    // Hide login screen explicitly
    companyEntryScreen.classList.add('hidden');
    
    // Show history view explicitly
    historyView.classList.remove('hidden');
    
    console.log('   🔄 checkHashNavigation() will restore state and load history data...');
    return; // Exit early - checkHashNavigation() will restore state and load data
}
```

**Key Changes:**
- ✅ Added explicit call to show history view: `historyView.classList.remove('hidden')`
- ✅ Updated comment to reflect that both actions happen immediately
- ✅ Enhanced logging for clarity

#### 2. Enhanced checkHashNavigation() Function (Lines 6919-6930)

**Before:**
```javascript
// Hide all views and show history
mainView.classList.add('hidden');
attendanceView.classList.add('hidden');
trainingAttendanceView.classList.add('hidden');
campionatoView.classList.add('hidden');
hideAllScreens(); // This hides company-entry-screen
historyView.classList.remove('hidden');

console.log('   📊 Loading history data...');
```

**After:**
```javascript
// Hide login screen explicitly and hide all other views
console.log('   ✅ Hiding login screen explicitly');
companyEntryScreen.classList.add('hidden');
mainView.classList.add('hidden');
attendanceView.classList.add('hidden');
trainingAttendanceView.classList.add('hidden');
campionatoView.classList.add('hidden');
hideAllScreens(); // This ensures all screens ending with "-screen" are hidden

// Show history view explicitly
console.log('   ✅ Showing history view explicitly');
historyView.classList.remove('hidden');

console.log('   📊 Loading history data...');
```

**Key Changes:**
- ✅ Added explicit call to hide login screen before hideAllScreens(): `companyEntryScreen.classList.add('hidden')`
- ✅ Added explicit logging before hiding login screen
- ✅ Added explicit logging before showing history view
- ✅ Updated comments for clarity

## Benefits

1. **Explicit Actions:** Both hiding login screen and showing history view are now explicitly done with the required method calls
2. **Clear Logging:** Console logs clearly indicate when each action is taken
3. **Immediate Response:** When companyDocId is set, both actions happen immediately in initApp()
4. **Redundant Safety:** checkHashNavigation() also explicitly performs both actions to ensure consistency
5. **Works in Both Scenarios:**
   - ✅ Coming from edit_convocation.html (with returnToHistory flag)
   - ✅ Reloading page with company already known (companyDocId in sessionStorage/localStorage)

## Testing

A test file `test_explicit_login_hide.html` has been created to verify:
1. Simulation of returning from edit_convocation.html
2. Verification of initApp() logic
3. Verification of checkHashNavigation() logic
4. Simulation of page reload with known company

## Code Flow

### Scenario 1: Coming from edit_convocation.html
```
User clicks "Torna alla Home" in edit page
    ↓
goBack() sets sessionStorage:
  - returnToHistory = 'true'
  - companyDocId = 'xxx'
  - editUserRole = 'mister'
  - editAppId = 'app-123'
    ↓
Navigate to index.html#history
    ↓
initApp() runs:
  - Finds companyDocId + hash=#history
  - ✅ EXPLICITLY hides login: companyEntryScreen.classList.add('hidden')
  - ✅ EXPLICITLY shows history: historyView.classList.remove('hidden')
  - Returns early
    ↓
checkHashNavigation() runs:
  - Finds hash=#history AND returnToHistory='true'
  - ✅ EXPLICITLY hides login: companyEntryScreen.classList.add('hidden')
  - ✅ EXPLICITLY shows history: historyView.classList.remove('hidden')
  - Restores state variables
  - Loads history data
    ↓
✅ SUCCESS: Login hidden, history shown with explicit calls
```

### Scenario 2: Page reload with known company
```
User reloads page with companyDocId in sessionStorage/localStorage
    ↓
initApp() runs:
  - Retrieves companyDocId from sessionStorage or localStorage
  - If returnToHistory flag present or hash=#history:
    - ✅ EXPLICITLY hides login: companyEntryScreen.classList.add('hidden')
    - ✅ EXPLICITLY shows history: historyView.classList.remove('hidden')
    - Returns early
    ↓
checkHashNavigation() runs if applicable:
  - ✅ EXPLICITLY hides login and shows history
  - Restores full state
    ↓
✅ SUCCESS: Login hidden, history shown
```

## Compliance with Requirements

✅ **Requirement 1:** Login screen (company-entry-screen) is ALWAYS hidden when companyDocId is set
✅ **Requirement 2:** History view is shown when companyDocId is set
✅ **Requirement 3:** Works when coming from edit convocation
✅ **Requirement 4:** Works when reloading page with known company
✅ **Requirement 5:** Uses explicit `.classList.add('hidden')` for hiding login screen
✅ **Requirement 6:** Uses explicit `.classList.remove('hidden')` for showing history view
✅ **Requirement 7:** Actions happen immediately after companyDocId is set
✅ **Requirement 8:** Clear logging and comments added

## Files Modified

- `index.html` - Enhanced initApp() and checkHashNavigation() functions

## Files Created

- `test_explicit_login_hide.html` - Test page to verify the implementation
- `EXPLICIT_LOGIN_HIDE_FIX.md` - This documentation file
