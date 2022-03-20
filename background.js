const BOOKMARKS = [
  { href: "https://example.com/from-backend", tags: ["backend"] },
  { href: "https://google.com", tags: ["search"] },
  { href: "https://bluesnews.com", tags: ["news"] },
];

function handleClick() {
  console.log({ app: APP, links: APP.links });
}

function handleMessage(request, sender, sendResponse) {
  if (request.method === "getBookmarks") {
    sendResponse(BOOKMARKS);
  } else if (request.method === "addBookmark") {
    BOOKMARKS.push({
      href: request.args.href,
      tags: ["from-popup"],
      title: request.args.title,
    });
    browser.runtime.sendMessage({
      method: "bookmarksModified",
    });
  } else {
    console.error(`Unknown request: ${request.method}`);
  }
}

browser.pageAction.onClicked.addListener(handleClick);
browser.runtime.onMessage.addListener(handleMessage);
