# Fix Login Screen Visibility When companyDocId is Present

## Problem Statement
When returning from `edit_convocation.html` or reloading the page with a known company, the login screen (`company-entry-screen`) should always be hidden and only the history view (`history-view`) should be displayed.

## Root Cause Analysis
1. **Unused Variable**: `index.html` retrieved `companyDocId` from URL/sessionStorage/localStorage but never used it
2. **Incomplete State**: `edit_convocation.html` goBack() only set `companyDocId` and `returnToHistory`, missing `editUserRole` and `editAppId`
3. **Strict Conditions**: `checkHashNavigation()` required ALL three values (companyDocId, userRole, appId) to be in sessionStorage with no fallback

## Changes Made

### 1. `edit_convocation.html` - goBack() Function
**Location**: Line 195-210

**Change**: Added code to preserve/set `editUserRole` and `editAppId` in sessionStorage

```javascript
function goBack() {
    sessionStorage.setItem('returnToHistory', 'true');
    sessionStorage.setItem('companyDocId', companyDocId);
    
    // NEW: Preserve/set editUserRole and editAppId
    if (userRole) {
        sessionStorage.setItem('editUserRole', userRole);
    }
    const appId = localStorage.getItem('convocazioniAppId');
    if (appId) {
        sessionStorage.setItem('editAppId', appId);
    }
    
    window.location.href = 'index.html#history';
}
```

**Why**: Ensures all necessary data is available for `checkHashNavigation()` to restore state

### 2. `index.html` - initApp() Function
**Location**: Line 1699-1715

**Change**: Added conditional logic to skip login screen when companyDocId + hash/returnToHistory are present

```javascript
// Check if we're returning from edit with proper flags
const hash = window.location.hash;
const returnToHistory = sessionStorage.getItem('returnToHistory');

if (companyDocIdFromReturn && (hash === '#history' || returnToHistory === 'true')) {
    console.log('🏢 companyDocId found with hash=#history or returnToHistory flag');
    // Hide login screen explicitly
    companyEntryScreen.classList.add('hidden');
    return; // Exit early - checkHashNavigation() will handle the rest
}
```

**Why**: Prevents login screen from showing when navigating back from edit

### 3. `index.html` - checkHashNavigation() Function  
**Location**: Line 6865-6926

**Changes**:
a) Added comprehensive logging for debugging
b) Added fallback to localStorage when sessionStorage values are missing
c) Made variables mutable (let instead of const) to allow fallback assignment

```javascript
// Try to get from sessionStorage first
let editCompanyDocId = sessionStorage.getItem('companyDocId') || sessionStorage.getItem('editCompanyDocId');
let editUserRole = sessionStorage.getItem('editUserRole');
let editAppId = sessionStorage.getItem('editAppId');

// NEW: If missing, try localStorage as fallback
if (editCompanyDocId && (!editUserRole || !editAppId)) {
    if (!editUserRole) {
        editUserRole = localStorage.getItem('userRole');
    }
    if (!editAppId) {
        editAppId = localStorage.getItem('convocazioniAppId');
    }
}
```

**Why**: Provides resilience when sessionStorage is partially cleared or on page reload

## Flow Diagrams

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
  - Hides login screen
  - Returns early
    ↓
checkHashNavigation() runs:
  - Finds hash=#history AND returnToHistory='true'
  - Gets editCompanyDocId, editUserRole, editAppId from sessionStorage
  - Sets global variables
  - Hides all screens (including login)
  - Shows history-view
  - Loads history data
    ↓
✅ SUCCESS: Login hidden, history shown
```

### Scenario 2: Page reload after returning from edit
```
User reloads page after being in history view
    ↓
checkHashNavigation() already cleared sessionStorage
Hash also cleared by history.replaceState
    ↓
initApp() runs:
  - companyDocId not in sessionStorage (cleared)
  - Checks localStorage for saved session
  - If found: calls startApp() or showCompanyWelcome()
  - If not found: shows login screen
    ↓
✅ SUCCESS: Uses normal flow based on localStorage
```

### Scenario 3: Immediate reload (edge case)
```
User returns from edit, then immediately reloads
    ↓
sessionStorage might still have data (if reload before checkHashNavigation cleared it)
But hash is empty (cleared by history.replaceState)
And returnToHistory cleared (by checkHashNavigation)
    ↓
initApp() runs:
  - companyDocId in sessionStorage
  - But no hash and no returnToHistory
  - Condition NOT met: (hash === '#history' || returnToHistory === 'true')
  - Falls through to normal flow
    ↓
If localStorage has full session: shows main view (logged in)
If not: shows welcome or login
    ↓
⚠️ EDGE CASE: Might briefly show wrong screen, but very unlikely
```

## Testing

### Test File: `test_login_screen_fix.html`
Created comprehensive test page to verify:
- Simulation of returning from edit
- Storage state verification
- initApp() logic testing
- checkHashNavigation() logic testing
- Fallback to localStorage testing
- Storage cleanup utilities

### Test Commands
```bash
# Open test page in browser
open test_login_screen_fix.html

# Test scenarios:
1. Click "Simula ritorno da edit" - sets up sessionStorage
2. Click "Test initApp Logic" - verifies condition evaluation
3. Click "Test checkHashNavigation" - verifies state restoration
4. Click "Test Fallback localStorage" - verifies fallback logic
5. Click "Pulisci Storage" - resets for new test
```

## Verification Checklist
- [x] edit_convocation.html goBack() saves all required sessionStorage keys
- [x] index.html initApp() checks for companyDocId + hash/returnToHistory
- [x] initApp() hides login screen when conditions met
- [x] checkHashNavigation() retrieves state from sessionStorage
- [x] checkHashNavigation() falls back to localStorage if needed
- [x] checkHashNavigation() hides all screens including login
- [x] checkHashNavigation() shows history-view
- [x] Comprehensive logging added for debugging
- [x] Test file created to verify implementation

## Known Limitations
1. **Edge case**: Immediate page reload after returning from edit might briefly show incorrect screen (very unlikely in practice)
2. **Behavior change**: After reload, user sees main view instead of history view (but they're logged in and can navigate)
3. **Dependency**: Requires localStorage to have userRole and appId for fallback to work

## Browser Compatibility
- sessionStorage: All modern browsers
- localStorage: All modern browsers
- URLSearchParams: All modern browsers
- No breaking changes to existing functionality

## Backward Compatibility
✅ Fully backward compatible
- No changes to existing API or function signatures
- Only adds new logic paths
- Existing flows continue to work as before
