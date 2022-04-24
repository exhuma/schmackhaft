import * as browser from "webextension-polyfill";

function refreshBookmarks() {
  browser.runtime
    .sendMessage({
      method: "getBookmarks",
    })
    .then(onBookmarksRetrieved, handleError)
    .catch(console.error);
}

function onBookmarksRetrieved(response) {
  let element = document.getElementById("schmackhaft");
  if (!response) {
    console.error("Invalid (empty) response from the background.");
  }
  element.links = JSON.stringify(response);
}

function handleError() {
  console.error({ error_args: arguments });
}

function handleMessage(request, sender, sendResponse) {
  if (request.method === "bookmarksModified") {
    refreshBookmarks();
  } else {
    console.debug(
      `Ignoring unknown message-type for the sidebar: ${request.method}`
    );
  }
}

browser.runtime.onMessage.addListener(handleMessage);
browser.runtime
  .getBackgroundPage()
  .then((background) => {
    refreshBookmarks();
  })
  .catch(() => {
    console.debug("Error retrieving the background page!");
  });

let refreshButton = document.getElementById("RefreshButton");
refreshButton.addEventListener("click", () => {
  refreshBookmarks();
});
