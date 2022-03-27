import { createStorage } from "./storage/factory.js";

function handleClick() {
  console.log({ app: APP, links: APP.links });
}

async function handleMessage(request, sender, sendResponse) {
  try {
    if (request.method === "getBookmarks") {
      let storage = createStorage("local");
      let bookmarks = await storage.get();
      return bookmarks;
    } else if (request.method === "addBookmark") {
      let storage = createStorage("local");
      await storage.put(request.args);
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
