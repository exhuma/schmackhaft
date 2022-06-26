import { Browser, Bookmark, BrowserBookmarkNode, IStorage } from "../../types";
import { Settings } from "../../model/settings";

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
  settings: Settings;
  browser: Browser | null;

  constructor(settings: Settings, browser: Browser | null) {
    this.settings = settings;
    this.browser = browser;
  }

  async get(href: string): Promise<Bookmark | null> {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll(): Promise<Bookmark[]> {
    if (this.browser === null) {
      console.debug("Not running as browser-extension. Bookmark fetchin is disabled!");
      return []
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
