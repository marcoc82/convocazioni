# Visual Guide - New Girone and Giornata Modal

## Distinta Creation Flow

### Before (Old Flow)
1. Click "Genera Distinta"
2. **Modal 1:** Select location (Casa/Trasferta)
3. **Modal 2:** Select dirigenti
4. Distinta generated with empty Girone/Giornata fields (contenteditable)
5. User manually types values after generation

### After (New Flow) ✨
1. Click "Genera Distinta"
2. **Modal 1:** Select location (Casa/Trasferta)
3. **Modal 2:** Select dirigenti
4. **Modal 3:** 🆕 **NEW - Enter Girone and Giornata**
   - Girone: Dropdown with options A, B, C, D, E, F, G
   - Giornata: Numeric input (1-99)
   - Validation: At least one field required
5. Distinta generated with values pre-populated

## New Modal Structure

```
┌─────────────────────────────────────────┐
│     Informazioni Partita                │
├─────────────────────────────────────────┤
│  Inserisci il girone e il numero        │
│  della giornata:                         │
│                                          │
│  Girone:                                 │
│  ┌──────────────────────────────┐       │
│  │ Seleziona girone...        ▼ │       │
│  └──────────────────────────────┘       │
│    Options: A, B, C, D, E, F, G         │
│                                          │
│  Numero della Giornata:                 │
│  ┌──────────────────────────────┐       │
│  │ Es: 1                         │       │
│  └──────────────────────────────┘       │
│    Type: number (min: 1, max: 99)       │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │ Conferma │  │ Annulla  │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

## Modal Styling
- Full-screen overlay with semi-transparent background
- Centered modal with white background
- Rounded corners (rounded-xl)
- Drop shadow (shadow-2xl)
- Responsive width (max-w-md)
- Smooth animations (transition-opacity duration-300)

## Form Elements

### Girone Dropdown
- HTML: `<select>` with 8 options (empty + A-G)
- Styling: Tailwind classes with focus ring
- Validation: Optional (can be empty)

### Giornata Input
- HTML: `<input type="number">`
- Constraints: min="1", max="99"
- Placeholder: "Es: 1"
- Validation: Optional (can be empty)

### Buttons
- **Conferma** (Green): Validates and proceeds to generate distinta
- **Annulla** (Gray): Closes modal without saving

## Validation Logic

```javascript
function confirmMatchInfo() {
    selectedGirone = distintaGironeSelect.value;
    selectedGiornata = distintaGiornataInput.value;
    
    // At least one field must be filled
    if (!selectedGirone && !selectedGiornata) {
        alert('Inserisci almeno il girone o il numero della giornata.');
        return;
    }
    
    // Proceed to generate distinta
    hideDistintaMatchInfoModal();
    generateDistinta();
}
```

## Distinta Output Examples

### Example 1: Both fields filled
```
Data: SABATO 20 gennaio 2024
Orario: 15:00
Campo: Campo Sportivo
Categoria: Juniores
Girone: B
Giornata: 5
```

### Example 2: Only Girone filled
```
Data: SABATO 20 gennaio 2024
Orario: 15:00
Campo: Campo Sportivo
Categoria: Juniores
Girone: C
Giornata: _____
```

### Example 3: Only Giornata filled
```
Data: SABATO 20 gennaio 2024
Orario: 15:00
Campo: Campo Sportivo
Categoria: Juniores
Girone: _____
Giornata: 12
```

## Technical Details

### State Variables
```javascript
let selectedGirone = '';    // Selected girone value (A-G or empty)
let selectedGiornata = '';  // Selected giornata number (1-99 or empty)
```

### Modal Functions
```javascript
showDistintaMatchInfoModal()    // Show the modal
hideDistintaMatchInfoModal()    // Hide the modal
confirmMatchInfo()              // Validate and proceed
```

### Event Listeners
```javascript
confirmMatchInfoButton.addEventListener('click', confirmMatchInfo);
closeDistintaMatchInfoModalButton.addEventListener('click', hideDistintaMatchInfoModal);
```

## User Experience Improvements

1. **Guided Input**: Users are prompted for all necessary information
2. **Validation**: Ensures at least one field is filled
3. **Clear Options**: Dropdown makes it easy to select the correct girone
4. **Type Safety**: Numeric input ensures giornata is a valid number
5. **Flexibility**: Both fields are optional, accommodating different scenarios
6. **Visual Feedback**: Empty fields show underscores in the distinta for manual completion

## Backward Compatibility

- ✅ Existing distinta generation still works
- ✅ No breaking changes to other features
- ✅ Modal can be cancelled without affecting the flow
- ✅ Empty fields are handled gracefully with underscores
