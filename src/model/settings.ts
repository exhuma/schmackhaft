export class Settings {
  remoteUrls: string[];
  enableBrowserBookmarks: boolean;
  version: number;

  constructor(
    remoteUrls: string[],
    enableBrowserBookmarks: boolean,
    version: number
  ) {
    this.remoteUrls = remoteUrls;
    this.enableBrowserBookmarks = enableBrowserBookmarks;
    this.version = version;
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  static fromJson(data: string): Settings {
    let dataObject = JSON.parse(data);
    return new Settings(
      dataObject.remoteUrls,
      dataObject.enableBrowserBookmarks,
      dataObject.version
    );
  }
}
