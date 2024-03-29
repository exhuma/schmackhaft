import { BookmarkSource, TBookmarkSource, TSettings } from "../types";

const LATEST_VERSION = 3;

/**
 * A simple data-class representing application settings.
 *
 * It provides convenience functions to convert to/from JSON
 */
export class Settings {
  sources: TBookmarkSource[];
  version: number;
  favIconTemplate: string = "";

  constructor(
    sources: TBookmarkSource[] = [],
    version: number = LATEST_VERSION,
    favIconTemplate: string = ""
  ) {
    this.sources = sources;
    this.version = version;
    this.favIconTemplate = favIconTemplate;
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromJson(data: string): Settings {
    let dataObject = JSON.parse(data);
    if (
      dataObject &&
      Object.keys(dataObject).length === 0 &&
      Object.getPrototypeOf(dataObject) === Object.prototype
    ) {
      console.debug("Initialised empty settings object");
      return new Settings();
    }
    dataObject = Migrator.upgrade(dataObject);
    if (dataObject.version !== LATEST_VERSION) {
      throw new Error(
        `Settings version ${dataObject.version} is currently unsupported. Required version = ${LATEST_VERSION}`
      );
    }
    return new Settings(
      dataObject.sources,
      dataObject.version,
      dataObject.favIconTemplate
    );
  }
}

/**
 * The Migrator class encapsulates the logic to "upgrade" old settings
 * structures to newer versions without losing any data.
 */
class Migrator {
  /**
   * Upgrade the *settings* object to the latest version and return the
   * resulting object
   *
   * @param settings The current settings object
   * @returns The upgraded settings object
   */
  static upgrade(settings: any): any {
    // @ts-ignore
    let func =
      Migrator[`migrate_${settings.version}_to_${settings.version + 1}`];
    while (func !== undefined) {
      settings = func(settings);
      // @ts-ignore
      func = Migrator[`migrate_${settings.version}_to_${settings.version + 1}`];
    }
    return settings;
  }

  static migrate_1_to_2(settings: any): any {
    if (settings.version !== 1) {
      throw new Error(
        `Expected to version 1 for the migration to 2, but got ${settings.version} instead`
      );
    }
    let newData = {
      remoteUrls: [settings.remoteUrl],
      enableBrowserBookmarks: true,
      version: 2,
    };
    return newData;
  }

  static migrate_2_to_3(settings: any): any {
    if (settings.version !== 2) {
      throw new Error(
        `Expected to version 2 for the migration to 3, but got ${settings.version} instead`
      );
    }
    let sources: TBookmarkSource[] = [];
    if (settings.enableBrowserBookmarks) {
      sources.push({
        type: BookmarkSource.BROWSER,
        settings: {},
      });
    }
    settings.remoteUrls.forEach((item: string) => {
      sources.push({
        type: BookmarkSource.HTTP,
        settings: {
          url: item,
        },
      });
    });
    let newData: TSettings = {
      sources: sources,
      version: 3,
    };
    return newData;
  }
}
