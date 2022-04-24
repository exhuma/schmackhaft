import * as browser from "webextension-polyfill";
import { IStorageBackend } from "../types";

export class Settings {
  backend: any;
  static default() {
    return new Settings(browser.storage.local);
  }

  constructor(backend: IStorageBackend) {
    this.backend = backend;
  }

  async replace(newObject) {
    await this.backend.set({
      settings: newObject,
    });
  }

  async get(key: string, fallback: any = null): Promise<any> {
    let result = await this.backend.get({
      settings: {},
    });
    let output = result?.settings[key] || fallback;
    return output;
  }
}
