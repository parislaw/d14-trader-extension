# Chrome Web Store Privacy Practices - D14 Trader Extension

## Required Chrome Web Store Privacy Tab Information

### Single Purpose Description
**Primary Purpose**: Help proprietary trading firm candidates maintain discipline during their critical 14-day evaluation period through streak tracking, rules management, and daily habit monitoring.

**Detailed Single Purpose Statement**:
This extension serves one primary purpose: to help prop trading firm candidates track and maintain their trading discipline during evaluation periods. It provides tools for monitoring daily compliance with personal trading rules, tracking progress through a 14-day streak system, and maintaining daily pre/post-market habits. All features are designed specifically to support traders during their prop firm evaluation process.

---

## Permission Justifications

### 1. STORAGE Permission
**Justification**: Required to save user's personal trading rules, daily habit tracking data, streak progress information, and extension settings locally on the user's device.

**Specific Use Cases**:
- Store personal trading rules created by the user
- Save daily habit completion status
- Track 14-day streak progress and violation history
- Persist user preferences and settings
- All data is stored locally using Chrome's storage API - no external transmission

**Data Collected**: Trading rules text, habit descriptions, completion status, streak counters, check-in dates
**Data Retention**: Data persists until user uninstalls extension or manually clears it
**Data Sharing**: No data is shared externally - all storage is local only

### 2. ALARMS Permission
**Justification**: Required to automatically reset daily habit completion status at market close (4:00 PM EST) each trading day.

**Specific Use Cases**:
- Schedule daily reset of habit checkboxes at 4:00 PM EST (market close)
- Ensure habits reset automatically without user intervention
- Maintain accurate daily tracking aligned with trading schedule

**Data Collected**: No personal data collected - only system timing events
**Functionality**: Creates recurring alarm to trigger habit reset function
**User Benefit**: Automatic daily habit reset eliminates manual task and ensures accurate tracking

### 3. TABS Permission
**Justification**: Required solely to open affiliate partner links (prop firms, trading tools, educational resources) in new browser tabs when user chooses to access recommended trading resources.

**Specific Use Cases**:
- Open affiliate links to recommended prop firms (Aqua Futures, Alpha Futures)
- Open links to trading education resources (Pack Trading Bootcamp)
- Allow users to access recommended trading tools and services
- All links open in new tabs only when user explicitly clicks on them

**Data Collected**: No browsing data, tab content, or personal information is accessed or collected
**Limitation**: Extension does NOT read, access, or monitor any tab content or browsing activity
**User Control**: Links only open when user explicitly clicks on resource recommendations

### 4. Remote Code Justification
**Statement**: This extension does NOT use remote code.

**Justification**:
- Extension contains only local JavaScript, HTML, and CSS files
- No external scripts are loaded or executed
- All code is contained within the extension package
- Content Security Policy explicitly prevents external code execution
- No API calls to external services for code execution

---

## Data Usage Compliance Certification

### Chrome Web Store User Data Policy Compliance
**Certification Statement**:
The D14 Trader Extension complies with Chrome Web Store Developer Program Policies. Specifically:

1. **Minimal Data Collection**: Only collects data necessary for core functionality
2. **Local Storage Only**: No data transmitted to external servers
3. **User Control**: Users maintain complete control over their data
4. **Transparent Usage**: All data usage clearly described in privacy policy
5. **Limited Use Compliance**: The use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements

### Data Handling Practices
- **Storage**: All data stored locally using Chrome storage API
- **Transmission**: No data transmitted externally
- **Encryption**: Data secured by Chrome's built-in storage encryption
- **Access**: Only extension can access stored data
- **Deletion**: All data deleted when extension is uninstalled

### User Privacy Protection
- No personal identifying information collected
- No browsing history accessed or monitored
- No external analytics or tracking
- No data sharing with third parties
- Complete offline functionality

---

## Contact Information
**Developer Contact Email**: [Your Contact Email Here]
**Support**: GitHub repository issues - https://github.com/parislaw/d14-trader-extension
**Privacy Questions**: Contact through GitHub repository

---

## Declaration Checklist for Chrome Web Store Submission

- ✅ **Single Purpose**: Clearly defined as prop trading discipline tracking
- ✅ **Storage Justification**: Local data persistence for user rules, habits, and progress
- ✅ **Alarms Justification**: Daily habit reset at market close (4 PM EST)
- ✅ **Tabs Justification**: Opening affiliate links in new tabs only
- ✅ **Remote Code**: Confirmed NO remote code usage
- ✅ **Data Compliance**: Certified compliance with Chrome Web Store policies
- ✅ **Privacy Policy**: Comprehensive policy created and available
- ✅ **Contact Email**: Developer contact information provided

---

## Additional Privacy Practices Information

### User Data Categories
- **Personal Information**: None collected
- **Financial Information**: None collected
- **Web History**: None accessed
- **User Activity**: Only local habit completion and rule compliance tracking
- **Location**: None accessed
- **Personally Identifiable Information**: None collected

### Data Usage Transparency
All data usage is:
- Clearly disclosed in extension description
- Limited to stated functionality
- Under complete user control
- Stored locally only
- Never transmitted externally

This extension prioritizes user privacy while providing essential tools for prop trading discipline and success.