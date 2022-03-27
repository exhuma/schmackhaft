import { LocalStorage } from "./local.js";

export function createStorage(type) {
  if (type === "local") {
    return new LocalStorage();
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }
}
