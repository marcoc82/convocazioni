# Changelog - Version 7.9

## Overview
Version 7.9 fixes a critical **ReferenceError** bug where `normalizePlayerName` function was not accessible from all required scopes, causing JavaScript errors when loading attendance summary tables (Amichevoli, Tornei, Campionato) and retrieving % Disponibilità data from Firebase.

## Problem Statement

### The Bug
The `normalizePlayerName` function was defined **locally** inside the `loadAttendance()` function (around line 2935), but was being called from other functions:
- `updateAttendanceTables()` function - for Tornei table Firebase matching (line ~3128)
- `populateAttendanceTable()` function - for % Disp. display (line ~3198)

This caused a **ReferenceError: normalizePlayerName is not defined** error in the browser console.

### Impact
- ❌ JavaScript errors in console
- ❌ Tornei % Disp. column failed to retrieve data from Firebase
- ❌ Player name matching with leading numbers (e.g., "1 ROSSI MARIO") failed in some tables
- ❌ Percentage availability data not displayed correctly

## Solution - V7.9

### Key Change: Move normalizePlayerName to Global Scope

The function was moved from a local definition to a **global helper function** (after line 1726, alongside other helper functions like `isGuest()`, `isDirigente()`, etc.).

```javascript
// V7.9: Helper function to normalize player names for matching
// Strips leading numbers/characters, then normalizes (lowercase, trim, remove accents/special chars)
// Used in all attendance summary tables (Amichevoli, Tornei, Campionato) and Firebase % Disp. matching
function normalizePlayerName(name) {
    if (!name) return '';
    return name
        .replace(/^[^a-zA-Z]+/, '') // V7.2: Strip leading numbers and non-letter characters
        .toLowerCase()
        .trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s]/gi, '') // Remove special characters except spaces and alphanumeric
        .replace(/\s+/g, ' '); // Collapse multiple spaces to single space
}
```

### Function Usage Locations

The function is now accessible from all the following places:

1. **loadAttendance() function** (~line 2958)
   - Creates normalized keys for Firebase `convocazioni` data
   - Matches player names for % Disp. in main attendance table

2. **updateAttendanceTables() function** (~line 3129)
   - Creates normalized keys for Firebase `disptornei` data
   - Matches player names for Tornei table % Disp. column

3. **populateAttendanceTable() function** (~line 3199)
   - Matches player names when displaying % Disp. in Tornei table

### Transformation Examples

The function correctly handles all these cases:

| Input | Output | Use Case |
|-------|--------|----------|
| `"1 ROSSI MARIO"` | `"rossi mario"` | Leading single digit |
| `"10 BIANCHI LUIGI"` | `"bianchi luigi"` | Leading double digit |
| `"ROSSI MARIO"` | `"rossi mario"` | No leading numbers |
| `"5 VERDI  GIUSEPPE"` | `"verdi giuseppe"` | Multiple spaces |
| `"3 BLÙ MARCO"` | `"blu marco"` | Accented characters |
| `"12 D'ANGELO LUCA"` | `"dangelo luca"` | Special characters |
| `"#3 GIALLI ANDREA"` | `"gialli andrea"` | Leading special chars |

## Files Modified

### 1. index.html (4 changes)
- **Line 2**: Updated version comment to V7.9
- **Line 237**: Updated visible version display to "V 7.9"
- **Line 1731**: Added global `normalizePlayerName()` function definition
- **Line 2935**: Removed local `normalizePlayerName()` definition
- **Updated comments**: All references to the function now mention V7.9 and "global" usage

### 2. manifest.json (1 change)
- **Line 4**: Updated version from "V7.8" to "V7.9"

## Verification

### Test Results
✅ All 10 test cases pass:
1. ✅ Leading single digit (e.g., "1 ROSSI MARIO")
2. ✅ Leading double digit (e.g., "10 BIANCHI LUIGI")
3. ✅ No leading numbers (e.g., "ROSSI MARIO")
4. ✅ Multiple spaces normalization
5. ✅ Accented characters removal
6. ✅ Special characters handling
7. ✅ Mixed case normalization
8. ✅ Leading special characters
9. ✅ Empty string handling
10. ✅ Only numbers edge case

### Scope Tests
✅ Function accessible from:
- ✅ Direct global scope
- ✅ Within other functions
- ✅ Async contexts (callbacks, setTimeout, etc.)

## Expected Behavior After Fix

### 1. No JavaScript Errors
- ✅ Console is clean, no ReferenceError
- ✅ All functions execute without errors

### 2. Player Names Visible
- ✅ Names display correctly in all three summary tables:
  - 🤝 Amichevoli
  - 🏆 Tornei
  - ⚽️ Campionato

### 3. % Disp. Column Works
For **POLIS** company:
- ✅ Main attendance table: % Disp. column shows percentages from Firebase `convocazioni`
- ✅ Tornei table: % Disp. column shows percentages from Firebase `disptornei`
- ✅ Values are rounded up to integers (no decimals)
- ✅ "0%" displays correctly (not "N/D")
- ✅ "N/D" displays only when data is truly missing

### 4. Name Matching Works
- ✅ Players with leading numbers (e.g., "1 ROSSI MARIO") match Firebase keys without numbers
- ✅ Case-insensitive matching works
- ✅ Accented characters match correctly
- ✅ Multiple spaces are handled

## Technical Details

### Why Global Scope?
The function needs to be accessible from multiple independent functions:
- `loadAttendance()` - async function that loads main attendance data
- `updateAttendanceTables()` - async function that updates filtered tables
- `populateAttendanceTable()` - helper function called by updateAttendanceTables

These functions are at the same scope level (inside the main DOMContentLoaded event listener), so the helper function needs to be defined at their level or higher to be accessible to all of them.

### Location Choice
Placed after line 1726, alongside other helper functions:
- `isGuest()`
- `isDirigente()`
- `canAccessDistinta()`
- `canShare()`
- `canShareHistory()`
- `isPlayerCalledToday()`
- **`normalizePlayerName()`** ← NEW in V7.9

This maintains consistency with the codebase structure and makes the function easy to find.

## Backward Compatibility

✅ **100% backward compatible**
- No breaking changes
- All existing functionality preserved
- Only fixes a bug, doesn't change behavior
- Comments updated to reflect V7.9, but logic unchanged from V7.2

## Related Versions

This fix builds upon:
- **V7.2**: Originally introduced the normalization logic (stripping leading numbers)
- **V7.7**: Added Tornei % Disp. column and match counting
- **V7.8**: Fixed querySelector :has() selector issues

## Testing Checklist

- [x] Function is defined globally (line 1731)
- [x] Local definition removed (was at line 2935)
- [x] Function accessible from loadAttendance()
- [x] Function accessible from updateAttendanceTables()
- [x] Function accessible from populateAttendanceTable()
- [x] All 10 normalization test cases pass
- [x] Scope accessibility tests pass
- [x] Version updated in HTML comment
- [x] Version updated in visible display
- [x] Version updated in manifest.json
- [x] Comments updated to reflect V7.9
- [x] No breaking changes introduced

---

**Version:** V7.9  
**Date:** 2024  
**Type:** Bug Fix  
**Priority:** High (JavaScript Error)  
**Status:** ✅ Complete
