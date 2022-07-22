import { Bookmark, Browser, IStorage } from "../../types";

export class LocalStorage implements IStorage {
  settings: Settings;
  browser: Browser | null;

  constructor(settings: any, browser: Browser | null) {
    this.settings = settings;
    this.browser = browser;
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
