import * as browser from "webextension-polyfill";
import { Bookmark, BrowserBookmarkNode, IStorage } from "../../types";
import { SettingsBridge } from "../settings";

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
  settings: SettingsBridge;
  constructor(settings: SettingsBridge) {
    this.settings = settings;
  }

  async get(href: string): Promise<Bookmark | null> {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll(): Promise<Bookmark[]> {
    let root = await browser.bookmarks.getTree();
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
