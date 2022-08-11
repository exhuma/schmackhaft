import { BrowserBookmarkNode } from "../src/types";

class BookmarkTree {
  async getTree() {
    let output: BrowserBookmarkNode[] = [];
    output.push({
      children: [],
      url: "http://example.com/tree",
      title: "bookmark from the browser",
    });
    return output;
  }
}

class FakeStorage {
  async set(template: object) {
    console.debug(`Set called on FakeStorage with ${JSON.stringify(template)}`);
  }

  async get(template: object) {
    return {
      bookmarks: [
        {
          title: "Bookmark from Local Storage",
          tags: ["local-storage"],
          href: "http://example.com",
        },
      ],
    };
  }
}

export class FakeBrowser {
  tabs: any;
  runtime: any;

  get bookmarks() {
    return new BookmarkTree();
  }

  get storage() {
    return {
      local: new FakeStorage(),
    };
  }
}
