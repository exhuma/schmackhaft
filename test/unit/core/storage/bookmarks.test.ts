import { BookmarkStorage, visit } from "../../../../src/core/storage/bookmarks";
import { describe, expect, it } from "vitest";
import { BrowserBookmarkNode } from "../../../../src/types";

class FakeBrowser {
  get bookmarks() {
    return {
      getTree: function () {
        let output: BrowserBookmarkNode[] = [];
        output.push({
          children: [
            {
              children: [],
              title: "example-child",
              url: "https://example.com/child",
            },
          ],
          title: "example-title",
          url: "https://example.com",
        });
        return output;
      },
    };
  }
}

describe("browser bookmark storage", function () {
  it("properly handles empty parents on nodes", () => {
    let result = visit(
      {
        children: [],
        title: "example-child",
        url: "https://example.com/child",
      },
      // @ts-ignore
      undefined
    );
    let expected = [
      {
        description: "",
        href: "https://example.com/child",
        image: "",
        tags: [],
        title: "example-child",
      },
    ];
    expect(result).to.be.eql(expected);
  });

  it("can read all bookmarks", async () => {
    let storage = new BookmarkStorage({}, async () => new FakeBrowser());
    let result = await storage.getAll();
    let expected = [
      {
        description: "",
        href: "https://example.com/child",
        image: "",
        tags: ["example-child", "Browser Bookmarks"],
        title: "example-child",
      },
      {
        description: "",
        href: "https://example.com",
        image: "",
        tags: ["Browser Bookmarks"],
        title: "example-title",
      },
    ];
    expect(result).to.eql(expected);
  });

  it("can retrieve details for a single URL", async () => {
    let storage = new BookmarkStorage({}, async () => new FakeBrowser());
    let result = await storage.get("https://example.com");
    let expected = {
      description: "",
      href: "https://example.com",
      image: "",
      tags: ["Browser Bookmarks"],
      title: "example-title",
    };
    expect(result).to.eql(expected);
  });

  it("can retrieve details for a single non-existing URL", async () => {
    let storage = new BookmarkStorage({}, async () => new FakeBrowser());
    let result = await storage.get("https://example.com/does/not/exist");
    expect(result).to.be.null;
  });

  it("does not break if we don't have a browser", async () => {
    let storage = new BookmarkStorage({}, async () => null);
    let result = await storage.getAll();
    expect(result).to.eql([]);
  });

  it("does not break if we store new bookmarks", async () => {
    let storage = new BookmarkStorage({}, async () => null);
    let result = await storage.put({
      title: "",
      tags: [],
      href: "",
      image: "",
      description: "",
    });
    expect(result).to.be.undefined;
  });

  it("does not break if we remove bookmarks", async () => {
    let storage = new BookmarkStorage({}, async () => null);
    let result = await storage.remove("");
    expect(result).to.be.undefined;
  });
});
