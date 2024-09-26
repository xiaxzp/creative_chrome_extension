class BrowserStorage {
  set(key, value) {
    return browser.storage.local.set({ [key]: value });
  }

  async get<T>(key, defaultValue?: T): Promise<T | undefined> {
    const result = await browser.storage.local.get(key);

    if (result[key] || typeof result[key] === 'boolean') {
      return result[key];
    }

    return defaultValue;
  }

  remove(key) {
    return browser.storage.local.remove(key);
  }

  addChangeListener(targetKey, callback) {
    browser.storage.onChanged.addListener((changes) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (targetKey === key) {
          callback(newValue, oldValue);
        }
      }
    });
  }
}

const browserStorage = new BrowserStorage();

export default browserStorage;
