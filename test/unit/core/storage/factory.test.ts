import { describe, expect, it } from "vitest";
import { BookmarkSource } from "../../../../src/types";
import { createStorage } from "../../../../src/core/storage/factory";

/**
 * A no-op drop-in for unit-testing where "fetch" is not defined
 *
 * @param url The url to fetch
 * @returns nothing
 */
async function dummyFetcher(url: string) {
  return null;
}

describe("The factory for different storage implementations", function () {
  Object.keys(BookmarkSource).map((item) => {
    it(`can create an instance of type ${item}`, () => {
      let value = BookmarkSource[item];
      let instance = createStorage(value, {}, async () => null, dummyFetcher);
      expect(instance.getAll).to.not.be.undefined;
    });
  });

  it("raises an appropriate exception for unknown types", () => {
    expect(function () {
      createStorage(
        // @ts-ignore
        "a type that does not exist",
        {},
        async () => null,
        dummyFetcher
      );
    }).to.throw(/Unsupported.*exist/);
  });
});
