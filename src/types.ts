export enum TagState {
  NEUTRAL,
  INCLUDED,
  EXCLUDED,
}

export enum TagStateTransition {
  ADVANCE,
  REVERSE,
}

export enum PageName {
  BOOKMARKS,
  SETTINGS,
  HELP,
}

export enum BookmarkSource {
  HTTP = "http",
  BROWSER = "browser",
  EXTENSION_STORAGE = "extension_storage",
}

export type Bookmark = {
  title: string;
  tags: string[];
  href: string;
};

export type HMRequest = {
  method: string;
  args: any;
};

export type BrowserBookmarkNode = {
  children: BrowserBookmarkNode[];
  url: string;
  title: string;
};

export type BrowserTab = {
  url: string;
  title: string;
};

export type Browser = {
  storage: any;
  tabs: any;
  runtime: any;
  bookmarks: any;
};

export interface IStorage {
  settings: any;
  get(href: string): Promise<Bookmark | null>;
  getAll(): Promise<Bookmark[]>;
  put(data: Bookmark): Promise<void>;
  remove(href: string): Promise<void>;
}

export interface IStorageBackend {
  set(data: object): Promise<void>;
  get(data: object): Promise<any | null>;
}

export type TBookmarkSource = {
  type: BookmarkSource;
  settings: object;
};

export type TSettings = {
  sources: TBookmarkSource[];
  version: number;
};

export type TBrowserFactory = () => Promise<Browser | null>;
