# Changelog V6.4

## Version 6.4 - Fix Navigation from Edit Convocation to History View & Mister Loading
**Date**: December 2024

### Summary
This release fixes two critical issues:
1. Users were redirected to the login screen instead of the history view after editing or canceling a convocation from the history screen
2. Mister (coach) loading order ensured that dropdown options are loaded before setting selected values

The solution implements hash-based navigation and sessionStorage to maintain application state, and ensures proper loading sequence for form pre-population.

### Problem Statement
When a user:
1. Opens the history view (Storico Convocazioni)
2. Clicks "Modifica" (Edit) on a convocation
3. Edits the convocation and clicks "Annulla" (Cancel) or "Salva" (Save)
4. The page redirected to `index.html` without any state
5. This caused the application to show the login screen instead of returning to the history view

Additionally, there was a timing issue where:
- Mister (coach) selections were not properly pre-selected in the edit form
- This was due to attempting to set dropdown values before the options were populated
- The fix ensures `loadCoaches()` is called BEFORE `prefillForm()` to guarantee options exist

### Solution Implementation

#### 1. Modified `edit_convocation.html` - goBack() Function
**Location**: Line 193-196

**Before:**
```javascript
function goBack() {
    window.location.href = `index.html`;
}
```

**After:**
```javascript
function goBack() {
    // Store return flag in sessionStorage to indicate we should show history view
    sessionStorage.setItem('returnToHistory', 'true');
    window.location.href = `index.html#history`;
}
```

**Changes:**
- Added sessionStorage flag to indicate return to history
- Added hash anchor `#history` to the URL
- This function is called both when clicking "Annulla" (Cancel) and after successful save

#### 2. Modified `index.html` - Edit Button Event Handler
**Location**: Line 2714-2727

**Changes:**
- Store application state in sessionStorage before navigating to edit page:
  - `editOrigin`: Set to 'history' to track where the edit was initiated
  - `editCompanyDocId`: Current company document ID
  - `editUserRole`: Current user role (mister/dirigente)
  - `editAppId`: Current application ID

```javascript
// Store state in sessionStorage to restore history view after editing
sessionStorage.setItem('editOrigin', 'history');
sessionStorage.setItem('editCompanyDocId', currentCompanyDocumentId);
sessionStorage.setItem('editUserRole', userRole);
sessionStorage.setItem('editAppId', currentAppId);
```

#### 3. Added Hash Navigation Handler in `index.html`
**Location**: Line 6830-6877

**New Function: `checkHashNavigation()`**
- Checks for hash `#history` in the URL
- Verifies the `returnToHistory` flag in sessionStorage
- Restores application state from sessionStorage:
  - Sets `currentCompanyDocumentId`
  - Sets `userRole`
  - Sets `currentAppId`
- Hides all views and shows the history view
- Loads history convocations data
- Cleans up sessionStorage and URL hash

**Integration:**
- Called on DOMContentLoaded (initial page load)
- Added hashchange event listener for dynamic hash changes
- Ensures proper cleanup of sessionStorage after state restoration

#### 4. Added `loadHistoryConvocations()` Function in `index.html`
**Location**: Line 6831-6839

**New Function:**
```javascript
function loadHistoryConvocations() {
    console.log('📊 Loading history convocations after navigation');
    console.log('   🏢 Company Document ID:', currentCompanyDocumentId);
    console.log('   👤 User Role:', userRole);
    console.log('   🆔 App ID:', currentAppId);
    
    // Setup Firestore listeners to load history data
    setupFirestoreListeners(currentAppId);
}
```

**Purpose:**
- Called by `checkHashNavigation()` when returning from edit page
- Sets up Firestore listeners to properly load history data
- Includes debug logging for troubleshooting
- Fixes error in `checkHashNavigation()` that was calling non-existent function

#### 5. Verified Mister Loading Order in `edit_convocation.html`
**Location**: Lines 226-238

**Implementation:**
```javascript
// Load coaches first, then pre-fill the form
console.log('🔄 [DEBUG] Loading sequence:');
console.log('   1️⃣ Loading coaches...');
loadCoaches();
console.log('   2️⃣ Pre-filling form...');
prefillForm(originalConvocation);
console.log('   3️⃣ Loading players...');
loadPlayers();
console.log('✅ [DEBUG] All loading complete');
```

**Key Points:**
- `loadCoaches()` is called FIRST (line 227) to populate dropdown options
- `prefillForm()` is called SECOND (line 228) to set selected values
- This ensures dropdown options exist before attempting to set the selected value
- If saved mister value is 'N/D' or not in the list, the dropdown remains at default "Seleziona mister"
- No setTimeout workarounds needed - fully synchronous execution
- **Added debug logging to trace loading sequence**

**Validation in prefillForm() (lines 246-265):**
```javascript
// Set mister selections if available (coaches already loaded)
console.log('🔄 [DEBUG] prefillForm() - Setting mister values');
console.log('   📋 misterPartita from convocation:', convocation.details.misterPartita);
console.log('   📋 misterTipo from convocation:', convocation.details.misterTipo);

if (convocation.details.misterPartita && convocation.details.misterPartita !== 'N/D') {
    console.log('   ➡️ Setting misterPartitaSelect.value to:', convocation.details.misterPartita);
    misterPartitaSelect.value = convocation.details.misterPartita;
    console.log('   ✅ misterPartitaSelect.value after setting:', misterPartitaSelect.value);
} else {
    console.log('   ⚠️ Not setting misterPartita (value is N/D or empty)');
}

if (convocation.details.misterTipo && convocation.details.misterTipo !== 'N/D') {
    console.log('   ➡️ Setting misterTipoSelect.value to:', convocation.details.misterTipo);
    misterTipoSelect.value = convocation.details.misterTipo;
    console.log('   ✅ misterTipoSelect.value after setting:', misterTipoSelect.value);
} else {
    console.log('   ⚠️ Not setting misterTipo (value is N/D or empty)');
}
```

#### 6. Enhanced Debug Logging in `loadCoaches()` Function
**Location**: Lines 265-292

**Implementation:**
```javascript
function loadCoaches() {
    console.log('🔄 [DEBUG] loadCoaches() - Start');
    console.log('   📋 companyCoaches:', companyCoaches);
    console.log('   📊 Number of coaches:', companyCoaches ? companyCoaches.length : 0);
    
    if (!companyCoaches || companyCoaches.length === 0) {
        console.log('   ⚠️ No coaches to load');
        return;
    }

    companyCoaches.forEach((coach, index) => {
        const coachName = typeof coach === 'string' ? coach : coach.name;
        console.log(`   ➕ Adding coach #${index + 1}: "${coachName}"`);
        
        // ... add options to dropdowns ...
    });
    
    console.log('   ✅ loadCoaches() - Complete');
    console.log('   📊 misterPartitaSelect options:', misterPartitaSelect.options.length);
    console.log('   📊 misterTipoSelect options:', misterTipoSelect.options.length);
}
```

**Benefits:**
- Comprehensive logging for troubleshooting mister loading issues
- Shows exact number of coaches loaded
- Tracks each coach being added to dropdowns
- Verifies final dropdown option counts
- Helps identify timing or data issues

### Technical Details

#### SessionStorage Keys Used:
- `returnToHistory`: Boolean flag indicating return from edit page
- `editOrigin`: Tracks where edit was initiated from
- `editCompanyDocId`: Company document ID to restore
- `editUserRole`: User role to restore
- `editAppId`: Application ID to restore

#### Navigation Flow:
1. **History View → Edit Page:**
   - User clicks "Modifica" button
   - State saved to sessionStorage
   - Navigate to `edit_convocation.html` with query parameters

2. **Edit Page → History View:**
   - User clicks "Annulla" or saves successfully
   - `returnToHistory` flag set in sessionStorage
   - Navigate to `index.html#history`
   - Hash detected on page load
   - State restored from sessionStorage
   - History view displayed
   - SessionStorage cleaned up

### Benefits
- ✅ Maintains user authentication state
- ✅ Returns to history view after edit/cancel
- ✅ No forced login after modification
- ✅ Seamless user experience
- ✅ Uses browser-native features (hash, sessionStorage)
- ✅ Automatic cleanup of temporary state
- ✅ Works with both "Annulla" and "Salva" actions
- ✅ Mister selections properly pre-loaded in edit form
- ✅ Synchronous loading order prevents timing issues
- ✅ Handles 'N/D' values gracefully (leaves at default)
- ✅ **Comprehensive debug logging for troubleshooting**
- ✅ **Easy to diagnose mister loading issues via console logs**
- ✅ **loadHistoryConvocations() function prevents navigation errors**

### Testing Recommendations
1. Open application and login
2. Navigate to "Storico Convocazioni"
3. Click "Modifica" on any convocation
4. **Open browser console (F12) to view debug logs**
5. **Verify debug logs show:**
   - Company data loaded with player and coach counts
   - Loading sequence: coaches → form prefill → players
   - loadCoaches() start, each coach added, completion with option counts
   - prefillForm() showing mister values being set
6. **Verify mister dropdowns show previously selected coaches**
7. Click "Annulla" - should return to history view
8. **Verify debug logs show loadHistoryConvocations() being called**
9. Click "Modifica" again
10. Make changes and click "Salva Modifiche" - should return to history view after success message
11. Verify no login screen is shown in either case
12. Verify history data is properly loaded and displayed
13. **Test editing a convocation with 'N/D' mister values - should show default dropdown and log warnings**
14. **Use test_v64_fixes.html for automated verification of all fixes**

### Files Modified
- `edit_convocation.html`: 
  - Modified goBack() function
  - Verified mister loading order  
  - Added comprehensive debug logging in loadCoaches() function
  - Added debug logging in prefillForm() for mister value setting
  - Added loading sequence debug logs
- `index.html`: 
  - Added sessionStorage state management
  - Added hash navigation handler (checkHashNavigation)
  - **Added loadHistoryConvocations() function to fix navigation error**
- `manifest.json`: Updated version to V6.4
- `CHANGELOG_V6.4.md`: Updated with comprehensive documentation including debug logging details
- `test_v64_fixes.html`: **New test file for verifying all V6.4 fixes**

### Backward Compatibility
- ✅ No breaking changes
- ✅ Existing functionality preserved
- ✅ Works with all existing user roles (mister, dirigente, marco)
- ✅ Compatible with guest user mode (guest users cannot edit)
- ✅ No database schema changes required
- ✅ No forced re-login or session loss
- ✅ Handles both new and legacy convocation data formats
