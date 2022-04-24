import * as browser from "webextension-polyfill";
import { handleMessage } from "./core/messaging.js";

browser.runtime.onMessage.addListener(handleMessage);
