import "../src/components/views/sh-settings";
import "../src/components/components/layout-vsplit";
import { BookmarkSource } from "../src/types";
import { Settings } from "../src/model/settings";
import { SettingsBridge } from "../src/core/settings";

let settingsElementV1 = document.getElementById("SettingsV1") as SettingsBridge;
let settingsElementV2 = document.getElementById("SettingsV2") as SettingsBridge;
settingsElementV2.settings = JSON.stringify({
  remoteUrls: [
    "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
    "https://demo-2.json",
  ],
  enableBrowserBookmarks: true,
  version: 2,
});
settingsElementV2.addEventListener("change", (event) => {
  console.log(JSON.parse(event.detail["settings"]));
});

settingsElementV1.settings = JSON.stringify({
  remoteUrl:
    "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
  version: 1,
});

let bookmarksElement = document.getElementById("schmackhaft");

// We can't use the default settings bridge here, because this only works in a
// browser-extension execution context.
let settings = new Settings(
  [
    {
      type: BookmarkSource.HTTP,
      settings: {
        url: "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
      },
    },
    {
      type: BookmarkSource.HTTP,
      settings: {
        url: "https://raw.githubusercontent.com/exhuma/schmackhaft/e6439061eedd24c50e00e8b2374ec50d376bc6e5/docs/examples/external-file.json",
      },
    },
  ],
  3
);
bookmarksElement.settings = settings.toJson();
bookmarksElement?.addEventListener("settingsChanged", (event) => {
  console.log("Settings Changed to:");
  console.log(JSON.parse(event.detail["settings"]));
});

/**
 * Ensure only the div related to the clicked link is visible
 *
 * @param evt A click-event from the browser
 */
function toggleDiv(evt) {
  let enabledName = evt.target.dataset["div"];
  document.querySelectorAll(".toggleable").forEach((element) => {
    let currentName = element.id;
    let displayValue = enabledName === currentName ? "block" : "none";
    element.style.display = displayValue;
  });
}

document.querySelectorAll(".clickable").forEach((element) => {
  element.addEventListener("click", toggleDiv);
});

/**
 * Update bookmarks from an external JSON file
 *
 * @param url The URL from which to fetch the JSON
 */
async function reloadJson(url) {
  if (url === undefined || url.trim() === "") {
    return;
  }
  let response = await fetch(url);
  if (!response.ok) {
    console.error(`Unable to fetch ${url} (${response.statusText})`);
    return;
  }
  let text = await response.text();
  let bookmarksElement = document.getElementById("schmackhaft");
  bookmarksElement.links = text;
}

document.getElementById("ReloadJsonButton").addEventListener("click", () => {
  let txtJsonFile = document.getElementById("ExternalJsonFile");
  let url = txtJsonFile.value;
  reloadJson(url);
});

let txtJsonFile = document.getElementById("ExternalJsonFile");
txtJsonFile.addEventListener("change", async (evt) => {
  let url = evt.target.value;
  reloadJson(url);
});

document.querySelector(".toggleable").style.display = "block";
