import { LocalStorage } from "./local.js";
import { HttpStorage } from "./http.js";

const CONFIG = {
  url: "https://raw.githubusercontent.com/exhuma/dotfiles/master/bookmarks.json",
};

export function createStorage(type) {
  if (type === "local") {
    return new LocalStorage(CONFIG);
  } else if (type === "http") {
    return new HttpStorage(CONFIG);
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }
}
