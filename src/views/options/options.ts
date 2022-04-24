import { Settings } from "../../core/settings";

async function saveSettings(): Promise<void> {
  let element = document.getElementById(
    "RemoteBookmarkURL"
  ) as HTMLInputElement;
  let url = element.value;
  let settings = Settings.default();
  await settings.replace({ version: 1, remoteUrl: url });
}

async function restoreSettings(): Promise<void> {
  let settings = Settings.default();
  let remoteUrl = await settings.get("remoteUrl");
  if (remoteUrl && remoteUrl !== "") {
    let element = document.getElementById(
      "RemoteBookmarkURL"
    ) as HTMLInputElement;
    element.value = remoteUrl;
  }
}

document.getElementById("SaveButton").addEventListener("click", saveSettings);
restoreSettings();
