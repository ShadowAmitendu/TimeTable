# BCA 6th Semester Timetable

A responsive, interactive timetable web application for BCA 6th Semester students at Techno College Hooghly.

## Features

- 📅 View timetable for both Alpha (α) and Beta (β) sections
- 🔄 Smart merge - identical classes show as single cell in "Both" view
- 🔍 Filter classes by faculty member
- 🔴 Live indicator for current ongoing class (auto-updates every 30s)
- 🖨️ Print-optimized layout for A4 landscape
- 📱 Mobile-responsive design
- 💾 Section preference saved to localStorage

---

## Quick Start

### Option 1: GitHub Pages (Recommended)

1. Push code to GitHub repository
2. Go to **Settings → Pages**
3. Select **Deploy from branch** → `main` → `/ (root)`
4. Access at `https://yourusername.github.io/repository-name`

### Option 2: Local Development Server

ES modules require a web server. Choose one:

```bash
# Node.js (npx - no install needed)
npx serve

# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000` (or the port shown).

### Option 3: Open Directly (file://)

Simply double-click `index.html`. The inline fallback script handles functionality.

> **Note**: ES modules won't load over `file://` protocol. The `<script nomodule>` fallback provides full functionality.

---

## Setup Guide

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/TimeTable.git
cd TimeTable
```

### 2. Update Schedule Data

Edit `data/schedule.json` to update class schedules:

```json
{
  "alpha": {
    "2": [
      { "prof": "DB", "subject": "BCAC601" },
      { "prof": "AP", "subject": "BCAC602", "lab": "LAB 1" },
      "BREAK",
      "EMPTY"
    ]
  },
  "beta": { ... }
}
```

**Day indices:** 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

**Cell types:**
- `{ "prof": "XX", "subject": "CODE" }` - Regular class
- `{ "prof": "XX", "subject": "CODE", "lab": "LAB 1" }` - Lab class
- `"BREAK"` - Break period
- `"EMPTY"` - No class

### 3. Update Configuration

Edit `data/config.js` to customize:

```javascript
export const CONFIG = {
    college: "Your College Name",
    course: "BCA",
    semester: 6,
    room: "201",
    routineDate: "2nd February 2026"
};
```

### 4. Update Faculty List

Edit `data/faculty.js` to update faculty filter buttons:

```javascript
export const FACULTY = [
    { id: 'DB', name: 'DB' },
    { id: 'AP', name: 'AP' },
    // Add more faculty...
];
```

Also update the HTML faculty buttons in `index.html`.

### 5. Deploy

- **GitHub Pages**: Push to main branch, enable Pages in settings
- **Custom hosting**: Upload all files to your web server

---

## Project Structure

```
TimeTable/
├── index.html              # Main HTML (ES module + fallback script)
├── main.js                 # Application entry point
├── README.md               # This file
│
├── assets/                 # Static assets (images, icons)
│
├── styles/                 # CSS organized by concern
│   ├── base.css           # Variables, reset, typography
│   ├── layout.css         # Header, table, grid layouts
│   ├── components.css     # Buttons, pills, dropdowns
│   └── print.css          # Print-specific styles
│
├── core/                   # Framework-agnostic modules
│   ├── constants.js       # CELL_TYPE, SECTION, DAY_INDEX
│   ├── state.js           # Central state management
│   └── utils.js           # DOM utilities ($, $$, createElement)
│
├── data/                   # Data and configuration
│   ├── config.js          # App config (college, course, etc.)
│   ├── schedule.json      # Schedule data (loaded via fetch)
│   ├── timeSlots.js       # Time slot definitions
│   └── faculty.js         # Faculty list
│
└── features/               # Feature modules
    ├── renderer/          # UI rendering
    │   ├── header.js      # Header rendering
    │   ├── table.js       # Timetable rendering
    │   ├── cell.js        # Cell factory functions
    │   └── modal.js       # Section selection modal
    │
    ├── filters/           # Filtering features
    │   └── facultyFilter.js
    │
    ├── time/              # Time-related features
    │   └── currentClass.js
    │
    └── print/             # Print features
        └── printMode.js
```

---

## Architecture

### Module System

- **ES Modules** for modern browsers (served via HTTP/HTTPS)
- **Inline fallback** (`<script nomodule>`) for `file://` protocol

### State Management

Simple reactive pattern in `core/state.js`:
- Central state object
- Subscribe/notify for changes
- Immutable state copies via `getState()`

### Data Flow

```
User Action → State Update → Notify Listeners → Re-render
```

1. User selects section in modal
2. `setSection()` updates state
3. Listeners notified
4. `renderSchedule()` rebuilds table

### Smart Merge (Both View)

When viewing both sections:
- **Same class** → Single merged cell
- **Different classes** → Split cell with α/β labels
- **One empty** → Split cell showing "No Class"
- **Both empty** → Shows `---`

---

## Customization

### Change Time Slots

Edit `data/timeSlots.js`:

```javascript
export const TIME_SLOTS = [
    { start: "09:00", end: "09:50", displayStart: "09:00 AM", displayEnd: "09:50 AM" },
    // ...
];
```

Also update the `<thead>` in `index.html` with matching `data-start`/`data-end` attributes.

### Change Colors

Edit CSS variables in `styles/base.css`:

```css
:root {
    --deep-charcoal: #1e293b;
    --accent-orange: #f97316;
    --border-color: #e2e8f0;
    /* ... */
}
```

### Add/Remove Days

Currently shows Tuesday-Saturday. To modify:
1. Update `data/schedule.json` with new day indices
2. Modify `createSundayRow()` / `createMondayRow()` in `features/renderer/table.js`

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 80+     |
| Firefox | 75+     |
| Safari  | 13+     |
| Edge    | 80+     |

---

## License

MIT License - Feel free to use and modify for your own institution.
