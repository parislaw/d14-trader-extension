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
    this.settings = {
      analyticsEnabled: true, // Default to enabled
      privacyConsent: false
    };

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
    this.renderSettings();
    this.checkDailyReset();
  }

  // Data Management
  async loadData() {
    try {
      const result = await chrome.storage.sync.get([
        'streakData', 'rules', 'habits', 'settings'
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

      if (result.settings) {
        this.settings = { ...this.settings, ...result.settings };
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
        habits: this.habits,
        settings: this.settings
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

    // Settings tab functionality
    this.setupSettingsEventListeners();
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
        // Violation logged silently for privacy
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
    if (confirm('Are you sure you want to delete this rule?')) {
      this.rules = this.rules.filter(rule => rule.id !== ruleId);
      await this.saveData();
      this.renderRules();
    }
  }

  startEditRule(ruleId) {
    const ruleElement = document.querySelector(`[data-id="${ruleId}"]`);
    const ruleText = ruleElement.querySelector('.rule-text');
    const editInput = ruleElement.querySelector('.rule-edit-input');
    const editBtn = ruleElement.querySelector('.edit-rule');
    const saveBtn = ruleElement.querySelector('.save-rule');
    const cancelBtn = ruleElement.querySelector('.cancel-edit');

    // Hide text and edit button, show input and save/cancel buttons
    ruleText.classList.add('hidden');
    editBtn.classList.add('hidden');
    editInput.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    cancelBtn.classList.remove('hidden');

    // Focus and select text in input
    editInput.focus();
    editInput.select();

    // Add Enter key listener for quick save
    editInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveEditRule(ruleId);
      } else if (e.key === 'Escape') {
        this.cancelEditRule(ruleId);
      }
    });
  }

  async saveEditRule(ruleId) {
    const ruleElement = document.querySelector(`[data-id="${ruleId}"]`);
    const editInput = ruleElement.querySelector('.rule-edit-input');
    const newText = editInput.value.trim();

    if (newText && newText.length > 0) {
      // Update the rule in the data
      const rule = this.rules.find(r => r.id === ruleId);
      if (rule) {
        rule.text = newText;
        await this.saveData();
        this.renderRules();
      }
    } else {
      this.cancelEditRule(ruleId);
    }
  }

  cancelEditRule(ruleId) {
    const ruleElement = document.querySelector(`[data-id="${ruleId}"]`);
    const ruleText = ruleElement.querySelector('.rule-text');
    const editInput = ruleElement.querySelector('.rule-edit-input');
    const editBtn = ruleElement.querySelector('.edit-rule');
    const saveBtn = ruleElement.querySelector('.save-rule');
    const cancelBtn = ruleElement.querySelector('.cancel-edit');

    // Reset input value to original
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      editInput.value = rule.text;
    }

    // Show text and edit button, hide input and save/cancel buttons
    ruleText.classList.remove('hidden');
    editBtn.classList.remove('hidden');
    editInput.classList.add('hidden');
    saveBtn.classList.add('hidden');
    cancelBtn.classList.add('hidden');
  }

  addRuleDragListeners(element) {
    element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', element.dataset.index);
      element.classList.add('dragging');
    });

    element.addEventListener('dragend', (e) => {
      element.classList.remove('dragging');
    });

    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingElement = document.querySelector('.rule-item.dragging');
      if (draggingElement !== element) {
        element.classList.add('drag-over');
      }
    });

    element.addEventListener('dragleave', (e) => {
      element.classList.remove('drag-over');
    });

    element.addEventListener('drop', (e) => {
      e.preventDefault();
      element.classList.remove('drag-over');

      const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const targetIndex = parseInt(element.dataset.index);

      if (draggedIndex !== targetIndex) {
        this.reorderRules(draggedIndex, targetIndex);
      }
    });
  }

  async reorderRules(fromIndex, toIndex) {
    const ruleToMove = this.rules[fromIndex];
    this.rules.splice(fromIndex, 1);
    this.rules.splice(toIndex, 0, ruleToMove);

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

    this.habits.forEach((habit, index) => {
      const habitElement = document.createElement('div');
      habitElement.className = 'habit-item';
      habitElement.draggable = true;
      habitElement.dataset.id = habit.id;
      habitElement.dataset.index = index;
      habitElement.innerHTML = `
        <span class="drag-handle">≡</span>
        <input type="checkbox" id="${habit.id}" class="habit-checkbox" ${habit.completed ? 'checked' : ''}>
        <label for="${habit.id}" class="habit-text" data-id="${habit.id}">${habit.text}</label>
        <input type="text" class="habit-edit-input hidden" data-id="${habit.id}" value="${habit.text}" maxlength="80">
        <div class="habit-actions">
          <button class="edit-habit" data-id="${habit.id}" title="Edit habit">✏️</button>
          <button class="save-habit hidden" data-id="${habit.id}" title="Save">✓</button>
          <button class="cancel-habit-edit hidden" data-id="${habit.id}" title="Cancel">×</button>
          <button class="delete-habit" data-id="${habit.id}" title="Delete habit">🗑️</button>
        </div>
      `;

      // Add checkbox functionality
      const checkbox = habitElement.querySelector('.habit-checkbox');
      checkbox.addEventListener('change', () => {
        this.toggleHabit(habit.id, checkbox.checked);
      });

      // Add edit functionality
      habitElement.querySelector('.edit-habit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.startEditHabit(habit.id);
      });

      // Add save functionality
      habitElement.querySelector('.save-habit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.saveEditHabit(habit.id);
      });

      // Add cancel functionality
      habitElement.querySelector('.cancel-habit-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.cancelEditHabit(habit.id);
      });

      // Add delete functionality
      habitElement.querySelector('.delete-habit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteHabit(habit.id);
      });

      // Add drag event listeners
      this.addHabitDragListeners(habitElement);

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

  async deleteHabit(habitId) {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habits = this.habits.filter(habit => habit.id !== habitId);
      await this.saveData();
      this.renderHabits();
    }
  }

  startEditHabit(habitId) {
    const habitElement = document.querySelector(`[data-id="${habitId}"].habit-item`);
    const habitText = habitElement.querySelector('.habit-text');
    const editInput = habitElement.querySelector('.habit-edit-input');
    const editBtn = habitElement.querySelector('.edit-habit');
    const saveBtn = habitElement.querySelector('.save-habit');
    const cancelBtn = habitElement.querySelector('.cancel-habit-edit');

    // Hide text and edit button, show input and save/cancel buttons
    habitText.classList.add('hidden');
    editBtn.classList.add('hidden');
    editInput.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    cancelBtn.classList.remove('hidden');

    // Focus and select text in input
    editInput.focus();
    editInput.select();

    // Add Enter key listener for quick save
    editInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveEditHabit(habitId);
      } else if (e.key === 'Escape') {
        this.cancelEditHabit(habitId);
      }
    });
  }

  async saveEditHabit(habitId) {
    const habitElement = document.querySelector(`[data-id="${habitId}"].habit-item`);
    const editInput = habitElement.querySelector('.habit-edit-input');
    const newText = editInput.value.trim();

    if (newText && newText.length > 0) {
      // Update the habit in the data
      const habit = this.habits.find(h => h.id === habitId);
      if (habit) {
        habit.text = newText;
        await this.saveData();
        this.renderHabits();
      }
    } else {
      this.cancelEditHabit(habitId);
    }
  }

  cancelEditHabit(habitId) {
    const habitElement = document.querySelector(`[data-id="${habitId}"].habit-item`);
    const habitText = habitElement.querySelector('.habit-text');
    const editInput = habitElement.querySelector('.habit-edit-input');
    const editBtn = habitElement.querySelector('.edit-habit');
    const saveBtn = habitElement.querySelector('.save-habit');
    const cancelBtn = habitElement.querySelector('.cancel-habit-edit');

    // Reset input value to original
    const habit = this.habits.find(h => h.id === habitId);
    if (habit) {
      editInput.value = habit.text;
    }

    // Show text and edit button, hide input and save/cancel buttons
    habitText.classList.remove('hidden');
    editBtn.classList.remove('hidden');
    editInput.classList.add('hidden');
    saveBtn.classList.add('hidden');
    cancelBtn.classList.add('hidden');
  }

  addHabitDragListeners(element) {
    element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', element.dataset.index);
      element.classList.add('dragging');
    });

    element.addEventListener('dragend', (e) => {
      element.classList.remove('dragging');
    });

    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingElement = document.querySelector('.habit-item.dragging');
      if (draggingElement !== element) {
        element.classList.add('drag-over');
      }
    });

    element.addEventListener('dragleave', (e) => {
      element.classList.remove('drag-over');
    });

    element.addEventListener('drop', (e) => {
      e.preventDefault();
      element.classList.remove('drag-over');

      const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const targetIndex = parseInt(element.dataset.index);

      if (draggedIndex !== targetIndex) {
        this.reorderHabits(draggedIndex, targetIndex);
      }
    });
  }

  async reorderHabits(fromIndex, toIndex) {
    const habitToMove = this.habits[fromIndex];
    this.habits.splice(fromIndex, 1);
    this.habits.splice(toIndex, 0, habitToMove);

    await this.saveData();
    this.renderHabits();
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
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening resource link:', error);
    }
  }

  trackResourceClick(category, resourceName) {
    // Only track if analytics is enabled
    if (!this.settings.analyticsEnabled) {
      return;
    }

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

    // Resource click tracked silently
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