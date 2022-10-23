import { describe, expect, it } from "vitest";
import { HttpStorage } from "../../../../src/core/storage/http";

/**
 * A fake implementation for the default "fetch" API
 *
 * @param url The URL we want to fetch
 */
async function fakeFetcher(url: string): Promise<any> {
  return {
    ok: true,
    json: async () => {
      return [
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
    },
  };
}

describe("http storage", function () {
  it("does not break with an empty config", async () => {
    let storage = new HttpStorage({}, async () => null, fakeFetcher);
    let result = await storage.getAll();
    expect(result).to.eql([]);
  });

  it("allows us to fetch all URLs from one source", async () => {
    let storage = new HttpStorage(
      { url: "https://example.com/bookmarks.json" },
      async () => null,
      fakeFetcher
    );
    let result = await storage.getAll();
    expect(result).to.eql([
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
    ]);
  });

  it("does not crash if the remote request fails", async () => {
    let storage = new HttpStorage(
      { url: "https://example.com/bookmarks.json" },
      async () => null,
      async (url: string) => {
        return { ok: false };
      }
    );
    let result = await storage.getAll();
    expect(result).to.eql([]);
  });

  it("can retrieve details for a single URL", async () => {
    let storage = new HttpStorage(
      { url: "https://example.com/bookmarks.json" },
      async () => null,
      fakeFetcher
    );
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
    let storage = new HttpStorage(
      { url: "https://example.com/bookmarks.json" },
      async () => null,
      fakeFetcher
    );
    let result = await storage.get("https://example.com/does/not/exist");
    expect(result).to.be.null;
  });

  it("does not break if we store new bookmarks", async () => {
    let storage = new HttpStorage({}, async () => null, fakeFetcher);
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
    let storage = new HttpStorage({}, async () => null, fakeFetcher);
    let result = await storage.remove("");
    expect(result).to.be.undefined;
  });
});
