/**
 * Convert a naive value into a proper enum value.
 *
 * For example given that the "Foo" enum has a key "BAR" with value "bar", this
 * function converts "bar" into Foo.BAR
 *
 * Example:
 *
 * ```
 * enum Foo {
 *   BAR = "bar"
 * }
 *
 * let output = getEnumByValue(Foo, "bar")
 * // output is now `Foo.BAR`
 * ```
 *
 * @param cls The type of enum
 * @param value The value we want to convert
 * @returns the enum value
 */
export function getEnumByValue(cls: any, value: string | number): any {
  const typeIndex = Object.values(cls).indexOf(value);
  if (typeIndex < 0) {
    throw new Error(`Unknown enum value: ${value} for enum ${cls}`);
  }
  let typeName = Object.keys(cls)[typeIndex];
  return cls[typeName];
}

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
  image: string;
  description: string;
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
  fetch: TFetcher;
  settings: any;
  get(href: string): Promise<Bookmark | null>;
  getAll(): Promise<Bookmark[]>; // TODO: Is this used?!?
  put(data: Bookmark): Promise<void>;
  remove(href: string): Promise<void>;
}

export interface IStorageBackend {
  set(data: object): Promise<void>;
  get(data: object): Promise<any | null>;
}

export type TBookmarkSource = {
  name: string;
  defaultTags: string[];
  isEnabled: boolean;
  hasFaviconsEnabled: boolean;
  favIconTemplateURL: string;
  type: BookmarkSource;
  settings: object;
};

export type TSettings = {
  sources: TBookmarkSource[];
  version: number;
};

export type TBrowserFactory = () => Promise<Browser | null>;
export type TFetcher = (url: string) => Promise<any>;
