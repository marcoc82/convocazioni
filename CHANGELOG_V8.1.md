# CHANGELOG V8.1

## 📋 Problem Statement (Italian)

Aggiungi il tasto per il grafico anche su "Riepilogo Presenze Tornei". Il tasto deve aprire una schermata/modal con un grafico che mostra, per ogni giocatore:
- Nome giocatore
- Numero di tornei
- Numero di presenze ai tornei
- % disponibilità ai tornei

Il grafico deve essere leggibile sia da desktop che da mobile. Aggiorna la versione (V8.1) e i commenti/log.

---

## 🎯 Requirements Summary

### 1. Chart Button for Tornei Section
- **Location**: Next to "🏆 Riepilogo Presenze Tornei" header
- **Icon**: Same chart icon as "Riepilogo Totale" section
- **Visibility**: Only shown for POLIS company
- **Tooltip**: "Visualizza grafico statistiche tornei"

### 2. Tornei Statistics Chart Modal (POLIS Only)
- **Trigger**: Clickable chart icon next to "Riepilogo Presenze Tornei" header
- **Visibility**: Only shown for POLIS company
- **Content**:
  - Interactive bar chart with dual Y-axes showing top 15 players
  - Data table with detailed statistics:
    - Nome giocatore (Player name)
    - Tornei Totali (Total tournaments)
    - Presenze (Presences at tournaments)
    - % Disponibilità (Availability percentage)
- **Chart Configuration**:
  - Left Y-axis: Presenze (presences count)
  - Right Y-axis: % Disponibilità (availability percentage 0-100%)
  - Yellow bars for presences
  - Green bars for availability percentage
- **Responsiveness**: 
  - Desktop: Aspect ratio 2:1, larger fonts
  - Mobile: Aspect ratio 1:1, smaller fonts, rotated labels

### 3. Version Update
- Update to V8.1 in manifest.json
- Update version comment in index.html (line 2)
- Update visible version in index.html (line 239)

---

## ✅ Implementation Details

### 1. Tornei Chart Icon Button

**Files Modified**: `index.html` (line ~702-711)

**Changes**:
- Wrapped "🏆 Riepilogo Presenze Tornei" header in a flex container with gap
- Added chart icon button with same styling as main stats button
- Button initially hidden, shown only for POLIS company via JavaScript
- Title tooltip: "Visualizza grafico statistiche tornei"

**Code**:
```html
<div class="flex items-center gap-2 mb-3">
    <h3 id="tornei-header" class="text-lg font-semibold text-gray-700">🏆 Riepilogo Presenze Tornei</h3>
    <button id="tornei-stats-chart-button" class="hidden text-blue-600 hover:text-blue-800 transition-colors" title="Visualizza grafico statistiche tornei">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    </button>
</div>
```

### 2. Tornei Statistics Chart Modal

**Files Modified**: `index.html` (line ~1148-1189)

**Added**:
- New modal structure `tornei-stats-chart-modal`
- Separate canvas element: `tornei-stats-chart-canvas`
- Dedicated table body: `tornei-stats-table-body`
- Close button: `close-tornei-stats-chart-modal`

**Code**:
```html
<!-- V8.1: Tornei Stats Chart Modal -->
<div id="tornei-stats-chart-modal" class="fixed inset-0 hidden modal flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out opacity-0 z-50">
    <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">🏆 Statistiche Tornei</h2>
            <button id="close-tornei-stats-chart-modal" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <!-- Chart Container -->
        <div class="bg-gray-50 p-4 rounded-lg">
            <canvas id="tornei-stats-chart-canvas" class="w-full"></canvas>
        </div>
        
        <!-- Legend/Table -->
        <div class="mt-6 overflow-x-auto">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Dettaglio Statistiche Tornei</h3>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giocatore</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tornei Totali</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Presenze</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Disp.</th>
                    </tr>
                </thead>
                <tbody id="tornei-stats-table-body" class="bg-white divide-y divide-gray-200">
                    <!-- Tornei stats data will be populated here -->
                </tbody>
            </table>
        </div>
    </div>
</div>
```

### 3. JavaScript References

**Files Modified**: `index.html` (line ~1735-1739)

**Added**:
```javascript
// V8.1: Tornei Stats Chart Modal Elements
const torneiStatsChartModal = document.getElementById('tornei-stats-chart-modal');
const torneiStatsChartButton = document.getElementById('tornei-stats-chart-button');
const closeTorneiStatsChartModalButton = document.getElementById('close-tornei-stats-chart-modal');
```

### 4. Event Listeners

**Files Modified**: `index.html` (line ~7251-7254)

**Added**:
```javascript
// V8.1: Tornei Stats Chart Modal Event Listeners
torneiStatsChartButton.addEventListener('click', showTorneiStatsChartModal);
closeTorneiStatsChartModalButton.addEventListener('click', hideTorneiStatsChartModal);
```

### 5. Modal Functions

**Files Modified**: `index.html` (line ~5584-5763)

**Function**: `showTorneiStatsChartModal()`
- Removes hidden and opacity-0 classes from modal
- Adds flex and opacity-100 classes to show modal
- Calls `generateTorneiStatsChart()` to populate data

**Function**: `hideTorneiStatsChartModal()`
- Removes flex and opacity-100 classes
- Adds hidden and opacity-0 classes
- Destroys Chart.js instance to prevent memory leaks

**Code**:
```javascript
// V8.1: Tornei Stats Chart Modal Functions
function showTorneiStatsChartModal() {
    torneiStatsChartModal.classList.remove('hidden', 'opacity-0');
    torneiStatsChartModal.classList.add('flex', 'opacity-100');
    generateTorneiStatsChart();
}

function hideTorneiStatsChartModal() {
    torneiStatsChartModal.classList.remove('flex', 'opacity-100');
    torneiStatsChartModal.classList.add('hidden', 'opacity-0');
    // Destroy chart instance if it exists
    if (window.torneiStatsChart) {
        window.torneiStatsChart.destroy();
        window.torneiStatsChart = null;
    }
}
```

### 6. Chart Generation Function

**Files Modified**: `index.html` (after line ~5602)

**Function**: `generateTorneiStatsChart()`

**Logic**:
1. Checks if company is POLIS (returns early if not)
2. Counts total tournaments from `convocationHistory` filtered by type 'Torneo'
3. Reads data from tornei attendance table (`#attendance-list-tornei`)
4. Extracts player statistics:
   - Player name
   - Total tournaments
   - Presences at tournaments
   - Availability percentage
5. Sorts players by presences (descending)
6. Limits to top 15 players for readability
7. Populates data table in modal
8. Creates responsive Chart.js bar chart with dual Y-axes

**Chart Configuration**:
```javascript
window.torneiStatsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Presenze ai Tornei',
                data: presencesData,
                backgroundColor: 'rgba(234, 179, 8, 0.6)',  // Yellow
                borderColor: 'rgba(234, 179, 8, 1)',
                borderWidth: 2,
                yAxisID: 'y-presences'
            },
            {
                label: '% Disponibilità',
                data: availabilityData,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',  // Green
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                yAxisID: 'y-percentage'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: window.innerWidth < 640 ? 1 : 2,
        scales: {
            'y-presences': {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Presenze'
                }
            },
            'y-percentage': {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: '% Disponibilità'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }
});
```

### 7. Button Visibility Toggle

**Files Modified**: `index.html` (line ~3057-3067)

**Added**:
```javascript
// V8.1: Show Tornei stats chart button only for POLIS company
const torneiStatsButton = document.getElementById('tornei-stats-chart-button');
if (torneiStatsButton) {
    if (isPolisCompany) {
        torneiStatsButton.classList.remove('hidden');
    } else {
        torneiStatsButton.classList.add('hidden');
    }
}
```

### 8. Version Updates

**Files Modified**:

1. **index.html** (line 2):
   ```html
   <!-- Version: V8.1 - Add statistics chart button for Tornei section, includes V8.0 features (player count and stats chart for Riepilogo Totale) -->
   ```

2. **index.html** (line 239):
   ```html
   <span class="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">V 8.1</span>
   ```

3. **manifest.json** (line 4):
   ```json
   "version": "V8.1",
   ```

---

## 🔧 Technical Notes

### Chart.js Configuration
- **Version**: 4.4.1 (already included from V8.0)
- **Chart Type**: Bar chart with dual Y-axes
- **Datasets**: 2 (Presenze and Disponibilità)
- **Instance Management**: Destroyed on modal close to prevent memory leaks
- **Global Variable**: `window.torneiStatsChart`

### Responsive Breakpoint
- **Threshold**: 640px (Tailwind's `sm` breakpoint)
- **Detection**: `window.innerWidth < 640`
- **Applied to**: Chart aspect ratio, fonts, label rotation

### Data Source
- Tournament count: Filtered from `convocationHistory` where `tipo === 'Torneo'`
- Player statistics: Read from `#attendance-list-tornei` DOM table
- Availability data: Already fetched and populated in table (V7.9 feature)
- No additional Firebase queries needed

### Company Detection
- Uses same logic as V8.0: `companyName === 'POLIS'`
- Consistent with availability column visibility (V7.9)
- Button visibility toggled in `loadAttendance()` function

### Chart Colors
- **Yellow** (rgba(234, 179, 8, 0.6)): Presenze ai Tornei
- **Green** (rgba(34, 197, 94, 0.6)): % Disponibilità
- Different from main stats chart to distinguish tournament data

### Dual Y-Axes
- **Left axis**: Presences count (0 to max presences)
- **Right axis**: Percentage (0-100%)
- This allows proper visualization of two different scales

---

## 🧪 Testing Checklist

### Button Display
- [ ] Tornei chart button hidden on login screen
- [ ] Tornei chart button hidden for non-POLIS companies
- [ ] Tornei chart button visible for POLIS company
- [ ] Button appears next to "🏆 Riepilogo Presenze Tornei" header
- [ ] Button has same styling as main stats chart button
- [ ] Hover effect works correctly
- [ ] Tooltip appears on hover

### Modal Functionality
- [ ] Modal opens when Tornei chart button clicked
- [ ] Modal closes when X button clicked
- [ ] Modal closes when clicking outside modal area
- [ ] Modal has proper z-index layering
- [ ] Modal animations work smoothly
- [ ] Modal scrolls properly on small screens

### Chart Rendering
- [ ] Chart.js loads successfully (already loaded from V8.0)
- [ ] Bar chart displays correctly
- [ ] Yellow bars show Presenze count
- [ ] Green bars show % Disponibilità
- [ ] Left Y-axis shows presences scale
- [ ] Right Y-axis shows 0-100% range
- [ ] X-axis shows player names (truncated if > 20 chars)
- [ ] Legend shows both datasets
- [ ] Title displays "Statistiche Tornei - Top 15"

### Data Table in Modal
- [ ] Table shows all required columns
- [ ] Data matches the tornei attendance table
- [ ] "N/D" displayed correctly for missing availability data
- [ ] Percentages include % symbol (except N/D)
- [ ] Players sorted by presences (descending)
- [ ] Only top 15 players shown

### Data Accuracy
- [ ] Total tournaments count correct
- [ ] Presences count matches tornei table
- [ ] Availability percentages match tornei table
- [ ] Player names match exactly

### Responsive Design
- [ ] Desktop: Chart aspect ratio 2:1
- [ ] Mobile: Chart aspect ratio 1:1
- [ ] Desktop: Font sizes are readable
- [ ] Mobile: Font sizes are smaller but still readable
- [ ] Mobile: X-axis labels rotated appropriately
- [ ] Table scrolls horizontally on small screens
- [ ] Modal fits within viewport on all sizes

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile browsers

### Version Updates
- [ ] Version V 8.1 visible on login screen
- [ ] manifest.json shows V8.1
- [ ] HTML comment shows V8.1

### Memory Management
- [ ] Chart instance destroyed on modal close
- [ ] No memory leaks when opening/closing multiple times
- [ ] No console errors

---

## 📊 Files Modified Summary

| File | Lines Changed | Description |
|------|---------------|-------------|
| index.html | ~200 lines added | Added Tornei chart button, modal, functions, and event listeners |
| manifest.json | 1 line | Version update to V8.1 |
| CHANGELOG_V8.1.md | New file | This comprehensive changelog |

**Total**: 2 files modified, 1 file created, ~201 lines added

---

## 🔄 Related Features

This feature builds upon:
- **V7.9**: Tornei availability data from Firebase
- **V8.0**: Stats chart modal for Riepilogo Totale
- Chart.js integration already in place

---

## 📝 Notes

- The Tornei chart uses a different color scheme (yellow/green) than the main stats chart (blue/green) to visually distinguish tournament data from overall statistics
- The chart uses dual Y-axes because presences and percentages have different scales
- Only top 15 players are shown to maintain chart readability
- The feature is POLIS-specific as tournament availability tracking is only available for POLIS company
- No additional Firebase queries are needed; data is read from the DOM table already populated by V7.9 functionality

---

## ✅ Requirements Verification

### ✅ Requirement 1: Chart Button on Tornei Section
**Requisito:** Aggiungi il tasto per il grafico anche su "Riepilogo Presenze Tornei".

**Implementation:**
- ✅ Button added next to "🏆 Riepilogo Presenze Tornei" header
- ✅ Same chart icon as main stats button
- ✅ Only visible for POLIS company
- ✅ Clickable and functional

### ✅ Requirement 2: Chart Data Display
**Requisito:** Il tasto deve aprire una schermata/modal con un grafico che mostra, per ogni giocatore:
- Nome giocatore
- Numero di tornei
- Numero di presenze ai tornei
- % disponibilità ai tornei

**Implementation:**
- ✅ Modal opens on button click
- ✅ Shows player name (Nome giocatore)
- ✅ Shows total tournaments (Numero di tornei)
- ✅ Shows presences at tournaments (Numero di presenze ai tornei)
- ✅ Shows availability percentage (% disponibilità ai tornei)
- ✅ Data displayed in both chart and table format

### ✅ Requirement 3: Responsive Design
**Requisito:** Il grafico deve essere leggibile sia da desktop che da mobile.

**Implementation:**
- ✅ Desktop: 2:1 aspect ratio, larger fonts
- ✅ Mobile: 1:1 aspect ratio, smaller fonts, rotated labels
- ✅ Chart adapts to screen size
- ✅ Table scrolls horizontally on small screens

### ✅ Requirement 4: Version Updates
**Requisito:** Aggiorna la versione (V8.1) e i commenti/log.

**Implementation:**
- ✅ Version comment updated to V8.1 (line 2)
- ✅ Visible version updated to V 8.1 (line 239)
- ✅ manifest.json version updated to V8.1
- ✅ CHANGELOG_V8.1.md created
- ✅ V8.0 and previous features preserved

---

## 🎉 Conclusion

V8.1 successfully extends the statistics chart feature to the Tornei section, providing POLIS company users with detailed visual insights into tournament participation and availability. The implementation maintains consistency with the existing V8.0 chart while adapting the data structure to tournament-specific metrics.
