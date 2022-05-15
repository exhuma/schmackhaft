import * as browser from "webextension-polyfill";
import { IStorageBackend } from "../types";

export class Settings {
  backend: any;
  static async default() {
    let settings = new Settings(browser.storage.local);
    let current = await settings.getAll();
    // TODO ideally this would loop over all migrations and apply everything
    // that's necessary.
    let migrationName = `migrate_${current.version}_to_${current.version+1}`;
    let migrator = new Migrator();
    let migrationFunction = migrator[migrationName];
    if (migrationFunction) {
      await settings.replace(migrationFunction(current));
    } else {
      console.debug(`No migration function ${migrationName} is defined!`)
    }
    return settings;
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

  async getAll(): Promise<any> {
    let result = await this.backend.get({
      settings: {},
    });
    return result.settings;
  }
}


class Migrator {
  migrate_1_to_2(settings: any): any {
    if (settings.version !== 1) {
      throw new Error(`Expected to version 1 for the migration to 2, but got ${settings.version} instead`);
    }
    let newData = {
      remoteUrls: [settings.remoteUrl],
      enableBrowserBookmarks: true,
      version: 2,
    }
    return newData;
  }
}