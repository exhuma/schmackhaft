/**
 * This file contains supporting JS code for the browser-extension sidebar
 */
import { Schmackhaft } from "../../components/app-schmackhaft";
import { SettingsBridge } from "../../core/settings";

async function initUI() {
  let settings = await SettingsBridge.default();
  let data = await settings.getAll();
  let element = document.getElementById("schmackhaft") as Schmackhaft | null;
  if (element === null) {
    throw new Error("No element with ID 'schmackhaft found'");
  }
  element.settings = JSON.stringify(data);
  element?.addEventListener("settingsChanged", (evt: any) => {
    settings.setAll(JSON.parse(evt.detail.settings));
  });
}

document.addEventListener("DOMContentLoaded", initUI);
