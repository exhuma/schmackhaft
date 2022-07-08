/**
 * This file contains supporting JS code for the browser-extension sidebar
 */
import * as browser from "webextension-polyfill";
import { HMRequest } from "../../types";
import { Schmackhaft } from "../../components/app-schmackhaft";

/**
 * Open a new tab in the browser with the documentation
 */
function showHelp(): void {
  browser.tabs.create({
    active: true,
    url: "/pages/README.html",
  });
}

/**
 * Trigger a refresh of the bookmarks by sending a message to the extension
 * backend
 */
function refreshBookmarks(): void {
  displayToast("Loading...");
  browser.runtime
    .sendMessage({
      method: "getBookmarks",
    })
    .then(onBookmarksRetrieved, handleError)
    .catch((error) => {
      hideToast();
      console.error(error);
    });
}

/**
 * Process the response from the "getBookmarks" message
 * @param response A response message from the extension messaging system
 */
function onBookmarksRetrieved(response: string): void {
  hideToast();
  displayTimedToast("done", 1000);
  let element = document.getElementById("schmackhaft") as Schmackhaft;
  if (!response) {
    console.error("Invalid (empty) response from the background.");
  }
  element.links = JSON.stringify(response);
}

/**
 * Handle an error retrieved from the extension messaging system
 */
function handleError(): void {
  hideToast();
  console.error({ error_args: arguments });
}

/**
 * Handle any message from the browser extension spec
 * @param request See the browser extension spec
 * @param sender  See the browser extension spec
 * @param sendResponse  See the browser extension spec
 */
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

let helpButton = document.getElementById("HelpButton");
helpButton.addEventListener("click", () => {
  showHelp();
});

document.addEventListener("DOMContentLoaded", refreshBookmarks);
