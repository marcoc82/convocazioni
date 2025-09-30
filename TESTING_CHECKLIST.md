# Testing Checklist for V6.2

## Pre-deployment Verification
- [x] Code changes reviewed and tested
- [x] Automated tests passed (all green)
- [x] Version updated in manifest.json (V6.2)
- [x] Changelog created (CHANGELOG_V6.2.md)
- [x] Documentation complete (FIX_SUMMARY.md, VISUAL_COMPARISON.md)
- [x] No build artifacts committed
- [x] No temporary files committed

## Post-deployment Testing

### Basic Functionality Tests

#### Test 1: Edit Convocation with Both Coaches
**Steps:**
1. Navigate to "Storico Convocazioni"
2. Find a convocation that has both mister assigned
3. Click the yellow "Modifica" button
4. Observe the edit form

**Expected Results:**
- ✅ Mister Partita dropdown shows the correct pre-selected coach
- ✅ Mister Tipo dropdown shows the correct pre-selected coach
- ✅ Both dropdowns are populated with all available coaches
- ✅ All previously selected players are highlighted in blue
- ✅ Selected count shows correct number (e.g., "Selezionati (3)")
- ✅ Selected players list shows all names

#### Test 2: Edit Convocation with One Coach
**Steps:**
1. Find a convocation with only one mister assigned
2. Click "Modifica"

**Expected Results:**
- ✅ The assigned mister dropdown shows the coach
- ✅ The unassigned mister dropdown shows "Seleziona mister"
- ✅ Players are pre-selected correctly

#### Test 3: Edit Convocation with No Coaches (N/D)
**Steps:**
1. Find a convocation with no coaches (mister = "N/D")
2. Click "Modifica"

**Expected Results:**
- ✅ Both mister dropdowns show "Seleziona mister"
- ✅ Dropdowns are still populated with available coaches
- ✅ Players are pre-selected correctly

#### Test 4: Modify and Save Changes
**Steps:**
1. Open any convocation for editing
2. Change the mister selection (select a different coach)
3. Deselect one player
4. Select a new player
5. Click "Salva Modifiche"
6. Wait for success message
7. Return to history and open the same convocation again

**Expected Results:**
- ✅ Success message appears: "Convocazione aggiornata con successo!"
- ✅ Automatic redirect back to history
- ✅ Re-opening shows the NEW coach selections (not old ones)
- ✅ Re-opening shows the NEW player selections (not old ones)
- ✅ All changes are persisted correctly

### Role-based Access Tests

#### Test 5: Mister Role
**Steps:**
1. Login as Mister
2. Try to edit a convocation

**Expected Results:**
- ✅ "Modifica" button is visible
- ✅ Edit page opens correctly
- ✅ Pre-selection works
- ✅ Save operation works

#### Test 6: Dirigente Role
**Steps:**
1. Login as Dirigente
2. Try to edit a convocation

**Expected Results:**
- ✅ "Modifica" button is visible
- ✅ Edit page opens correctly
- ✅ Pre-selection works
- ✅ Save operation works

#### Test 7: Guest Role (if applicable)
**Steps:**
1. Login as Guest
2. Check convocation history

**Expected Results:**
- ✅ "Modifica" button should NOT be visible
- ✅ Guest cannot access edit functionality

### Edge Cases

#### Test 8: Convocation with Many Players (10+)
**Steps:**
1. Edit a convocation with many players selected
2. Verify all are pre-selected

**Expected Results:**
- ✅ All players correctly pre-selected
- ✅ Scrolling works if needed
- ✅ Selected count is accurate

#### Test 9: Mobile Device Testing
**Steps:**
1. Open edit form on mobile device
2. Check responsive layout

**Expected Results:**
- ✅ Form is responsive and usable
- ✅ Dropdowns work on mobile
- ✅ Player grid adjusts to screen size
- ✅ Save button is accessible

#### Test 10: Browser Compatibility
**Steps:**
1. Test on Chrome
2. Test on Firefox
3. Test on Safari (if available)
4. Test on Edge (if available)

**Expected Results:**
- ✅ Pre-selection works on all browsers
- ✅ No console errors
- ✅ Form submits correctly

### Performance Tests

#### Test 11: Load Time
**Steps:**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Click "Modifica" on a convocation
4. Observe load time

**Expected Results:**
- ✅ Page loads in under 2 seconds
- ✅ No failed requests
- ✅ Firebase data loads correctly

#### Test 12: Console Errors
**Steps:**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Perform all edit operations

**Expected Results:**
- ✅ No JavaScript errors
- ✅ No Firebase errors
- ✅ Only expected log messages (if any)

### Data Integrity Tests

#### Test 13: Multiple Edits
**Steps:**
1. Edit same convocation 3 times
2. Make different changes each time
3. Verify only latest changes persist

**Expected Results:**
- ✅ Each edit overwrites previous
- ✅ No duplicate data
- ✅ updatedAt timestamp updates each time

#### Test 14: Cancel Operation
**Steps:**
1. Open convocation for editing
2. Make changes
3. Click "Annulla" (Cancel) button
4. Re-open the same convocation

**Expected Results:**
- ✅ Changes are NOT saved
- ✅ Original data remains unchanged
- ✅ Pre-selection shows original data

## Rollback Procedure

If any critical issues are found:

1. **Immediate Action:**
   ```bash
   git checkout V6.1
   ```

2. **Restore Files:**
   - Restore previous edit_convocation.html
   - Restore previous manifest.json

3. **Clear Cache:**
   - Users should hard refresh (Ctrl+Shift+R)

4. **Notify Users:**
   - Post announcement about temporary rollback
   - Communicate expected fix timeline

## Success Criteria

Fix is considered successful if:
- ✅ All basic functionality tests pass
- ✅ All role-based access tests pass
- ✅ All edge cases work correctly
- ✅ No console errors appear
- ✅ No data integrity issues
- ✅ User feedback is positive
- ✅ No rollback needed within 48 hours

## Monitoring Period

Monitor for **48 hours** after deployment:
- Check user feedback
- Monitor for bug reports
- Check Firebase logs for errors
- Verify no performance degradation

## Sign-off

After successful testing:
- [ ] All tests completed
- [ ] No critical issues found
- [ ] Users can edit convocations successfully
- [ ] Pre-selection working for coaches and players
- [ ] Data saves correctly
- [ ] Ready for production use

**Tested by:** _________________
**Date:** _________________
**Sign-off:** _________________
