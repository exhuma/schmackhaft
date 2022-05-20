import "../src/components/views/sh-settings";
import { Settings } from "../src/components/views/sh-settings";
import { Links } from "../src/components/core/links";
import { Link } from "../src/components/model/link";

let settingsElementV1 = document.getElementById("SettingsV1") as Settings;
let settingsElementV2 = document.getElementById("SettingsV2") as Settings;
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
  remoteUrl: "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
  version: 1,
});

let tagListElement = document.getElementById("TagList");
tagListElement.links = new Links([
  new Link(
    "https://example.com",
    ["tag1", "tag2"],
    "Example Link",
    "image-url",
    "description"
    )
  ]
)
