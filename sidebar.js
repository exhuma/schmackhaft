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
  element.links = JSON.stringify(response);
}

function handleError() {
  console.log({ error_args: arguments });
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
