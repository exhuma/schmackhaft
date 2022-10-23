import { describe, expect, it } from "vitest";
import { LocalStorage } from "../../../../src/core/storage/local";

/**
 * A fake implementation for the default "fetch" API
 *
 * @param url The URL we want to fetch
 */
async function dummyFetcher(url: string): Promise<any> {
  return {
    ok: true,
    json: async () => {
      return [];
    },
  };
}

class FakeBrowser {
  get storage() {
    return {
      local: {
        set: (pattern: object) => {
          // no-op
        },
        get: (pattern: object) => {
          return {
            bookmarks: {
              "https://example.com/child": {
                description: "",
                href: "https://example.com/child",
                image: "",
                tags: ["tag1"],
                title: "example-child",
              },
              "https://example.com": {
                description: "",
                href: "https://example.com",
                image: "",
                tags: ["tag1"],
                title: "example-title",
              },
            },
          };
        },
      },
    };
  }
}

describe("local bookmark storage", function () {
  it("can read all bookmarks", async () => {
    let storage = new LocalStorage({}, () => new FakeBrowser(), dummyFetcher);
    let result = await storage.getAll();
    let expected = [
      {
        description: "",
        href: "https://example.com/child",
        image: "",
        tags: ["tag1"],
        title: "example-child",
      },
      {
        description: "",
        href: "https://example.com",
        image: "",
        tags: ["tag1"],
        title: "example-title",
      },
    ];
    expect(result).to.have.deep.members(expected);
  });

  it("can retrieve details for a single URL", async () => {
    let storage = new LocalStorage({}, () => new FakeBrowser(), dummyFetcher);
    let result = await storage.get("https://example.com");
    let expected = {
      description: "",
      href: "https://example.com",
      image: "",
      tags: ["tag1"],
      title: "example-title",
    };
    expect(result).to.eql(expected);
  });

  it("can retrieve details for a single non-existing URL", async () => {
    let storage = new LocalStorage({}, () => new FakeBrowser(), dummyFetcher);
    let result = await storage.get("https://example.com/does/not/exist");
    expect(result).to.be.null;
  });

  it("does not break if we don't have a browser", async () => {
    let storage = new LocalStorage({}, () => new FakeBrowser(), dummyFetcher);
    let result = await storage.getAll();
    expect(result.length).to.equal(2);
  });

  it("does not break if we store new bookmarks", async () => {
    let storage = new LocalStorage({}, () => new FakeBrowser(), dummyFetcher);
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
    let storage = new LocalStorage({}, () => new FakeBrowser(), dummyFetcher);
    let result = await storage.remove("");
    expect(result).to.be.undefined;
  });

  it("can read all bookmarks without browser", async () => {
    let storage = new LocalStorage({}, () => null, dummyFetcher);
    let result = await storage.getAll();
    let expected = [];
    expect(result).to.have.deep.members(expected);
  });

  it("can retrieve details for a single URL without browser", async () => {
    let storage = new LocalStorage({}, () => null, dummyFetcher);
    let result = await storage.get("https://example.com");
    let expected = null;
    expect(result).to.eql(expected);
  });

  it("can retrieve details for a single non-existing URL without browser", async () => {
    let storage = new LocalStorage({}, () => null, dummyFetcher);
    let result = await storage.get("https://example.com/does/not/exist");
    expect(result).to.be.null;
  });

  it("does not break if we don't have a browser without browser", async () => {
    let storage = new LocalStorage({}, () => null, dummyFetcher);
    let result = await storage.getAll();
    expect(result.length).to.equal(0);
  });

  it("does not break if we store new bookmarks", async () => {
    let storage = new LocalStorage({}, () => null, dummyFetcher);
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
    let storage = new LocalStorage({}, () => null, dummyFetcher);
    let result = await storage.remove("");
    expect(result).to.be.undefined;
  });
});
