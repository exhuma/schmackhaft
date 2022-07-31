import { TBookmarkSource } from "../types";

export class Settings {
  sources: TBookmarkSource[];
  version: number;
  favIconTemplate: string = "";

  constructor(
    sources: TBookmarkSource[] = [],
    version: number = 3,
    favIconTemplate: string = ""
  ) {
    this.sources = sources;
    this.version = version;
    this.favIconTemplate = favIconTemplate;
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromJson(data: string): Settings {
    let dataObject = JSON.parse(data);
    return new Settings(
      dataObject.sources,
      dataObject.version,
      dataObject.favIconTemplate
    );
  }
}
