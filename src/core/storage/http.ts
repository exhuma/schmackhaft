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
    let remoteUrls = await this.settings.get("remoteUrls");
    let output = [];
    let promises = remoteUrls.map(async (remoteUrl) => {
      if (!remoteUrl || remoteUrl === "") {
        return;
      }
      let result = await fetch(remoteUrl);
      let data = await result.json();
      output = [...output, ...data];
    })
    await Promise.all(promises);
    return output;
  }

  async put(data: Bookmark): Promise<void> {
    return;
  }

  async remove(href: string): Promise<void> {
    return;
  }
}
