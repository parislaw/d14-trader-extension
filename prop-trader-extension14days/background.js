// Background Service Worker for Prop Trader Discipline Extension

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Prop Trader Discipline Extension installed');

    // Set up default data structure
    const defaultData = {
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        streakDays: new Array(14).fill('incomplete'),
        lastCheckIn: null
      },
      rules: [],
      habits: [
        { id: 'habit-1', text: 'Review Trading Plan', completed: false },
        { id: 'habit-2', text: 'Daily Profiler 4 Steps', completed: false },
        { id: 'habit-3', text: 'Make Trading Ideas for day', completed: false }
      ]
    };

    // Initialize storage with default data
    chrome.storage.sync.set(defaultData);
  }

  // Set up daily reset alarm for both install and enable events
  setupDailyResetAlarm();
});

// Daily reset alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  switch (alarm.name) {
    case 'dailyReset':
      handleDailyReset();
      break;
    // Add more alarm cases here if needed in the future
  }
});

// Set up daily reset alarm on startup
chrome.runtime.onStartup.addListener(() => {
  setupDailyResetAlarm();
});


function setupDailyResetAlarm() {
  try {
    // Clear any existing alarm
    chrome.alarms.clear('dailyReset');

    // Create alarm for daily reset at market close (4 PM EST)
    const now = new Date();
    const target4PM = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    target4PM.setHours(16, 0, 0, 0); // 4 PM today

    // If 4 PM today has already passed, schedule for tomorrow
    if (now >= target4PM) {
      target4PM.setDate(target4PM.getDate() + 1);
    }

    chrome.alarms.create('dailyReset', {
      when: target4PM.getTime(),
      periodInMinutes: 24 * 60 // Repeat every 24 hours
    });
  } catch (error) {
    console.error('Error setting up daily reset alarm:', error);
  }
}

async function handleDailyReset() {
  try {
    // Get current data
    const result = await chrome.storage.sync.get(['habits']);
    
    if (result.habits) {
      // Reset all habit completion status
      const resetHabits = result.habits.map(habit => ({
        ...habit,
        completed: false
      }));
      
      // Save back to storage
      await chrome.storage.sync.set({ habits: resetHabits });
    }
    
    console.log('Daily reset completed');
  } catch (error) {
    console.error('Error during daily reset:', error);
  }
}


console.log('Prop Trader Discipline background service worker loaded');