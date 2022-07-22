import { TBookmarkSource } from "../types";

export class Settings {
  sources: TBookmarkSource[];
  version: number;

  constructor(sources: TBookmarkSource[] = [], version: number = 3) {
    this.sources = sources;
    this.version = version;
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromJson(data: string): Settings {
    let dataObject = JSON.parse(data);
    return new Settings(dataObject.sources, dataObject.version);
  }
}
