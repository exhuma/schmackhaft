/**
 * A storage backend for Schmackhaft bookmarks which reads the entries from the
 * current browser bookmarks
 */
import { Bookmark, Browser, BrowserBookmarkNode, IStorage } from "../../types";
import { Settings } from "../../model/settings";

/**
 * Recursively fetch bookmarks from a single node from the browser bookmarks API
 *
 * @param node The browser-bookmark node to inspect
 * @param parentFolderNames A list representing the path for this current node
 * @returns A list of bookmarks in this node
 */
function visit(
  node: BrowserBookmarkNode,
  parentFolderNames: string[]
): Bookmark[] {
  parentFolderNames = parentFolderNames || [];
  let output = [];
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
    });
  }
  return output;
}

export class BookmarkStorage implements IStorage {
  settings: { browser: Browser };
  browser: Browser;

  constructor(settings: { browser: Browser }) {
    if (!settings.browser) {
      throw new Error("Settings object is missing the browser attribute");
    }
    this.settings = settings;
    this.browser = settings.browser;
  }

  async get(href: string): Promise<Bookmark | null> {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll(): Promise<Bookmark[]> {
    if (this.browser === null) {
      console.debug(
        "Not running as browser-extension. Bookmark fetchin is disabled!"
      );
      return [];
    }
    let root = await this.browser.bookmarks.getTree();
    let all = [];
    root.forEach((item) => {
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
