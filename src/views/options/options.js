import { Settings } from "../../core/settings.js";

async function saveSettings() {
  let url = document.getElementById("RemoteBookmarkURL").value;
  let settings = Settings.default();
  await settings.replace({ version: 1, remoteUrl: url });
}

async function restoreSettings() {
  let settings = Settings.default();
  let remoteUrl = await settings.get("remoteUrl");
  if (remoteUrl && remoteUrl !== "") {
    document.getElementById("RemoteBookmarkURL").value = remoteUrl;
  }
}

document.getElementById("SaveButton").addEventListener("click", saveSettings);
restoreSettings();
