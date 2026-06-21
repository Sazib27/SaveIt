(function (global) {
  const MAX_TITLE_LENGTH = 200;
  const MAX_DESCRIPTION_LENGTH = 1000;

  function generateId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return `task_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function toIsoOrNull(value) {
    const date = parseDate(value);
    return date ? date.toISOString() : null;
  }

  function priorityWeight(priority) {
    const map = { high: 3, medium: 2, low: 1 };
    return map[priority] || 0;
  }

  function normalizeTaskInput(input) {
    const title = String(input.title || '').trim();
    const description = String(input.description || '').trim();
    const category = String(input.category || '').trim();
    const notes = String(input.notes || '').trim();
    const priority = ['high', 'medium', 'low'].includes(input.priority) ? input.priority : 'medium';
    const recurring = ['none', 'daily', 'weekly', 'monthly'].includes(input.recurring) ? input.recurring : 'none';
    const dueDate = toIsoOrNull(input.dueDate);
    const subtasks = Array.isArray(input.subtasks)
      ? input.subtasks.filter(Boolean)
      : String(input.subtasks || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

    return { title, description, category, notes, priority, recurring, dueDate, subtasks };
  }

  function validateTaskInput(input) {
    const errors = [];
    if (!input.title) errors.push('Title is required.');
    if (input.title.length > MAX_TITLE_LENGTH) errors.push(`Title must be ${MAX_TITLE_LENGTH} characters or less.`);
    if (input.description.length > MAX_DESCRIPTION_LENGTH)
      errors.push(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
    if (input.notes.length > MAX_DESCRIPTION_LENGTH)
      errors.push(`Notes must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
    if (input.dueDate && !parseDate(input.dueDate)) errors.push('Invalid due date.');
    return { valid: errors.length === 0, errors };
  }

  function createTask(input) {
    const normalized = normalizeTaskInput(input);
    const now = new Date().toISOString();
    return {
      id: generateId(),
      title: normalized.title,
      description: normalized.description,
      completed: Boolean(input.completed),
      priority: normalized.priority,
      category: normalized.category,
      dueDate: normalized.dueDate,
      createdAt: input.createdAt || now,
      updatedAt: now,
      recurring: normalized.recurring,
      subtasks: normalized.subtasks,
      notes: normalized.notes,
    };
  }

  function formatDisplayDate(value) {
    const date = parseDate(value);
    return date ? date.toLocaleString() : 'No due date';
  }

  global.SaveItUtils = {
    generateId,
    parseDate,
    toIsoOrNull,
    priorityWeight,
    normalizeTaskInput,
    validateTaskInput,
    createTask,
    formatDisplayDate,
    MAX_TITLE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
  };
})(window);
