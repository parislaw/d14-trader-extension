# Prop Trader Discipline Chrome Extension

A Chrome extension designed to help proprietary trading firm candidates maintain discipline during their critical 14-day evaluation period.

## Features

- **14-Day Streak Counter**: Visual calendar tracking your daily progress
- **Daily Check-ins**: Binary system for rule adherence accountability  
- **Violation Logging**: Mandatory reflection when rules are broken
- **Rules Management**: Create and manage your personal trading rules
- **Habits Tracking**: Daily pre/post-market routine checklist
- **Data Persistence**: Syncs across devices via Chrome Storage

## Installation

### For Development/Testing:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select this project folder
4. The extension icon should appear in your Chrome toolbar

### For Production Use:

Extension will be available on the Chrome Web Store once published.

## How to Use

1. **First Time Setup**: Click the extension icon to open the popup
2. **Add Your Rules**: Go to the Rules tab and add your core trading principles
3. **Daily Routine**: 
   - Check off your daily habits in the Habits tab
   - At end of trading day, use the Daily Check-in on Dashboard
   - If you violated rules, log the reason for learning
4. **Track Progress**: Watch your streak build in the 14-day calendar

## Technical Details

- **Platform**: Chrome Extension (Manifest V3)
- **Storage**: Chrome Storage API with sync capabilities
- **Framework**: Vanilla JavaScript (no dependencies)
- **Permissions**: Storage only (minimal privacy impact)

## File Structure

```
prop-trader-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI interface
├── popup.js              # Core application logic
├── styles.css            # Dark theme styling
├── background.js         # Service worker for daily resets
├── icons/                # Extension icons (placeholder)
└── README.md            # This file
```

## Development Notes

The extension uses Chrome's Manifest V3 architecture with a service worker for background tasks like daily habit resets at market close (4 PM EST).

All user data is stored locally and optionally synced across devices via Chrome's built-in sync storage, ensuring privacy while providing convenience.

## Future Enhancements

- Templates system for quick rule/habit setup
- Analytics dashboard for pattern recognition
- Notification system for check-in reminders
- Integration with popular trading journals

## Support

This extension is specifically designed for prop firm evaluation periods but can be used by any trader looking to build consistent discipline habits.