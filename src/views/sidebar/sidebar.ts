import * as browser from "webextension-polyfill";
import { Schmackhaft } from "../../components/app-schmackhaft";
import { HMRequest } from "../../types";

function refreshBookmarks(): void {
  browser.runtime
    .sendMessage({
      method: "getBookmarks",
    })
    .then(onBookmarksRetrieved, handleError)
    .catch(console.error);
}

function onBookmarksRetrieved(response: string): void {
  let element = document.getElementById("schmackhaft") as Schmackhaft;
  if (!response) {
    console.error("Invalid (empty) response from the background.");
  }
  element.links = JSON.stringify(response);
}

function handleError(): void {
  console.error({ error_args: arguments });
}

function handleMessage(request: HMRequest, sender, sendResponse) {
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

document.addEventListener("DOMContentLoaded", refreshBookmarks);
