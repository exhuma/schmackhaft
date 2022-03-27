import { LocalStorage } from "./local.js";
import { HttpStorage } from "./http.js";

export function createStorage(settings, type) {
  if (type === "local") {
    return new LocalStorage(settings);
  } else if (type === "http") {
    return new HttpStorage(settings);
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }
}
