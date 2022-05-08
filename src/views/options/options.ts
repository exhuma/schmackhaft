import { Settings } from "../../core/settings";

async function saveSettings(evt): Promise<void> {
  let newData = JSON.parse(evt.detail.settings ?? '{}');
  let settings = Settings.default();
  await settings.replace(newData);
}

async function restoreSettings(): Promise<void> {
  let settings = Settings.default();
  let result = await settings.getAll();
  let settingsElement = document.getElementById("Settings");
  if (!settingsElement) {
    console.error("Requred DOM ID 'Settings' not found!");
    return;
  }
  settingsElement.settings = JSON.stringify(result);
}

document.getElementById("Settings").addEventListener("change", saveSettings);
restoreSettings();
