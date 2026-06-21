(function (global) {
  function $(selector) {
    return document.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function showToast(message, isError = false) {
    const container = $('#toast-container');
    const el = document.createElement('div');
    el.className = `toast ${isError ? 'error' : ''}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function setLoading(loading) {
    $('#loading-state').classList.toggle('hidden', !loading);
  }

  function renderBreakdown(elementId, breakdownMap) {
    const entries = Object.entries(breakdownMap);
    const target = $(`#${elementId}`);
    if (!entries.length) {
      target.innerHTML = '<li>None</li>';
      return;
    }
    target.innerHTML = entries.map(([key, value]) => `<li>${escapeHtml(key || 'Uncategorized')}: ${value}</li>`).join('');
  }

  function renderStats(stats) {
    $('#total-count').textContent = String(stats.total);
    $('#completed-count').textContent = String(stats.completed);
    $('#pending-count').textContent = String(stats.pending);
    $('#completion-percent').textContent = `${stats.percent}%`;
    renderBreakdown('category-breakdown', stats.byCategory);
    renderBreakdown('priority-breakdown', stats.byPriority);
  }

  function renderCategoryOptions(categories) {
    const select = $('#category-filter');
    const datalist = $('#category-options');
    const previousValue = select.value;
    const options = ['<option value="all">All</option>']
      .concat(categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`))
      .join('');
    select.innerHTML = options;
    if ([...select.options].some((option) => option.value === previousValue)) {
      select.value = previousValue;
    }
    datalist.innerHTML = categories.map((category) => `<option value="${escapeHtml(category)}"></option>`).join('');
  }

  function renderTasks(tasks, selectedTaskId) {
    const list = $('#task-list');
    const empty = $('#empty-state');
    if (!tasks.length) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = tasks
      .map(
        (task) => `
        <li class="task-item ${task.completed ? 'completed' : ''} ${selectedTaskId === task.id ? 'selected' : ''}" data-id="${task.id}">
          <div class="task-head">
            <h3 class="task-title ${task.completed ? 'done' : ''}">${escapeHtml(task.title)}</h3>
            <span class="priority-pill priority-${task.priority}">${task.priority}</span>
          </div>
          <p>${escapeHtml(task.description || 'No description')}</p>
          <div class="task-meta">
            <span>Category: ${escapeHtml(task.category || 'General')}</span>
            <span>Due: ${escapeHtml(global.SaveItUtils.formatDisplayDate(task.dueDate))}</span>
            <span>Recurring: ${escapeHtml(task.recurring)}</span>
          </div>
          ${task.notes ? `<p><strong>Notes:</strong> ${escapeHtml(task.notes)}</p>` : ''}
          ${task.subtasks.length ? `<p><strong>Subtasks:</strong> ${escapeHtml(task.subtasks.join(', '))}</p>` : ''}
          <div class="task-actions">
            <button type="button" data-action="toggle">${task.completed ? 'Mark Active' : 'Mark Complete'}</button>
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </div>
        </li>`
      )
      .join('');
  }

  function fillForm(task) {
    $('#task-id').value = task?.id || '';
    $('#task-title').value = task?.title || '';
    $('#task-description').value = task?.description || '';
    $('#task-priority').value = task?.priority || 'medium';
    $('#task-due-date').value = task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '';
    $('#task-category').value = task?.category || '';
    $('#task-recurring').value = task?.recurring || 'none';
    $('#task-notes').value = task?.notes || '';
    $('#task-subtasks').value = task?.subtasks?.join(', ') || '';
    $('#form-title').textContent = task ? 'Edit Task' : 'Create Task';
    $('#save-task-btn').textContent = task ? 'Update Task' : 'Save Task';
  }

  function resetForm() {
    fillForm(null);
  }

  function getFormValues() {
    return {
      id: $('#task-id').value,
      title: $('#task-title').value,
      description: $('#task-description').value,
      priority: $('#task-priority').value,
      dueDate: $('#task-due-date').value,
      category: $('#task-category').value,
      recurring: $('#task-recurring').value,
      notes: $('#task-notes').value,
      subtasks: $('#task-subtasks').value,
    };
  }

  function getFilters() {
    return {
      search: $('#search-input').value,
      status: $('#status-filter').value,
      priority: $('#priority-filter').value,
      category: $('#category-filter').value,
      sort: $('#sort-select').value,
    };
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $('#theme-toggle').textContent = theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
  }

  function setHistoryButtons(canUndo, canRedo) {
    $('#undo-btn').disabled = !canUndo;
    $('#redo-btn').disabled = !canRedo;
  }

  function confirmDialog(message) {
    return new Promise((resolve) => {
      const dialog = $('#confirm-dialog');
      $('#confirm-message').textContent = message;
      const onClose = (result) => {
        dialog.close();
        $('#confirm-ok').removeEventListener('click', okHandler);
        $('#confirm-cancel').removeEventListener('click', cancelHandler);
        dialog.removeEventListener('cancel', cancelHandler);
        resolve(result);
      };
      const okHandler = () => onClose(true);
      const cancelHandler = (event) => {
        if (event) event.preventDefault();
        onClose(false);
      };

      $('#confirm-ok').addEventListener('click', okHandler);
      $('#confirm-cancel').addEventListener('click', cancelHandler);
      dialog.addEventListener('cancel', cancelHandler);
      dialog.showModal();
    });
  }

  global.SaveItUI = {
    $, showToast, setLoading, renderStats, renderCategoryOptions, renderTasks, fillForm, resetForm, getFormValues,
    getFilters, setTheme, setHistoryButtons, confirmDialog,
  };
})(window);
