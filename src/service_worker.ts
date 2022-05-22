import * as browser from "webextension-polyfill";
import { handleMessage } from "./core/messaging";

browser.runtime.onMessage.addListener(handleMessage);
