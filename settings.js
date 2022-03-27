export class Settings {
  static default() {
    return new Settings(browser.storage.local);
  }

  constructor(backend) {
    this.backend = backend;
  }

  async replace(newObject) {
    await this.backend.set({
      settings: newObject,
    });
  }

  async get(key, fallback) {
    let result = await this.backend.get({
      settings: {},
    });
    let output = result?.settings[key] || fallback;
    return output;
  }
}
