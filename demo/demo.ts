import "../src/views/sh-settings";
import "../src/components/layout-vsplit";
import { BookmarkSource } from "../src/types";
import { FakeBrowser } from "./fake-browser";
import { Schmackhaft } from "../src/app-schmackhaft";
import { Settings } from "../src/model/settings";
import { Settings as SettingsElement } from "../src/views/sh-settings";

/**
 * Initialise the HTML elements which are used to play with the component
 * settings
 */
function initSettingsUI() {
  let settingsElementV1 = document.getElementById(
    "SettingsV1"
  ) as SettingsElement;
  let settingsElementV2 = document.getElementById(
    "SettingsV2"
  ) as SettingsElement;
  settingsElementV2.settings = JSON.stringify({
    remoteUrls: [
      "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
      "https://demo-2.json",
    ],
    enableBrowserBookmarks: true,
    version: 2,
  });
  settingsElementV2.addEventListener("change", (event) => {
    let evt = event as CustomEvent;
    console.log(JSON.parse(evt.detail["settings"]));
  });

  settingsElementV1.settings = JSON.stringify({
    remoteUrl:
      "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
    version: 1,
  });
}

/**
 * Initialise a core "schmackhaft custom-element"
 */
function initSchmackhaftUI() {
  let bookmarksElement = document.getElementById("schmackhaft") as Schmackhaft;

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
      {
        type: BookmarkSource.BROWSER,
        settings: {},
      },
      {
        type: BookmarkSource.EXTENSION_STORAGE,
        settings: {},
      },
    ],
    3
  );
  bookmarksElement.settings = settings.toJson();
  bookmarksElement?.addEventListener("settingsChanged", (event) => {
    let evt = event as CustomEvent;
    console.log("Settings Changed to:");
    console.log(JSON.parse(evt.detail["settings"]));
  });
  bookmarksElement.injections = { getBrowser: async () => new FakeBrowser() };
}

/**
 * Toggle the visibility of a single element with the "togglable" class.
 *
 * All "togglable" elements will be hidden *except* the one with the given
 * SGML-ID
 *
 * @param id The ID of the element which should become/remain visible.
 */
function toggleDiv(id: string): void {
  document.querySelectorAll(".toggleable").forEach((element) => {
    let elmt = element as HTMLElement;
    let currentName = elmt.id;
    let displayValue = id === currentName ? "block" : "none";
    elmt.style.display = displayValue;
  });
}

/**
 * Delegate click events to the visibility "toggler". The clicked element *must*
 * have the attribute "data-div" with the SGML-ID as value of the element that
 * should be displayed.
 *
 * @param evt A click-event from the browser
 */
function onTabClicked(evt: Event) {
  let enabledName = evt.target.dataset["div"];
  toggleDiv(enabledName);
}

/**
 * Update bookmarks from an external JSON file
 *
 * @param url The URL from which to fetch the JSON
 */
async function reloadJson(url: string) {
  if (url === undefined || url.trim() === "") {
    return;
  }
  let bookmarksElement = document.getElementById("schmackhaft") as Schmackhaft;
  let settings = new Settings([
    {
      type: BookmarkSource.HTTP,
      settings: {
        url: url,
      },
    },
  ]);
  bookmarksElement.settings = settings.toJson();
}

/**
 * Initialise the elements in the demo-page toolbar
 */
function initToolbar() {
  document.getElementById("ReloadJsonButton").addEventListener("click", () => {
    let txtJsonFile = document.getElementById(
      "ExternalJsonFile"
    ) as HTMLInputElement;
    let url = txtJsonFile.value;
    reloadJson(url);
  });

  let txtJsonFile = document.getElementById("ExternalJsonFile");
  txtJsonFile.addEventListener("change", async (evt) => {
    let target = evt.target as HTMLInputElement;
    let url = target.value;
    reloadJson(url);
  });

  document.querySelectorAll(".clickable").forEach((element) => {
    element.addEventListener("click", onTabClicked);
  });
}

/**
 * Initialise all UI elements for the demo page
 */
export function initUI() {
  initSettingsUI();
  initSchmackhaftUI();
  initToolbar();
  toggleDiv("Bookmarks");
}
