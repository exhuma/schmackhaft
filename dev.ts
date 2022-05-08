import "./src/components/views/sh-settings";
import { Settings } from "./src/components/views/sh-settings";
let settingsElement = document.getElementById("Settings") as Settings;
settingsElement.settings = JSON.stringify({
  remoteUrl:
    "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
  version: 1,
});
settingsElement.addEventListener("change", (event) => {
  console.log(event.detail);
});
