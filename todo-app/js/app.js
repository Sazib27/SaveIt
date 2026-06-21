(function (global) {
  const { SaveItStorage, SaveItUI, SaveItUtils } = global;

  const defaultSettings = {
    theme: 'dark',
    remindersEnabled: true,
  };

  const state = {
    tasks: [],
    settings: { ...defaultSettings },
    history: { undo: [], redo: [] },
    selectedTaskId: null,
  };

  let reminderInterval = null;

  function cloneState(payload) {
    return JSON.parse(JSON.stringify(payload));
  }

  function pushHistorySnapshot() {
    state.history.undo.push(cloneState(state.tasks));
    if (state.history.undo.length > 100) state.history.undo.shift();
    state.history.redo = [];
    persistHistory();
  }

  function persistHistory() {
    SaveItStorage.writeJson(SaveItStorage.HISTORY_KEY, state.history);
    SaveItUI.setHistoryButtons(state.history.undo.length > 0, state.history.redo.length > 0);
  }

  function persistAll() {
    SaveItStorage.writeJson(SaveItStorage.TASKS_KEY, state.tasks);
    SaveItStorage.writeJson(SaveItStorage.SETTINGS_KEY, state.settings);
    persistHistory();
  }

  function recoverPersistedData() {
    const rawTasks = SaveItStorage.readJson(SaveItStorage.TASKS_KEY, []);
    const rawSettings = SaveItStorage.readJson(SaveItStorage.SETTINGS_KEY, defaultSettings);
    const rawHistory = SaveItStorage.readJson(SaveItStorage.HISTORY_KEY, { undo: [], redo: [] });

    state.tasks = Array.isArray(rawTasks)
      ? rawTasks.filter((task) => task && task.id && task.title).map((task) => ({ ...SaveItUtils.createTask(task), ...task }))
      : [];
    state.settings = { ...defaultSettings, ...(rawSettings || {}) };
    state.history = {
      undo: Array.isArray(rawHistory.undo) ? rawHistory.undo : [],
      redo: Array.isArray(rawHistory.redo) ? rawHistory.redo : [],
    };
  }

  function getCategories() {
    return [...new Set(state.tasks.map((task) => task.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function computeStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const byCategory = tasks.reduce((map, task) => {
      const key = task.category || 'Uncategorized';
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});
    const byPriority = tasks.reduce((map, task) => {
      map[task.priority] = (map[task.priority] || 0) + 1;
      return map;
    }, { high: 0, medium: 0, low: 0 });
    return {
      total,
      completed,
      pending,
      byCategory,
      byPriority,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }

  function applyFilters(tasks, filters) {
    const searchTerm = filters.search.trim().toLowerCase();

    let filtered = tasks.filter((task) => {
      if (filters.status === 'active' && task.completed) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.category !== 'all' && task.category !== filters.category) return false;

      if (!searchTerm) return true;
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.notes.toLowerCase().includes(searchTerm)
      );
    });

    const [sortField, direction] = filters.sort.split('_');
    const modifier = direction === 'desc' ? -1 : 1;
    filtered = filtered.sort((a, b) => {
      if (sortField === 'priority') {
        return (SaveItUtils.priorityWeight(a.priority) - SaveItUtils.priorityWeight(b.priority)) * modifier;
      }
      const aValue = a[sortField] ? new Date(a[sortField]).getTime() : 0;
      const bValue = b[sortField] ? new Date(b[sortField]).getTime() : 0;
      return (aValue - bValue) * modifier;
    });

    return filtered;
  }

  function render() {
    const filters = SaveItUI.getFilters();
    const visibleTasks = applyFilters([...state.tasks], filters);
    SaveItUI.renderTasks(visibleTasks, state.selectedTaskId);
    SaveItUI.renderStats(computeStats(state.tasks));
    SaveItUI.renderCategoryOptions(getCategories());
    SaveItUI.setTheme(state.settings.theme);
    SaveItUI.setHistoryButtons(state.history.undo.length > 0, state.history.redo.length > 0);
  }

  function upsertTask(formData) {
    const normalized = SaveItUtils.normalizeTaskInput(formData);
    const validation = SaveItUtils.validateTaskInput(normalized);
    if (!validation.valid) {
      SaveItUI.showToast(validation.errors[0], true);
      return;
    }

    pushHistorySnapshot();

    if (formData.id) {
      state.tasks = state.tasks.map((task) =>
        task.id === formData.id
          ? {
              ...task,
              ...normalized,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      SaveItUI.showToast('Task updated.');
    } else {
      const task = SaveItUtils.createTask(normalized);
      state.tasks.unshift(task);
      SaveItUI.showToast('Task created.');
    }

    persistAll();
    SaveItUI.resetForm();
    render();
  }

  async function deleteTask(taskId) {
    const confirmed = await SaveItUI.confirmDialog('Delete this task permanently?');
    if (!confirmed) return;

    pushHistorySnapshot();
    state.tasks = state.tasks.filter((task) => task.id !== taskId);
    if (state.selectedTaskId === taskId) state.selectedTaskId = null;
    persistAll();
    render();
    SaveItUI.showToast('Task deleted.');
  }

  function applyRecurringTask(task) {
    if (!task.completed || task.recurring === 'none') return;
    const baseDate = SaveItUtils.parseDate(task.dueDate) || new Date();
    const nextDate = new Date(baseDate);
    if (task.recurring === 'daily') nextDate.setDate(nextDate.getDate() + 1);
    if (task.recurring === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    if (task.recurring === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

    const nextTask = SaveItUtils.createTask({
      ...task,
      id: undefined,
      completed: false,
      dueDate: nextDate.toISOString(),
      recurring: task.recurring,
      createdAt: undefined,
      updatedAt: undefined,
    });

    state.tasks.unshift(nextTask);
    SaveItUI.showToast(`Recurring task created for ${task.title}.`);
  }

  function toggleTask(taskId) {
    pushHistorySnapshot();
    state.tasks = state.tasks.map((task) => {
      if (task.id !== taskId) return task;
      const updatedTask = { ...task, completed: !task.completed, updatedAt: new Date().toISOString() };
      if (updatedTask.completed) applyRecurringTask(updatedTask);
      return updatedTask;
    });
    persistAll();
    render();
  }

  function editTask(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    state.selectedTaskId = taskId;
    SaveItUI.fillForm(task);
    render();
  }

  function undo() {
    if (!state.history.undo.length) return;
    const previous = state.history.undo.pop();
    state.history.redo.push(cloneState(state.tasks));
    state.tasks = previous;
    persistAll();
    render();
    SaveItUI.showToast('Undo complete.');
  }

  function redo() {
    if (!state.history.redo.length) return;
    const next = state.history.redo.pop();
    state.history.undo.push(cloneState(state.tasks));
    state.tasks = next;
    persistAll();
    render();
    SaveItUI.showToast('Redo complete.');
  }

  async function clearAllTasks() {
    const confirmed = await SaveItUI.confirmDialog('Clear all tasks and history?');
    if (!confirmed) return;
    state.tasks = [];
    state.history = { undo: [], redo: [] };
    state.selectedTaskId = null;
    SaveItStorage.clearAll();
    persistAll();
    render();
    SaveItUI.showToast('All data cleared.');
  }

  function exportTasks() {
    const payload = {
      exportedAt: new Date().toISOString(),
      tasks: state.tasks,
      settings: state.settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saveit_tasks_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    SaveItUI.showToast('Export complete.');
  }

  function importTasks(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'));
        const incomingTasks = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : null;
        if (!incomingTasks) throw new Error('Invalid JSON format.');

        pushHistorySnapshot();
        const seen = new Set();
        state.tasks = incomingTasks
          .map((task) => ({ ...SaveItUtils.createTask(task), ...task }))
          .filter((task) => {
            if (!task.id || seen.has(task.id)) {
              task.id = SaveItUtils.generateId();
            }
            seen.add(task.id);
            return task.title;
          });

        state.settings = { ...state.settings, ...(data.settings || {}) };
        persistAll();
        render();
        SaveItUI.showToast('Import complete.');
      } catch (error) {
        SaveItUI.showToast(`Import failed: ${error.message}`, true);
      }
    };
    reader.readAsText(file);
  }

  function toggleTheme() {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    SaveItStorage.writeJson(SaveItStorage.SETTINGS_KEY, state.settings);
    render();
  }

  function requestNotificationPermission() {
    if (!state.settings.remindersEnabled || !('Notification' in global) || Notification.permission === 'granted') return;
    Notification.requestPermission().catch(() => undefined);
  }

  function runReminderCheck() {
    if (!state.settings.remindersEnabled || !('Notification' in global) || Notification.permission !== 'granted') return;

    const now = Date.now();
    state.tasks.forEach((task) => {
      if (task.completed || !task.dueDate) return;
      const dueTime = new Date(task.dueDate).getTime();
      if (Number.isNaN(dueTime)) return;
      const diffMinutes = Math.floor((dueTime - now) / 60000);
      const alreadyReminded = task._remindedAt && now - new Date(task._remindedAt).getTime() < 3600000;
      if (diffMinutes >= 0 && diffMinutes <= 5 && !alreadyReminded) {
        new Notification(`Task reminder: ${task.title}`, {
          body: `Due at ${new Date(task.dueDate).toLocaleTimeString()}`,
        });
        task._remindedAt = new Date().toISOString();
      }
    });
    SaveItStorage.writeJson(SaveItStorage.TASKS_KEY, state.tasks);
  }

  function bindEvents() {
    SaveItUI.$('#task-form').addEventListener('submit', (event) => {
      event.preventDefault();
      upsertTask(SaveItUI.getFormValues());
    });

    SaveItUI.$('#cancel-edit-btn').addEventListener('click', () => {
      state.selectedTaskId = null;
      SaveItUI.resetForm();
      render();
    });

    SaveItUI.$('#task-list').addEventListener('click', (event) => {
      const item = event.target.closest('.task-item');
      if (!item) return;
      const taskId = item.dataset.id;
      state.selectedTaskId = taskId;
      const action = event.target.dataset.action;
      if (action === 'toggle') toggleTask(taskId);
      if (action === 'edit') editTask(taskId);
      if (action === 'delete') deleteTask(taskId);
      if (!action) render();
    });

    ['#search-input', '#status-filter', '#priority-filter', '#category-filter', '#sort-select'].forEach((selector) => {
      SaveItUI.$(selector).addEventListener('input', render);
      SaveItUI.$(selector).addEventListener('change', render);
    });

    SaveItUI.$('#undo-btn').addEventListener('click', undo);
    SaveItUI.$('#redo-btn').addEventListener('click', redo);
    SaveItUI.$('#theme-toggle').addEventListener('click', toggleTheme);
    SaveItUI.$('#clear-all-btn').addEventListener('click', clearAllTasks);
    SaveItUI.$('#export-btn').addEventListener('click', exportTasks);
    SaveItUI.$('#import-input').addEventListener('change', (event) => {
      importTasks(event.target.files?.[0]);
      event.target.value = '';
    });
  }

  function init() {
    SaveItUI.setLoading(true);
    recoverPersistedData();
    bindEvents();
    render();
    SaveItUI.resetForm();
    SaveItUI.setLoading(false);
    requestNotificationPermission();
    reminderInterval = global.setInterval(runReminderCheck, 60000);
  }

  global.SaveItApp = {
    init,
    undo,
    redo,
    exportTasks,
    clearAllTasks,
    deleteSelectedTask: () => {
      if (!state.selectedTaskId) {
        SaveItUI.showToast('Select a task first.', true);
        return;
      }
      deleteTask(state.selectedTaskId);
    },
    focusNewTask: () => {
      state.selectedTaskId = null;
      SaveItUI.resetForm();
      SaveItUI.$('#task-title').focus();
    },
  };

  document.addEventListener('DOMContentLoaded', init);
  global.addEventListener('beforeunload', () => {
    if (reminderInterval) global.clearInterval(reminderInterval);
  });
})(window);
