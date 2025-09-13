# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension designed to help proprietary trading firm candidates maintain discipline during their critical 14-day evaluation period. The extension provides streak tracking, daily check-ins, rules management, and habit tracking functionality.

## Development Commands

### Testing the Extension
```bash
# Load extension in Chrome Developer Mode:
# 1. Open Chrome and navigate to chrome://extensions/
# 2. Enable "Developer mode" in top-right corner
# 3. Click "Load unpacked" and select the prop-trader-extension14days/ directory
# 4. Extension icon will appear in Chrome toolbar for testing
```

### No Build Process
This extension uses vanilla JavaScript with no build tools or dependencies. All development is done directly on the source files.

## Architecture Overview

### Core Structure
- **Manifest V3 Chrome Extension**: Modern Chrome extension architecture with service worker
- **Vanilla JavaScript**: No external dependencies or frameworks
- **Chrome Storage API**: Data persistence with cross-device sync capability
- **Tab-based Navigation**: Three main sections (Dashboard, Rules, Habits)

### Key Files and Components

#### Main Extension Files
- `prop-trader-extension14days/manifest.json` - Extension configuration and permissions
- `prop-trader-extension14days/popup.html` - Main UI interface with tab navigation
- `prop-trader-extension14days/popup.js` - Core application logic (PropTraderApp class)
- `prop-trader-extension14days/styles.css` - Dark theme styling
- `prop-trader-extension14days/background.js` - Service worker for daily habit resets

#### Application Architecture
The main application is structured as a single `PropTraderApp` class in `popup.js` that manages:

1. **Data Management**: Chrome Storage API integration for persistent data
2. **Tab Navigation**: Dashboard, Rules, and Habits sections
3. **Streak System**: 14-day calendar grid with visual progress tracking
4. **Daily Check-ins**: Binary rule compliance system with violation logging
5. **Rules Management**: CRUD operations for personal trading rules
6. **Habits Tracking**: Daily habit checklist with automatic reset

### Data Models

#### Streak Data Structure
```javascript
streakData: {
  currentStreak: number,
  longestStreak: number,
  streakDays: Array(14), // 'incomplete', 'completed', 'violated'
  lastCheckIn: date
}
```

#### Rules and Habits
```javascript
rules: [{
  id: string,
  text: string,
  createdDate: date
}]

habits: [{
  id: string,
  text: string,
  completed: boolean
}]
```

### Background Service Worker
The `background.js` service worker handles:
- **Daily Reset**: Automatically resets habit completion status at 4 PM EST (market close)
- **Chrome Alarms API**: Scheduled daily reset functionality
- **Extension Installation**: Default data structure initialization

### Key Features Implementation

#### 14-Day Streak Counter (`popup.js:26-31, 147-180`)
- Visual calendar grid showing daily progress
- Current and longest streak tracking
- Three states per day: incomplete, completed, violated

#### Daily Check-in System (`popup.js:234-280`)
- Binary choice: "Followed Rules" or "Violated Rules"
- Mandatory violation logging for accountability
- Streak progression logic based on check-in results

#### Rules Management (`popup.js:282-356`)
- Add new rules with validation
- Edit/delete existing rules
- Rule templates for common trading scenarios

#### Habits Tracking (`popup.js:358-410`)
- Daily habit checklist
- Completion tracking with visual feedback
- Automatic daily reset via background service worker

### UI/UX Design Patterns

#### Dark Theme
- Professional appearance matching trading platform aesthetics
- Custom CSS utility classes for consistent styling
- Dark background with green/red accent colors for success/failure states

#### Modal System
- Violation logging modal for detailed rule violation tracking
- Confirmation dialogs for destructive actions
- Progressive disclosure to reduce cognitive load

#### Navigation
- Three-tab interface: Dashboard, Rules, Habits
- Single-page application behavior with tab switching
- Context-aware UI elements based on current state

## Development Notes

### Chrome Extension Specifics
- Uses Manifest V3 architecture (future-proof)
- Minimal permissions: only "storage" required
- Service worker replaces background scripts from Manifest V2

### Data Persistence Strategy
- **Local-first**: All data stored locally by default
- **Chrome Sync**: Optional cross-device synchronization
- **Privacy-focused**: No external analytics or data collection

### Testing Approach
Manual testing through Chrome Developer Mode loading. Key test scenarios:
- Daily check-in flow completion
- Streak progression and reset logic
- Rules/habits CRUD operations
- Cross-device sync functionality
- Background service worker daily reset

### Code Style
- ES6+ JavaScript with modern syntax
- Class-based architecture for main app logic
- Async/await for Chrome API interactions
- Event-driven UI updates
- Minimal DOM manipulation for performance

## Production Deployment

### Chrome Web Store Preparation
1. Create proper PNG icons (16x16, 32x32, 48x48, 128x128) to replace placeholder icons
2. Test all functionality in Chrome Developer Mode
3. Package extension directory for Chrome Web Store submission
4. No additional build or compilation steps required

### Key Technical Requirements Met
- Manifest V3 compliance for Chrome Web Store
- Minimal permissions for user trust
- Offline functionality (no external dependencies)
- Cross-device sync capability
- Performance optimized (vanilla JavaScript, minimal memory footprint)