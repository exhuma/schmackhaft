import { BookmarkSource, IStorage, TBrowserFactory } from "../../types";
import { BookmarkStorage } from "./bookmarks";
import { HttpStorage } from "./http";
import { LocalStorage } from "./local";
import { StaticStorage } from "./static";

/**
 * Create an instance of bookmarks storage.
 *
 * The effective location where the bookmarks are stored & loaded from depends
 * on the type.
 *
 * @param type The type of storage we want to create
 * @param settings A user-settings object
 * @param browserFactory A factory method to get a reference to the
 *   browser-extension API
 * @returns A storage instance
 */
export function createStorage(
  type: BookmarkSource,
  settings: any,
  browserFactory: TBrowserFactory
): IStorage {
  switch (type) {
    case BookmarkSource.EXTENSION_STORAGE:
      return new LocalStorage(settings, browserFactory);
    case BookmarkSource.HTTP:
      return new HttpStorage(settings, browserFactory);
    case BookmarkSource.BROWSER:
      return new BookmarkStorage(settings, browserFactory);
    case BookmarkSource.STATIC:
      return new StaticStorage(settings, browserFactory);
    default:
      throw new Error(`Unsupported storage type: ${type}`);
  }
}
