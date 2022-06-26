import { LocalStorage } from "./local";
import { HttpStorage } from "./http";
import { BookmarkStorage } from "./bookmarks";
import { IStorage } from "../../types";
import { Settings } from "../model/settings";
import { Browser }  from "../types";

export function createStorage(settings: Settings, type: string, browser: Browser | null): IStorage {
  if (type === "local") {
    return new LocalStorage(settings, browser);
  } else if (type === "http") {
    return new HttpStorage(settings, browser);
  } else if (type === "bookmarks") {
    return new BookmarkStorage(settings, browser);
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }
}
