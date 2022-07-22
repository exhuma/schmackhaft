import { BookmarkSource, Browser, IStorage } from "../../types";
import { BookmarkStorage } from "./bookmarks";
import { HttpStorage } from "./http";
import { LocalStorage } from "./local";

/**
 * Create an instance of bookmarks storage.
 *
 * The effective location where the bookmarks are stored & loaded from depends
 * on the type.
 *
 * @param type The type of storage we want to create
 * @param settings A user-settings object
 * @param browser
 * @returns A storage instance
 */
export function createStorage(
  type: BookmarkSource,
  settings: any,
  browser: Browser | null
): IStorage {
  switch (type) {
    case BookmarkSource.EXTENSION_STORAGE:
      return new LocalStorage(settings, browser);
    case BookmarkSource.HTTP:
      return new HttpStorage(settings, browser);
    case BookmarkSource.BROWSER:
      return new BookmarkStorage(settings, browser);
    default:
      throw new Error(`Unsupported storage type: ${type}`);
  }
}
