import { Bookmark, Browser, IStorage } from "../../types";

export class HttpStorage implements IStorage {
  settings: any;
  browser: Browser | null;

  constructor(settings: any, browser: Browser | null) {
    this.settings = settings;
    this.browser = browser;
  }
  async get(href: string): Promise<Bookmark | null> {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll(): Promise<Bookmark[]> {
    if (!this.settings.url || this.settings.url === "") {
      return [];
    }
    let result = await fetch(this.settings.url);
    let data = [];
    if (result.ok) {
      data = await result.json();
    } else {
      console.info(
        `Error retrieving ${this.settings.url}: ${result.status} ${result.statusText}`
      );
    }
    return data;
  }

  async put(data: Bookmark): Promise<void> {
    return;
  }

  async remove(href: string): Promise<void> {
    return;
  }
}
