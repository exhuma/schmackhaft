import * as browser from "webextension-polyfill";
import { Schmackhaft } from "../../components/app-schmackhaft";
import { HMRequest } from "../../types";

function displayToast(text) {
  let toast = document.getElementById("Toast");
  toast.innerText = text;
  toast.style.display = "block";
}

function displayTimedToast(text, timeout) {
  let toast = document.getElementById("Toast");
  toast.innerText = text;
  toast.style.display = "block";
  window.setTimeout(hideToast, timeout);
}

function hideToast() {
  let toast = document.getElementById("Toast");
  toast.innerText = "";
  toast.style.display = "none";
}

function showHelp(): void {
  browser.tabs.create({
    active: true,
    url: "/pages/README.html"
  })
}

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

function onBookmarksRetrieved(response: string): void {
  hideToast();
  displayTimedToast("done", 1000);
  let element = document.getElementById("schmackhaft") as Schmackhaft;
  if (!response) {
    console.error("Invalid (empty) response from the background.");
  }
  element.links = JSON.stringify(response);
}

function handleError(): void {
  hideToast();
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

let helpButton = document.getElementById("HelpButton");
helpButton.addEventListener("click", () => {
  showHelp();
});

document.addEventListener("DOMContentLoaded", refreshBookmarks);
