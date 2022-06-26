import * as browser from "webextension-polyfill";

import { createStorage } from "./storage/factory";
import { Settings } from "./settings";
import { Bookmark, HMRequest } from "../types";

const TARGET_COLLECTION = "local";

async function getCollections(settings: Settings): Promise<string[]> {
  let enableBrowserBookmarks = await settings.get("enableBrowserBookmarks");
  let output = ["local", "http"]
  if (enableBrowserBookmarks) {
    output.push("bookmarks");
  }
  return output;
}

async function removeBookmark(href: string): Promise<void> {
  let settings = await Settings.default();
  let collections = await getCollections(settings);
  let promises = collections.map(async (type) => {
    let storage = createStorage(settings, type);
    await storage.remove(href);
  });
  await Promise.all(promises);
}

async function storeBookmark(bookmark: Bookmark): Promise<void> {
  let settings = await Settings.default();
  let storage = createStorage(settings, TARGET_COLLECTION);
  let persistentItem = await storage.get(bookmark.href);
  if (persistentItem) {
    persistentItem.title = bookmark.title;
    persistentItem.tags = bookmark.tags;
  } else {
    persistentItem = bookmark;
  }
  await storage.put(persistentItem);
}

async function readAllStorages() {
      let output = [];
      let promises = collections.map(async (type) => {
        let storage = createStorage(settings, type);
        console.info(`Requesting bookmarks from ${type}`);
        let bookmarks = await storage.getAll();
        output = [...output, ...bookmarks];
      });
      await Promise.all(promises);
      return output;

}

export async function handleMessage(request: HMRequest, sender, sendResponse) {
  let settings = await Settings.default();
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
