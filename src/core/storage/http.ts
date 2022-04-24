import { Bookmark, IStorage } from "../../types";
import { Settings } from "../settings";

export class HttpStorage implements IStorage {
  settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }
  async get(href: string): Promise<Bookmark | null> {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll(): Promise<Bookmark[]> {
    let remoteUrl = await this.settings.get("remoteUrl");
    if (!remoteUrl || remoteUrl === "") {
      return [];
    }
    let result = await fetch(remoteUrl);
    let data = await result.json();
    return data;
  }

  async put(data: Bookmark): Promise<void> {
    return;
  }

  async remove(href: string): Promise<void> {
    return;
  }
}
