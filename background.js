import { createStorage } from "./storage/factory.js";

const COLLECTIONS = ["local", "http"];
const TARGET_COLLECTION = "local";

function handleClick() {
  console.log({ app: APP, links: APP.links });
}

async function removeBookmark(href) {
  let promises = COLLECTIONS.map(async (type) => {
    let storage = createStorage(type);
    await storage.remove(href);
  });
  await Promise.all(promises);
}

async function storeBookmark(bookmark) {
  let storage = createStorage(TARGET_COLLECTION);
  let persistentItem = await storage.get(bookmark.href);
  if (persistentItem) {
    persistentItem.title = bookmark.title;
    persistentItem.tags = bookmark.tags;
  } else {
    persistentItem = bookmark;
  }
  await storage.put(persistentItem);
}

async function handleMessage(request, sender, sendResponse) {
  try {
    if (request.method === "getBookmarks") {
      let output = [];
      let promises = COLLECTIONS.map(async (type) => {
        let storage = createStorage(type);
        let bookmarks = await storage.getAll();
        output = [...output, ...bookmarks];
      });
      await Promise.all(promises);
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

browser.pageAction.onClicked.addListener(handleClick);
browser.runtime.onMessage.addListener(handleMessage);
