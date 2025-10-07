# CHANGELOG V9.25

## 🔧 Fix: Weekly Arrow Update Logic

**Date:** January 2025  
**Type:** Bug Fix  
**Priority:** High  
**Impact:** Training Report & Match Summary

---

## 📋 Summary

Fixed critical bug where ranking arrows (🔼🔽) were updating every time a training session was saved, instead of only once per week as intended.

---

## 🐛 Bug Description

**Problem:**  
The arrows showing ranking changes in both:
- Training Attendance Report (Report Presenze Allenamenti)
- Match Summary (Riepilogo Totale)

Were updating multiple times per week instead of only once per week.

**Root Cause:**  
Faulty condition `(now.getDay() > lastUpdate.getDay())` in the weekly update logic caused updates whenever the current day of week was greater than the last update day, resulting in multiple updates within the same week.

---

## ✅ Solution

Replaced day-of-week comparison with proper week-based comparison:

### Before (Buggy):
```javascript
const lastUpdateWasBeforeThisWeek = daysSinceUpdate >= 7 || 
    (isMonday && lastUpdate.getDay() !== 1) ||
    (now.getDay() > lastUpdate.getDay());  // ❌ BUG
```

### After (Fixed):
```javascript
const getMondayOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const currentWeekMonday = getMondayOfWeek(now);
const lastUpdateWeekMonday = getMondayOfWeek(lastUpdate);

if (currentWeekMonday.getTime() !== lastUpdateWeekMonday.getTime()) {
    shouldUpdate = true;  // ✅ CORRECT
}
```

---

## 📊 Changes Made

### Files Modified:
1. **index.html**
   - Fixed `loadAllenamentiReport()` function (~line 7131-7156)
   - Fixed `loadAttendance()` function (~line 4442-4468)
   
2. **manifest.json**
   - Updated version: V9.24 → V9.25

### Files Added:
1. **test_weekly_arrow_fix.html**
   - Comprehensive test suite for the fix
   - Tests 6 scenarios with old vs new logic comparison

2. **V9.25_FIX_FRECCE_SETTIMANALI_ITALIANO.md**
   - Complete documentation in Italian
   - Test scenarios and verification steps

---

## 🧪 Testing

### Test Scenarios Validated:
- ✅ Same week (Mon→Tue, Tue→Wed): NO update
- ✅ Same day (Mon AM→Mon PM): NO update
- ✅ New week (Sun→Mon, Fri→Mon): UPDATE
- ✅ Multiple weeks: UPDATE

### Test Files:
- `test_weekly_arrow_fix.html` - Interactive test page
- All tests pass with new logic
- Old logic fails on same-week scenarios

---

## 🎯 Expected Behavior

### Before Fix (V9.24):
- ❌ Arrows changed on every training session save
- ❌ Unreliable weekly comparison
- ❌ Confusing for managers

### After Fix (V9.25):
- ✅ Arrows change ONLY when entering new week (Monday)
- ✅ Reliable week-to-week comparison
- ✅ Consistent behavior during the week
- ✅ Clear weekly progress tracking

---

## 📝 Usage Notes

### For Managers (Dirigenti):
1. **Monday:** First page load will update arrows for the new week
2. **Tuesday-Sunday:** Saving training sessions will NOT change arrows
3. **Next Monday:** Arrows will update again to reflect new week comparison

### localStorage Keys:
- Training Report: `lastWeekRankingTraining`, `lastRankingUpdateTraining`
- Match Summary: `lastWeekRanking`, `lastRankingUpdate`

---

## 🔄 Migration Notes

- No data migration needed
- Fix is backward compatible
- Existing localStorage data remains valid
- First update after fix deployment will use new logic

---

## ✅ Verification Steps

1. Open Training page on Monday → Arrows should update
2. Save a training session on Tuesday → Arrows should NOT change
3. Save another session on Wednesday → Arrows should NOT change
4. Wait until next Monday → Arrows should update again

---

## 📚 Related Documentation

- V9.17_TRAINING_ARROWS_ITALIANO.md - Original arrows feature
- V9.16_IMPLEMENTATION_SUMMARY.md - Match summary arrows
- V9.25_FIX_FRECCE_SETTIMANALI_ITALIANO.md - This fix (Italian)
- test_weekly_arrow_fix.html - Test suite

---

## 🔧 Technical Details

### Functions Modified:
1. `loadAllenamentiReport()` - Training report arrows
2. `loadAttendance()` - Match summary arrows

### Key Changes:
- Added `getMondayOfWeek()` helper function
- Changed from day comparison to week start comparison
- Ensures updates only happen once per week

### Impact:
- **Performance:** No change (same number of localStorage operations)
- **Behavior:** Fixed - now matches original requirement
- **Compatibility:** 100% backward compatible

---

## 🎉 Result

**Requirement Met:** ✅  
"Le frecce NON devono cambiare ogni volta che viene salvata una sessione di allenamento, ma solo in base al confronto settimanale."

**Status:** RESOLVED ✅  
**Version:** V9.25  
**Date:** January 2025
