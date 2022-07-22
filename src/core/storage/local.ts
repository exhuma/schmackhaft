import { Bookmark, Browser, IStorage } from "../../types";

export class LocalStorage implements IStorage {
  settings: Settings;
  browser: Browser;

  constructor(settings: { browser: Browser }) {
    this.settings = settings;
    if (!settings.browser) {
      throw new Error("Settings object is missing the browser attribute");
    }
    this.browser = settings.browser;
  }

  async get(href: string): Promise<Bookmark | null> {
    if (this.browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return null;
    }
    let result = await this.browser.storage.local.get({ bookmarks: {} });
    return result.bookmarks[href] || null;
  }

  async getAll(): Promise<Bookmark[]> {
    if (this.browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return [];
    }
    let result = await this.browser.storage.local.get({ bookmarks: {} });
    return Object.values(result.bookmarks);
  }

  async put(data: Bookmark): Promise<void> {
    if (this.browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return;
    }
    let result = await this.browser.storage.local.get({ bookmarks: {} });
    result.bookmarks[data.href] = data;
    await this.browser.storage.local.set({ bookmarks: result.bookmarks });
  }

  async remove(href: string): Promise<void> {
    if (this.browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return;
    }
    let result = await this.browser.storage.local.get({ bookmarks: {} });
    delete result.bookmarks[href];
    await this.browser.storage.local.set({ bookmarks: result.bookmarks });
  }
}
