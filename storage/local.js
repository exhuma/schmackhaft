export class LocalStorage {
  constructor(config) {
    this.config = config;
  }

  async get(href) {
    let result = await browser.storage.local.get({ bookmarks: {} });
    return result.bookmarks[href] || null;
  }

  async getAll() {
    let result = await browser.storage.local.get({ bookmarks: {} });
    return Object.values(result.bookmarks);
  }

  async put(data) {
    let result = await browser.storage.local.get({ bookmarks: {} });
    result.bookmarks[data.href] = data;
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }

  async remove(href) {
    let result = await browser.storage.local.get({ bookmarks: {} });
    delete result.bookmarks[href];
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }
}
