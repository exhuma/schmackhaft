import { Bookmark, IStorage, TBrowserFactory, TFetcher } from "../../types";

export class LocalStorage implements IStorage {
  settings: object;
  browserFactory: TBrowserFactory;
  fetch: TFetcher;

  constructor(settings: any, browserFactory: TBrowserFactory, fetch: TFetcher) {
    this.settings = settings;
    this.browserFactory = browserFactory;
    this.fetch = fetch;
  }

  async get(href: string): Promise<Bookmark | null> {
    let browser = await this.browserFactory();
    if (browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return null;
    }
    let result = await browser.storage.local.get({ bookmarks: {} });
    return result.bookmarks[href] || null;
  }

  async getAll(): Promise<Bookmark[]> {
    let browser = await this.browserFactory();
    if (browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return [];
    }
    let result = await browser.storage.local.get({ bookmarks: {} });
    return Object.values(result.bookmarks);
  }

  async put(data: Bookmark): Promise<void> {
    let browser = await this.browserFactory();
    if (browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return;
    }
    let result = await browser.storage.local.get({ bookmarks: {} });
    result.bookmarks[data.href] = data;
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }

  async remove(href: string): Promise<void> {
    let browser = await this.browserFactory();
    if (browser === null) {
      console.debug(
        "Not running as browser-extension. Extension Storage is disabled!"
      );
      return;
    }
    let result = await browser.storage.local.get({ bookmarks: {} });
    delete result.bookmarks[href];
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }
}
