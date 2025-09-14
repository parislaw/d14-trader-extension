// Prop Trader Discipline Extension - Main Popup Script

class PropTraderApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.streakData = {
      currentStreak: 0,
      longestStreak: 0,
      streakDays: new Array(14).fill('incomplete'), // 'incomplete', 'completed', 'violated'
      lastCheckIn: null
    };
    this.rules = [];
    this.habits = [
      { id: 'habit-1', text: 'Review Trading Plan', completed: false },
      { id: 'habit-2', text: 'Daily Profiler 4 Steps', completed: false },
      { id: 'habit-3', text: 'Make Trading Ideas for day', completed: false }
    ];
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.setupNavigation();
    this.renderCalendarGrid();
    this.updateStreakDisplay();
    this.renderRules();
    this.renderHabits();
    this.checkDailyReset();
  }

  // Data Management
  async loadData() {
    try {
      const result = await chrome.storage.sync.get([
        'streakData', 'rules', 'habits'
      ]);
      
      if (result.streakData) {
        this.streakData = { ...this.streakData, ...result.streakData };
      }
      
      if (result.rules) {
        this.rules = result.rules;
      }
      
      if (result.habits) {
        this.habits = result.habits;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async saveData() {
    try {
      await chrome.storage.sync.set({
        streakData: this.streakData,
        rules: this.rules,
        habits: this.habits
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Navigation
  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active nav button
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        tabContents.forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        
        this.currentTab = tabName;
      });
    });
  }

  // Event Listeners
  setupEventListeners() {
    // Check-in buttons
    document.getElementById('followed-rules').addEventListener('click', () => {
      this.handleCheckIn('followed');
    });

    document.getElementById('violated-rule').addEventListener('click', () => {
      this.showViolationModal();
    });

    // Modal handlers
    document.getElementById('cancel-violation').addEventListener('click', () => {
      this.hideViolationModal();
    });

    document.getElementById('reset-streak').addEventListener('click', () => {
      this.handleCheckIn('violated');
    });

    // Rules management
    document.getElementById('add-rule-btn').addEventListener('click', () => {
      this.showRuleInput();
    });

    document.getElementById('save-rule').addEventListener('click', () => {
      this.saveRule();
    });

    document.getElementById('cancel-rule').addEventListener('click', () => {
      this.hideRuleInput();
    });

    // Habits management
    document.getElementById('add-habit-btn').addEventListener('click', () => {
      this.showHabitInput();
    });

    document.getElementById('save-habit').addEventListener('click', () => {
      this.saveHabit();
    });

    document.getElementById('cancel-habit').addEventListener('click', () => {
      this.hideHabitInput();
    });

    // Overlay click
    document.getElementById('overlay').addEventListener('click', () => {
      this.hideViolationModal();
    });

    // Resources tab functionality
    this.setupResourceEventListeners();
  }

  // Streak Management
  renderCalendarGrid() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    for (let i = 0; i < 14; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day';
      day.textContent = i + 1;
      
      const status = this.streakData.streakDays[i];
      if (status === 'completed') {
        day.classList.add('completed');
      } else if (status === 'violated') {
        day.classList.add('violated');
      }
      
      // Mark current day if streak is active
      if (i === this.streakData.currentStreak && status === 'incomplete') {
        day.classList.add('current');
      }
      
      grid.appendChild(day);
    }
  }

  updateStreakDisplay() {
    document.getElementById('current-streak').textContent = this.streakData.currentStreak;
    document.getElementById('longest-count').textContent = this.streakData.longestStreak;
  }

  async handleCheckIn(type) {
    const today = new Date().toDateString();

    if (type === 'followed') {
      // Mark current day as completed
      if (this.streakData.currentStreak < 14) {
        this.streakData.streakDays[this.streakData.currentStreak] = 'completed';
        this.streakData.currentStreak++;
        
        // Update longest streak if needed
        if (this.streakData.currentStreak > this.streakData.longestStreak) {
          this.streakData.longestStreak = this.streakData.currentStreak;
        }
      }
    } else if (type === 'violated') {
      // Mark current day as violated and reset streak
      const violationText = document.getElementById('violation-text').value.trim();
      if (violationText) {
        // Check if we already checked in today as 'followed'
        const hasCheckedInToday = this.streakData.lastCheckIn === today;

        if (hasCheckedInToday) {
          // Override previous completion - find the most recent completed day and mark as violated
          const lastCompletedIndex = this.streakData.streakDays.lastIndexOf('completed');
          if (lastCompletedIndex !== -1) {
            this.streakData.streakDays[lastCompletedIndex] = 'violated';
          }
        } else {
          // Normal violation on unchecked day
          if (this.streakData.currentStreak < 14) {
            this.streakData.streakDays[this.streakData.currentStreak] = 'violated';
          }
        }

        // Reset streak
        this.streakData.currentStreak = 0;
        this.streakData.streakDays.fill('incomplete');

        // Log violation (could be expanded to store violation history)
        console.log('Violation logged:', violationText);
      }

      this.hideViolationModal();
    }

    this.streakData.lastCheckIn = today;
    await this.saveData();
    this.renderCalendarGrid();
    this.updateStreakDisplay();
  }

  // Modal Management
  showViolationModal() {
    document.getElementById('violation-modal').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('violation-text').value = '';
    document.getElementById('violation-text').focus();
  }

  hideViolationModal() {
    document.getElementById('violation-modal').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
  }

  // Rules Management
  showRuleInput() {
    document.getElementById('rules-empty').classList.add('hidden');
    document.getElementById('rule-input-section').classList.remove('hidden');
    document.getElementById('rule-input').focus();
  }

  hideRuleInput() {
    document.getElementById('rule-input-section').classList.add('hidden');
    document.getElementById('rule-input').value = '';
    if (this.rules.length === 0) {
      document.getElementById('rules-empty').classList.remove('hidden');
    }
  }

  async saveRule() {
    const input = document.getElementById('rule-input');
    const ruleText = input.value.trim();
    
    if (ruleText) {
      const newRule = {
        id: Date.now().toString(),
        text: ruleText,
        createdAt: new Date().toISOString()
      };
      
      this.rules.push(newRule);
      await this.saveData();
      this.renderRules();
      this.hideRuleInput();
    }
  }

  renderRules() {
    const rulesList = document.getElementById('rules-list');
    const emptyState = document.getElementById('rules-empty');
    
    if (this.rules.length === 0) {
      emptyState.classList.remove('hidden');
      rulesList.innerHTML = '';
      return;
    }
    
    emptyState.classList.add('hidden');
    rulesList.innerHTML = '';
    
    this.rules.forEach((rule, index) => {
      const ruleElement = document.createElement('div');
      ruleElement.className = 'rule-item';
      ruleElement.draggable = true;
      ruleElement.dataset.id = rule.id;
      ruleElement.dataset.index = index;
      ruleElement.innerHTML = `
        <span class="drag-handle">≡</span>
        <span class="rule-text" data-id="${rule.id}">${rule.text}</span>
        <input type="text" class="rule-edit-input hidden" data-id="${rule.id}" value="${rule.text}" maxlength="100">
        <div class="rule-actions">
          <button class="edit-rule" data-id="${rule.id}" title="Edit rule">✏️</button>
          <button class="save-rule hidden" data-id="${rule.id}" title="Save">✓</button>
          <button class="cancel-edit hidden" data-id="${rule.id}" title="Cancel">×</button>
          <button class="delete-rule" data-id="${rule.id}" title="Delete rule">🗑️</button>
        </div>
      `;

      // Add edit functionality
      ruleElement.querySelector('.edit-rule').addEventListener('click', (e) => {
        e.stopPropagation();
        this.startEditRule(rule.id);
      });

      // Add save functionality
      ruleElement.querySelector('.save-rule').addEventListener('click', (e) => {
        e.stopPropagation();
        this.saveEditRule(rule.id);
      });

      // Add cancel functionality
      ruleElement.querySelector('.cancel-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.cancelEditRule(rule.id);
      });

      // Add delete functionality
      ruleElement.querySelector('.delete-rule').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteRule(rule.id);
      });

      // Add drag event listeners
      this.addRuleDragListeners(ruleElement);

      rulesList.appendChild(ruleElement);
    });
  }

  async deleteRule(ruleId) {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
    await this.saveData();
    this.renderRules();
  }

  // Habits Management
  showHabitInput() {
    document.getElementById('habit-input-section').classList.remove('hidden');
    document.getElementById('habit-input').focus();
  }

  hideHabitInput() {
    document.getElementById('habit-input-section').classList.add('hidden');
    document.getElementById('habit-input').value = '';
  }

  async saveHabit() {
    const input = document.getElementById('habit-input');
    const habitText = input.value.trim();
    
    if (habitText) {
      const newHabit = {
        id: Date.now().toString(),
        text: habitText,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      this.habits.push(newHabit);
      await this.saveData();
      this.renderHabits();
      this.hideHabitInput();
    }
  }

  renderHabits() {
    const habitsList = document.getElementById('habits-list');
    habitsList.innerHTML = '';
    
    this.habits.forEach(habit => {
      const habitElement = document.createElement('div');
      habitElement.className = 'habit-item';
      habitElement.innerHTML = `
        <input type="checkbox" id="${habit.id}" class="habit-checkbox" ${habit.completed ? 'checked' : ''}>
        <label for="${habit.id}">${habit.text}</label>
      `;
      
      // Add checkbox functionality
      const checkbox = habitElement.querySelector('.habit-checkbox');
      checkbox.addEventListener('change', () => {
        this.toggleHabit(habit.id, checkbox.checked);
      });
      
      habitsList.appendChild(habitElement);
    });
  }

  async toggleHabit(habitId, completed) {
    const habit = this.habits.find(h => h.id === habitId);
    if (habit) {
      habit.completed = completed;
      await this.saveData();
    }
  }

  // Daily Reset Logic
  checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastDailyReset');

    if (lastReset !== today) {
      // Reset habits completion status
      this.habits.forEach(habit => {
        habit.completed = false;
      });

      localStorage.setItem('lastDailyReset', today);
      this.saveData();
      this.renderHabits();
    }
  }

  // Resources Tab Management
  setupResourceEventListeners() {
    // Add click listeners to all resource cards
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
      card.addEventListener('click', () => {
        const url = card.dataset.url;
        const category = card.dataset.category;
        const name = card.querySelector('.resource-name').textContent;

        this.handleResourceClick(url, category, name);
      });
    });
  }

  async handleResourceClick(url, category, resourceName) {
    try {
      // Track the click for analytics
      this.trackResourceClick(category, resourceName);

      // Open the affiliate link in a new tab
      chrome.tabs.create({ url: url });
    } catch (error) {
      console.error('Error opening resource link:', error);
      // Fallback: try to open with window.open
      window.open(url, '_blank');
    }
  }

  trackResourceClick(category, resourceName) {
    // Track click events for analytics
    const clickData = {
      timestamp: new Date().toISOString(),
      category: category,
      resource: resourceName,
      userAgent: navigator.userAgent
    };

    // Store in local storage for analytics (could be enhanced with external analytics)
    const existingClicks = JSON.parse(localStorage.getItem('resourceClicks') || '[]');
    existingClicks.push(clickData);

    // Keep only last 100 clicks to manage storage
    if (existingClicks.length > 100) {
      existingClicks.shift();
    }

    localStorage.setItem('resourceClicks', JSON.stringify(existingClicks));

    // Log for debugging
    console.log('Resource clicked:', clickData);
  }

  // Get analytics data (for potential future use)
  getResourceAnalytics() {
    const clicks = JSON.parse(localStorage.getItem('resourceClicks') || '[]');

    // Aggregate by category
    const analytics = {
      totalClicks: clicks.length,
      clicksByCategory: {},
      clicksByResource: {},
      recentClicks: clicks.slice(-10)
    };

    clicks.forEach(click => {
      // Count by category
      analytics.clicksByCategory[click.category] =
        (analytics.clicksByCategory[click.category] || 0) + 1;

      // Count by resource
      analytics.clicksByResource[click.resource] =
        (analytics.clicksByResource[click.resource] || 0) + 1;
    });

    return analytics;
  }
}

// Initialize the app when the popup loads
document.addEventListener('DOMContentLoaded', () => {
  new PropTraderApp();
});