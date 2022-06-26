import { LocalStorage } from "./local";
import { HttpStorage } from "./http";
import { BookmarkStorage } from "./bookmarks";
import { SettingsBridge } from "../settings";
import { IStorage } from "../../types";

export function createStorage(settings: SettingsBridge, type: string): IStorage {
  if (type === "local") {
    return new LocalStorage(settings);
  } else if (type === "http") {
    return new HttpStorage(settings);
  } else if (type === "bookmarks") {
    return new BookmarkStorage(settings);
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }
}
