import { Settings } from "./model/settings";

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
  settings: Settings;
  get(href: string): Promise<Bookmark | null>;
  getAll(): Promise<Bookmark[]>;
  put(data: Bookmark): Promise<void>;
  remove(href: string): Promise<void>;
}

export interface IStorageBackend {
  set(data: object): Promise<void>;
  get(data: object): Promise<any | null>;
}
