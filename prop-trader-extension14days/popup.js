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
    
    // Prevent multiple check-ins per day
    if (this.streakData.lastCheckIn === today) {
      return;
    }

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
        if (this.streakData.currentStreak < 14) {
          this.streakData.streakDays[this.streakData.currentStreak] = 'violated';
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
    
    this.rules.forEach(rule => {
      const ruleElement = document.createElement('div');
      ruleElement.className = 'rule-item';
      ruleElement.innerHTML = `
        <span class="rule-text">${rule.text}</span>
        <button class="delete-rule" data-id="${rule.id}">×</button>
      `;
      
      // Add delete functionality
      ruleElement.querySelector('.delete-rule').addEventListener('click', () => {
        this.deleteRule(rule.id);
      });
      
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
}

// Initialize the app when the popup loads
document.addEventListener('DOMContentLoaded', () => {
  new PropTraderApp();
});