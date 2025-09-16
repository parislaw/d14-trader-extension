# D14 Trader Extension - Prop Trading Discipline Tracker

A Chrome extension designed to help proprietary trading firm candidates maintain discipline and avoid rule violations during the critical 14-day evaluation period.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Purpose

Prop firm traders face a high-stakes 14-day evaluation period where a single rule violation can result in account termination. This extension provides the psychological reinforcement and systematic tracking needed to maintain consistent discipline during high-stress trading periods.

## ✨ Key Features

### 📅 14-Day Streak Tracker
- **Visual calendar grid** showing daily progress
- **Current streak counter** with prominent display
- **Longest streak tracking** for motivation
- **Three states per day**: incomplete, completed, violated

### ✅ Daily Check-ins
- Simple binary choice: "Followed Rules" or "Violated Rules"
- **Mandatory violation logging** for accountability
- Progress tracking with visual feedback

### 📋 Personal Rules Management
- Add custom trading rules specific to your strategy
- Edit and delete rules as needed
- Pre-built templates for common trading scenarios

### 🎯 Daily Habits Tracker
- Track discipline-building habits beyond trading
- Automatic daily reset at market close (4 PM EST)
- Visual completion indicators

## 🚀 Installation

### From Chrome Web Store
*Coming Soon - Extension under review*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `prop-trader-extension14days/` directory
5. The extension icon will appear in your Chrome toolbar

## 🖥️ How to Use

1. **Click the extension icon** in your Chrome toolbar
2. **Set up your trading rules** in the Rules tab
3. **Add daily habits** you want to track in the Habits tab
4. **Complete daily check-ins** on the Dashboard tab
5. **Track your progress** with the 14-day visual calendar

## 🛠️ Technical Details

- **Manifest V3** Chrome extension (future-proof)
- **Vanilla JavaScript** - no external dependencies
- **Chrome Storage API** for data persistence with sync capability
- **Service Worker** for background daily habit resets
- **Offline functionality** - works without internet connection

## 📁 Project Structure

```
prop-trader-extension14days/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI interface
├── popup.js              # Core application logic
├── styles.css            # Dark theme styling
├── background.js         # Service worker for daily resets
└── icons/               # Extension icons
```

## 🎨 Features in Detail

### Streak System
- **Visual Progress**: 14-day calendar grid with color-coded status
- **Streak Logic**: Tracks consecutive days of rule compliance
- **Reset Protection**: Clear violation logging prevents accidental resets

### Rules Management
- **Custom Rules**: Add rules specific to your trading strategy
- **Rule Templates**: Pre-built rules for common scenarios
- **CRUD Operations**: Full create, read, update, delete functionality

### Habits Tracking
- **Daily Habits**: Track discipline-building activities
- **Automatic Reset**: Habits reset daily at 4 PM EST (market close)
- **Visual Feedback**: Immediate completion indicators

## 🔒 Privacy & Security

- **Local Storage**: All data stored locally in Chrome
- **No External Servers**: No data sent to external services
- **Optional Sync**: Chrome sync available for multi-device use
- **Minimal Permissions**: Only requires storage and alarms permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Target Metrics

- **Primary Goal**: Increase 14-day streak completion rate by 40%
- **Secondary Goal**: Reduce rule violations by 60% after first week of use
- **Engagement**: 80% daily active usage during evaluation periods

## 🔗 Links

- [Project Repository](https://github.com/parislaw/d14-trader-extension)
- [Privacy Policy](PRIVACY_POLICY.md)
- [Chrome Store Submission Guide](CHROME_STORE_SUBMISSION_GUIDE.md)

---

**Disclaimer**: This extension is designed to help with discipline and habit tracking. It does not provide trading advice or guarantee success in prop firm evaluations. Always follow your prop firm's specific rules and guidelines.