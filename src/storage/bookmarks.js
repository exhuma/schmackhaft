function visit(node, parentFolderNames) {
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

export class BookmarkStorage {
  constructor(settings) {
    this.settings = settings;
  }

  async get(href) {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll() {
    let root = await browser.bookmarks.getTree();
    let all = [];
    root.forEach((item) => {
      let bookmarks = visit(item, ["Browser Bookmarks"]);
      all = [...bookmarks, ...all];
    });
    return all;
  }

  async put(data) {
    return;
  }

  async remove(href) {
    return;
  }
}
