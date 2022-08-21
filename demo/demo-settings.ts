import { BookmarkSource } from "../src/types";
import { FullScreenSettings } from "../src/views/sh-fullscreen-settings";
import { Settings } from "../src/model/settings";

let settings = new Settings(
  [
    {
      type: BookmarkSource.HTTP,
      settings: {
        url: "https://github.com/exhuma/dotfiles/bookmarks.json",
      },
    },
    {
      type: BookmarkSource.BROWSER,
      settings: {
        foo: "bar",
      },
    },
    {
      type: BookmarkSource.EXTENSION_STORAGE,
      settings: {
        bar: "baz",
      },
    },
  ],
  3,
  "http://domain.of.favicon.service/{domain}"
);

/**
 *
 */
export function initUI() {
  let element = document.getElementById("TheSettings") as FullScreenSettings;
  if (element !== null) {
    element.settings = settings.toJson();
    element.addEventListener("change", console.log);
  }
}
