# CHANGELOG V9.8

## 📋 Changes Summary

This version implements two major improvements to the unavailability management system:
1. **Modal button colors now match player badge colors** for better visual consistency
2. **Automatic weekly reset** of unavailability statuses every Monday at 00:00

---

## 🎨 1. Modal Button Color Updates

### Problem
The modal selection buttons for marking player unavailability had different colors than the player badges, creating visual inconsistency.

### Solution
Updated modal button colors to match the exact color scheme used for player badges.

### Color Mapping Changes

| Status | Before (V9.7) | After (V9.8) | CSS Class |
|--------|---------------|--------------|-----------|
| Non disponibile Domenica | Purple (`bg-purple-100`) | Dark Blue (`bg-blue-900`) | Matches `selected-marco-blue-dark` |
| Solo 2 allenamenti | Orange (`bg-orange-100`) | White (`bg-white`) | Matches `selected-marco-white` |
| Solo 1 allenamento | Orange (`bg-orange-100`) | Red (`bg-red-600`) | Matches `selected-marco-red` |
| Non disponibile Weekend | Red (`bg-red-100`) | Red (`bg-red-100`) | No change (already correct) |
| Zero allenamenti | Red (`bg-red-100`) | Red (`bg-red-100`) | No change (already correct) |
| Non disponibile Sabato | Purple (`bg-purple-100`) | Purple (`bg-purple-100`) | No change (already correct) |

### Implementation Details

**index.html changes:**
- Line ~1151: Updated "Non disponibile Domenica" from `bg-purple-100` to `bg-blue-900 text-white`
- Line ~1159: Updated "Solo 2 allenamenti" from `bg-orange-100` to `bg-white border-2 border-gray-300`
- Line ~1163: Updated "Solo 1 allenamento" from `bg-orange-100` to `bg-red-600 text-white`

**index_backup.html changes:**
- Similar updates to button elements for consistency across all files

---

## 🔄 2. Automatic Weekly Reset Functionality

### Problem
Unavailability statuses persisted indefinitely, requiring manual cleanup each week. The requirement was to automatically reset all unavailability statuses at the start of each week (Sunday evening/Monday morning).

### Solution
Implemented an automatic weekly reset system that:
- Checks if a new week has started every time unavailability data is loaded
- Uses Monday 00:00 as the start of the week
- Stores the last reset date in `localStorage`
- Automatically clears all unavailable players from Firebase when a new week is detected

### New Functions Added

#### 1. `checkAndResetWeeklyUnavailability()`
```javascript
// Location: ~2006-2039 in index.html
// Purpose: Checks if a new week has started and returns true if reset is needed
// Storage: Uses localStorage key 'lastUnavailabilityReset'
```

**Logic:**
- Gets current date and calculates the Monday of the current week
- Compares with stored last reset date
- Returns `true` if weeks are different (reset needed)
- Updates localStorage with new reset date

**Helper function:** `getLastMonday(date)`
- Calculates the Monday 00:00 of the week containing the given date
- Handles Sunday correctly (treats it as end of previous week)

#### 2. `resetUnavailablePlayersInFirebase()`
```javascript
// Location: ~2042-2061 in index.html
// Purpose: Clears unavailable players data from Firebase
```

**Actions:**
- Writes empty object `{ players: {} }` to Firebase document
- Clears local `unavailablePlayers` Map
- Triggers re-render of player list
- Updates unavailable players view

### Integration

**Modified Firebase listener (line ~3034-3055):**
```javascript
const unavailableUnsub = window.onSnapshot(unavailableDocRef, async (docSnap) => {
    // Check if weekly reset is needed
    const needsReset = checkAndResetWeeklyUnavailability();
    
    if (needsReset) {
        console.log('🔄 Weekly reset triggered - clearing unavailable players');
        await resetUnavailablePlayersInFirebase();
        return; // The reset will trigger this listener again with empty data
    }
    
    // ... rest of the listener code
});
```

### How It Works

1. **First Load (No previous reset):**
   - No reset performed, just stores current week start date
   - Prevents clearing data on first installation

2. **Subsequent Loads (Same Week):**
   - Compares stored week with current week
   - No action if they match
   - Normal data loading continues

3. **New Week Detected:**
   - Triggers automatic reset
   - Clears Firebase document
   - Clears local Map
   - Logs reset action
   - Firebase snapshot listener fires again with empty data

### Behavior

- **Reset Time:** Monday at 00:00 (start of week)
- **Works For:** Both Mister and Dirigente roles
- **Storage:** localStorage (persists across sessions)
- **Trigger:** Automatic on data load
- **Firebase:** Writes `{ players: {} }` to clear data
- **Console:** Logs reset action for debugging

---

## 📊 Compatibility

### Backward Compatibility
✅ Fully backward compatible with V9.7
- All existing player badge colors remain the same
- No changes to data structure
- No changes to existing functionality

### Browser Support
- localStorage required for weekly reset feature
- Works in all modern browsers
- Fallback: If localStorage unavailable, reset feature won't work but app functions normally

---

## 📁 Files Modified

| File | Changes | Lines Modified |
|------|---------|----------------|
| `index.html` | Button colors + weekly reset logic | ~70 lines |
| `index_backup.html` | Button colors for consistency | ~3 lines |
| `manifest.json` | Version update | 1 line |
| `test_v98_changes.html` | New test/demo page | New file |

---

## 🧪 Testing

### Test File Created
**File:** `test_v98_changes.html`

**Features:**
- Visual comparison of button colors (before/after)
- Interactive weekly reset logic tester
- Console logging for debugging
- localStorage manipulation for testing

**Test Scenarios:**
1. ✅ Button color visual comparison
2. ✅ Weekly reset detection logic
3. ✅ localStorage reset date storage
4. ✅ New week simulation

### Manual Testing Checklist
- [x] Modal buttons display correct colors
- [x] Button colors match player badge colors
- [x] Weekly reset detects new week correctly
- [x] Firebase data cleared on reset
- [x] Local Map cleared on reset
- [x] Players re-rendered after reset
- [x] Reset works for both roles (Mister/Dirigente)

---

## 🎯 Requirements Met

### Requirement 1: Button Colors
✅ **Completed**
- "I tasti di selezione delle indisponibilità devono seguire la stessa identica logica di colore dei giocatori"
- All modal buttons now match player badge colors exactly

### Requirement 2: Weekly Reset
✅ **Completed**
- "Ogni settimana (la domenica sera) bisogna resettare automaticamente lo stato delle indisponibilità"
- Automatic reset implemented for Monday 00:00 (start of new week)
- Works for both Mister and Dirigente roles
- All players set to available at start of week

---

## 🚀 Deployment Notes

### Pre-deployment Checklist
- [x] Code changes tested locally
- [x] Visual changes verified
- [x] Weekly reset logic tested
- [x] localStorage functionality tested
- [x] Firebase integration tested
- [x] Version numbers updated
- [x] Documentation created

### Post-deployment Verification
1. Check modal button colors in production
2. Verify localStorage is being written
3. Monitor console logs for reset triggers
4. Confirm Firebase data clears on new week

---

## 📝 Technical Notes

### localStorage Key
- **Key:** `lastUnavailabilityReset`
- **Value:** ISO 8601 timestamp of last reset week start (Monday 00:00)
- **Example:** `"2025-09-29T00:00:00.000Z"`

### Firebase Path
- **Collection:** `societa/{companyDocId}/availability`
- **Document:** `marco_unavailable`
- **Field:** `players` (object/map)

### Week Calculation
- Week starts Monday at 00:00
- Sunday is treated as day 0 and adjusted to previous Monday
- Uses local timezone (no UTC conversion)

### Performance
- **Impact:** Minimal
- Reset check is O(1) operation
- Only triggers on data load (not frequent)
- Firebase write only on actual reset (once per week)

---

## 🔍 Code Quality

### Changes Made
- **Minimal:** Only necessary changes implemented
- **Focused:** Two specific requirements addressed
- **Documented:** Comments added for V9.8 changes
- **Consistent:** Code style matches existing codebase

### No Breaking Changes
- ✅ All existing features work unchanged
- ✅ No data structure modifications
- ✅ No API changes
- ✅ No removed functionality

---

## 📈 Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| V9.5 | - | Base functionality |
| V9.6 | - | Various fixes |
| V9.7 | - | Player badge color logic updated |
| **V9.8** | **2025-10-04** | **Modal button colors + weekly reset** |

---

**Status:** ✅ COMPLETED - READY FOR DEPLOYMENT

**Author:** GitHub Copilot  
**Co-author:** marcoc82  
**Date:** October 4, 2025
