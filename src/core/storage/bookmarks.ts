/**
 * A storage backend for Schmackhaft bookmarks which reads the entries from the
 * current browser bookmarks
 */
import {
  Bookmark,
  BrowserBookmarkNode,
  IStorage,
  TBrowserFactory,
  TFetcher,
} from "../../types";

/**
 * Recursively fetch bookmarks from a single node from the browser bookmarks API
 *
 * @param node The browser-bookmark node to inspect
 * @param parentFolderNames A list representing the path for this current node
 * @returns A list of bookmarks in this node
 */
export function visit(
  node: BrowserBookmarkNode,
  parentFolderNames: string[]
): Bookmark[] {
  parentFolderNames = parentFolderNames || [];
  let output: Bookmark[] = [];
  if (node.children) {
    node.children.forEach((item) => {
      let subitems = visit(item, [item.title, ...parentFolderNames]);
      output = [...output, ...subitems];
    });
  }
  if (node.url) {
    output.push({
      href: node.url,
      title: node.title,
      tags: parentFolderNames,
      image: "", // TODO: Can we get an image from somewhere?
      description: "", // TODO: Can we get a description from somewhere?
    });
  }
  return output;
}

export class BookmarkStorage implements IStorage {
  settings: {};
  browserFactory: TBrowserFactory;
  fetch: (url: string) => Promise<any>;

  constructor(settings: any, browserFactory: TBrowserFactory, fetch: TFetcher) {
    this.settings = settings;
    this.browserFactory = browserFactory;
    this.fetch = fetch;
  }

  async get(href: string): Promise<Bookmark | null> {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll(): Promise<Bookmark[]> {
    let browser = await this.browserFactory();
    if (browser === null) {
      console.debug(
        "Not running as browser-extension. Bookmark fetchin is disabled!"
      );
      return [];
    }
    let root = await browser.bookmarks.getTree();
    let all: Bookmark[] = [];
    root.forEach((item: BrowserBookmarkNode) => {
      let bookmarks = visit(item, ["Browser Bookmarks"]);
      all = [...bookmarks, ...all];
    });
    return all;
  }

  async put(data: Bookmark): Promise<void> {
    return;
  }

  async remove(href: string): Promise<void> {
    return;
  }
}
