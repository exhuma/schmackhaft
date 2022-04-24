import * as browser from "webextension-polyfill";
import { handleMessage } from "../messaging.js";

browser.runtime.onMessage.addListener(handleMessage);
