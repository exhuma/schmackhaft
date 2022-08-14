/**
 * This file contains supporting JS code for the browser-extension action button
 */
import { Browser } from "../../types";
import { Schmackhaft } from "../../app-schmackhaft";
import { SettingsBridge } from "../../core/settings";

/**
 * An implementation of a factory function to return a reference to the browser
 * extension API
 */
async function getBrowser(): Promise<Browser | null> {
  try {
    let polyfill = await import("webextension-polyfill");
    return polyfill.default;
  } catch (error) {
    console.warn({ message: "Unable to import the polyfill", error });
    return null;
  }
}

/**
 * Initialise the user-interface with all event handers.
 */
async function initUI() {
  let settings = await SettingsBridge.default();
  let data = await settings.getAll();
  let element = document.getElementById("schmackhaft") as Schmackhaft | null;
  if (element === null) {
    throw new Error("No element with ID 'schmackhaft found'");
  }
  element.settings = JSON.stringify(data);
  element.injections = { getBrowser: getBrowser };
  element?.addEventListener("settingsChanged", (evt: any) => {
    settings.setAll(JSON.parse(evt.detail.settings));
  });
}

document.addEventListener("DOMContentLoaded", initUI);
