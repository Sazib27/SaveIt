(function (global) {
  const TASKS_KEY = 'saveit_tasks';
  const SETTINGS_KEY = 'saveit_settings';
  const HISTORY_KEY = 'saveit_history';

  const memoryStore = {};

  function canUseLocalStorage() {
    try {
      const key = '__saveit_test__';
      global.localStorage.setItem(key, '1');
      global.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  const storage = canUseLocalStorage()
    ? {
        getItem: (key) => global.localStorage.getItem(key),
        setItem: (key, value) => global.localStorage.setItem(key, value),
        removeItem: (key) => global.localStorage.removeItem(key),
      }
    : {
        getItem: (key) => memoryStore[key] || null,
        setItem: (key, value) => {
          memoryStore[key] = value;
        },
        removeItem: (key) => {
          delete memoryStore[key];
        },
      };

  function readJson(key, fallback) {
    try {
      const raw = storage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearAll() {
    storage.removeItem(TASKS_KEY);
    storage.removeItem(SETTINGS_KEY);
    storage.removeItem(HISTORY_KEY);
  }

  global.SaveItStorage = {
    TASKS_KEY,
    SETTINGS_KEY,
    HISTORY_KEY,
    canUseLocalStorage,
    readJson,
    writeJson,
    clearAll,
  };
})(window);
