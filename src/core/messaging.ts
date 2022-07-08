/**
 * Central entry-point for browser-extension messaging handling
 */
import * as browser from "webextension-polyfill";

import { Bookmark, HMRequest } from "../types";
import { SettingsBridge } from "./settings";
import { createStorage } from "./storage/factory";

const TARGET_COLLECTION = "local";

/**
 * Retrieve a list of storage backend names which contain the bookmarks
 *
 * @param settings An object providing access to the application settings.
 * @returns A list of all enabled sources of bookmarks
 */
async function getCollections(settings: SettingsBridge): Promise<string[]> {
  let enableBrowserBookmarks = await settings.get("enableBrowserBookmarks");
  let output = ["local", "http"];
  if (enableBrowserBookmarks) {
    output.push("bookmarks");
  }
  return output;
}

/**
 * Remove a single bookmark from each configured collection
 *
 * @param href The URL of the bookmark we want to remove
 */
async function removeBookmark(href: string): Promise<void> {
  let settings = await SettingsBridge.default();
  let collections = await getCollections(settings);
  let promises = collections.map(async (type) => {
    let storage = createStorage(settings, type, browser);
    await storage.remove(href);
  });
  await Promise.all(promises);
}

/**
 * Add a new bookmark to the default storage
 *
 * @param bookmark The bookmark to store
 */
async function storeBookmark(bookmark: Bookmark): Promise<void> {
  let settings = await SettingsBridge.default();
  let storage = createStorage(settings, TARGET_COLLECTION, browser);
  let persistentItem = await storage.get(bookmark.href);
  if (persistentItem) {
    persistentItem.title = bookmark.title;
    persistentItem.tags = bookmark.tags;
  } else {
    persistentItem = bookmark;
  }
  await storage.put(persistentItem);
}

/**
 * Fetch all bookmarks from all the configured storage backends
 *
 * @returns A list of all bookmarks
 */
async function readAllStorages(): Promise<Bookmark[]> {
  let output = [];
  let promises = collections.map(async (type) => {
    let storage = createStorage(settings, type, browser);
    console.info(`Requesting bookmarks from ${type}`);
    let bookmarks = await storage.getAll();
    output = [...output, ...bookmarks];
  });
  await Promise.all(promises);
  return output;
}

/**
 * Handle a single message from the browser extension. See the official spec for
 * more information
 *
 * @param request See the browser extension spec
 * @param sender See the browser extension spec
 * @param sendResponse See the browser extension spec
 * @returns See the browser extension spec
 */
export async function handleMessage(request: HMRequest, sender, sendResponse) {
  let settings = await SettingsBridge.default();
  let collections = await getCollections(settings);
  try {
    if (request.method === "getBookmarks") {
      let output = await readAllStorages();
      return output;
    } else if (request.method === "addBookmark") {
      await storeBookmark(request.args);
      browser.runtime.sendMessage({
        method: "bookmarksModified",
      });
    } else if (request.method === "removeBookmark") {
      await removeBookmark(request.args.href);
      browser.runtime.sendMessage({
        method: "bookmarksModified",
      });
    } else {
      console.error(`Unknown request: ${request.method}`);
    }
  } catch (error) {
    console.error(error);
  }
}
