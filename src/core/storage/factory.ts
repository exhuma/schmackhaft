import { BookmarkStorage } from "./bookmarks";
import { Browser } from "../types";
import { HttpStorage } from "./http";
import { IStorage } from "../../types";
import { LocalStorage } from "./local";
import { Settings } from "../model/settings";

/**
 * Create an instance of bookmarks storage.
 *
 * The effective location where the bookmarks are stored & loaded from depends
 * on the type.
 *
 * @param settings A user-settings object
 * @param type The type of storage we want to create
 * @param browser A reference to the browser API (if available)
 * @returns A storage instance
 */
export function createStorage(
  settings: Settings,
  type: string,
  browser: Browser | null
): IStorage {
  if (type === "local") {
    return new LocalStorage(settings, browser);
  } else if (type === "http") {
    return new HttpStorage(settings, browser);
  } else if (type === "bookmarks") {
    return new BookmarkStorage(settings, browser);
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }
}
