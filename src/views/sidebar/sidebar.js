browser.runtime.getBackgroundPage().then((background) => {
  refreshBookmarks();
});

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
let refreshButton = document.getElementById("RefreshButton");
refreshButton.addEventListener("click", () => {
  refreshBookmarks();
});
