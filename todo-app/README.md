# SaveIt To-Do App

A production-ready vanilla JavaScript to-do list app with local storage persistence, filtering, sorting, statistics, import/export, undo/redo, keyboard shortcuts, and reminders.

## Run

Open `/tmp/workspace/Sazib27/SaveIt/todo-app/index.html` in a browser, or serve the folder with any static server.

## Local Storage Keys

- `saveit_tasks`
- `saveit_settings`
- `saveit_history`

## Keyboard Shortcuts

- `Ctrl/Cmd + N`: New task
- `Ctrl/Cmd + S`: Export tasks
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Escape`: Close confirmation dialog
- `Delete`: Delete selected task

## Import/Export

- Export downloads a JSON file containing `tasks`, `settings`, and `exportedAt`.
- Import accepts either the export format or a raw task array.

## Notes

- If localStorage is unavailable, the app falls back to in-memory storage for the current session.
- Browser notifications are used for due-date reminders (permission required).
