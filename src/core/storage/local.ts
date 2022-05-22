import * as browser from "webextension-polyfill";
import { Bookmark, IStorage } from "../../types";
import { Settings } from "../settings";

export class LocalStorage implements IStorage {
  settings: Settings;
  constructor(settings: Settings) {
    this.settings = settings;
  }

  async get(href: string): Promise<Bookmark | null> {
    let result = await browser.storage.local.get({ bookmarks: {} });
    return result.bookmarks[href] || null;
  }

  async getAll(): Promise<Bookmark[]> {
    let result = await browser.storage.local.get({ bookmarks: {} });
    return Object.values(result.bookmarks);
  }

  async put(data: Bookmark): Promise<void> {
    let result = await browser.storage.local.get({ bookmarks: {} });
    result.bookmarks[data.href] = data;
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }

  async remove(href: string): Promise<void> {
    let result = await browser.storage.local.get({ bookmarks: {} });
    delete result.bookmarks[href];
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }
}
