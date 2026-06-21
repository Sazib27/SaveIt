import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadScript(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

test('utils validates and normalizes task data', () => {
  const context = {
    window: {
      crypto: { randomUUID: () => 'uuid-1' },
    },
  };
  context.window.window = context.window;

  loadScript('/tmp/workspace/Sazib27/SaveIt/todo-app/js/utils.js', context);
  const { SaveItUtils } = context.window;

  const normalized = SaveItUtils.normalizeTaskInput({
    title: '  Demo  ',
    description: '  Desc  ',
    dueDate: '2026-06-04T10:00:00.000Z',
    subtasks: 'a, b, c',
  });

  assert.equal(normalized.title, 'Demo');
  assert.equal(normalized.description, 'Desc');
  assert.equal(JSON.stringify(normalized.subtasks), JSON.stringify(['a', 'b', 'c']));

  const tooLong = SaveItUtils.validateTaskInput({
    title: 'x'.repeat(201),
    description: '',
    notes: '',
    dueDate: null,
  });

  assert.equal(tooLong.valid, false);
  assert.ok(tooLong.errors.some((item) => item.includes('200 characters')));
});

test('storage writes and reads JSON from localStorage abstraction', () => {
  const memory = new Map();
  const context = {
    window: {
      localStorage: {
        setItem: (key, value) => memory.set(key, value),
        getItem: (key) => memory.get(key) ?? null,
        removeItem: (key) => memory.delete(key),
      },
    },
  };
  context.window.window = context.window;

  loadScript('/tmp/workspace/Sazib27/SaveIt/todo-app/js/storage.js', context);
  const { SaveItStorage } = context.window;

  assert.equal(SaveItStorage.writeJson(SaveItStorage.TASKS_KEY, [{ id: '1' }]), true);
  assert.equal(JSON.stringify(SaveItStorage.readJson(SaveItStorage.TASKS_KEY, [])), JSON.stringify([{ id: '1' }]));

  SaveItStorage.clearAll();
  assert.equal(SaveItStorage.readJson(SaveItStorage.TASKS_KEY, null), null);
});
