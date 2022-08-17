// @ts-ignore
import * as browser from "webextension-polyfill";
import { IStorageBackend, TSettings } from "../types";

/**
 * A bridge to a "storage" for application settings.
 */
export class SettingsBridge {
  backend: any;
  static async default() {
    let settings = new SettingsBridge(browser.storage.local);
    return settings;
  }

  constructor(backend: IStorageBackend) {
    this.backend = backend;
  }

  async replace(newObject: TSettings) {
    await this.backend.set({
      settings: newObject,
    });
  }

  async get(key: string, fallback: any = null): Promise<any> {
    let result = await this.backend.get({
      settings: {},
    });
    let output = result?.settings[key];
    if (output === undefined) {
      return fallback;
    }
    return output;
  }

  async getAll(): Promise<any> {
    let result = await this.backend.get({
      settings: {},
    });
    return result.settings;
  }

  setAll(settings: object) {
    this.backend.set({
      settings: settings,
    });
  }
}
