# Changelog V6.1

## Version 6.1 - Edit Convocation Feature
**Date**: 2024

### New Features
- ✨ **Edit Convocation**: Added ability to modify existing convocations from history
  - New "Modifica" button (yellow) next to each convocation in history
  - Opens dedicated edit page with pre-filled form
  - All convocation fields can be modified
  - Players can be selected/deselected

### Authorization
- ✅ Only Mister and Dirigente roles can edit convocations
- ✅ Guest users cannot access edit functionality
- ✅ Authorization checked on both button visibility and edit page

### Validation
- ✅ All fields required: campo, avversario, data, orario convocazione, orario partita, tipo
- ✅ At least one player must be selected
- ✅ Client-side validation with clear error messages
- ✅ Form cannot be submitted unless all requirements met

### Technical Changes
- Added `edit_convocation.html` - standalone edit page
- Modified `index.html`:
  - Added "Modifica" button at line 2702
  - Added event listener at lines 2711-2723
  - Changed button container to use `flex-wrap`
- Updated `manifest.json` version to V6.1
- Uses Firestore `updateDoc()` for saving changes
- Adds `updatedAt` timestamp to modified convocations

### User Experience
- 📋 Form pre-filled with existing convocation data
- 🎯 Players from original convocation are pre-selected
- ✅ Success message after save
- ↩️ Automatic redirect back to history after successful save
- 📱 Responsive design works on mobile and desktop
- 🔄 Updated convocation immediately visible in history

### Files Changed
```
+ edit_convocation.html (new file, 400+ lines)
M index.html (2 modifications)
M manifest.json (version update)
```

## Migration Notes
No database schema changes required. The feature uses existing Firestore structure.

## Breaking Changes
None. This is a backward-compatible addition.
