import { Bookmark, IStorage, TBrowserFactory } from "../../types";

export class StaticStorage implements IStorage {
  settings: object;
  browserFactory: TBrowserFactory;

  constructor(settings: any, browserFactory: TBrowserFactory) {
    this.settings = settings;
    this.browserFactory = browserFactory;
  }

  async get(href: string): Promise<Bookmark | null> {
    console.log(`getting ${href}`);
    return null;
    // let browser = await this.browserFactory();
    // if (browser === null) {
    //   console.debug(
    //     "Not running as browser-extension. Extension Storage is disabled!"
    //   );
    //   return null;
    // }
    // let result = await browser.storage.local.get({ bookmarks: {} });
    // return result.bookmarks[href] || null;
  }

  async getAll(): Promise<Bookmark[]> {
    console.log(`getting all`);
    return [];
    // let browser = await this.browserFactory();
    // if (browser === null) {
    //   console.debug(
    //     "Not running as browser-extension. Extension Storage is disabled!"
    //   );
    //   return [];
    // }
    // let result = await browser.storage.local.get({ bookmarks: {} });
    // return Object.values(result.bookmarks);
  }

  async put(data: Bookmark): Promise<void> {
    console.log(`putting ${JSON.stringify(data)}`);
    return;
    // let browser = await this.browserFactory();
    // if (browser === null) {
    //   console.debug(
    //     "Not running as browser-extension. Extension Storage is disabled!"
    //   );
    //   return;
    // }
    // let result = await browser.storage.local.get({ bookmarks: {} });
    // result.bookmarks[data.href] = data;
    // await browser.storage.local.set({ bookmarks: result.bookmarks });
  }

  async remove(href: string): Promise<void> {
    console.log(`removing ${href}`);
    return;
    // let browser = await this.browserFactory();
    // if (browser === null) {
    //   console.debug(
    //     "Not running as browser-extension. Extension Storage is disabled!"
    //   );
    //   return;
    // }
    // let result = await browser.storage.local.get({ bookmarks: {} });
    // delete result.bookmarks[href];
    // await browser.storage.local.set({ bookmarks: result.bookmarks });
  }
}
