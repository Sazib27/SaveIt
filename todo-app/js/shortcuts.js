(function (global) {
  function isMetaCombo(event) {
    return event.ctrlKey || event.metaKey;
  }

  function setupShortcuts() {
    document.addEventListener('keydown', (event) => {
      const activeElement = document.activeElement;
      const typing = activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName);

      if (isMetaCombo(event) && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        global.SaveItApp.focusNewTask();
      }

      if (isMetaCombo(event) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        global.SaveItApp.exportTasks();
      }

      if (event.key === 'Escape') {
        const dialog = document.querySelector('#confirm-dialog');
        if (dialog?.open) dialog.close();
      }

      if (event.key === 'Delete' && !typing) {
        event.preventDefault();
        global.SaveItApp.deleteSelectedTask();
      }

      if (isMetaCombo(event) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        global.SaveItApp.undo();
      }

      if (isMetaCombo(event) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        global.SaveItApp.redo();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setupShortcuts);
})(window);
