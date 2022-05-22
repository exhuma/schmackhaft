import * as browser from "webextension-polyfill";
import { handleMessage } from "../messaging";

browser.runtime.onMessage.addListener(handleMessage);
