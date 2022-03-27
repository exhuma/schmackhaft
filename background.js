import { createStorage } from "./storage/factory.js";

function handleClick() {
  console.log({ app: APP, links: APP.links });
}

async function removeBookmark(href) {
  let storage = createStorage("local");
  await storage.remove(href);
}

async function storeBookmark(bookmark) {
  let storage = createStorage("local");
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
      let storage = createStorage("local");
      let bookmarks = await storage.getAll();
      return bookmarks;
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
