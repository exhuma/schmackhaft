import { describe, expect, it } from "vitest";
import { BookmarkSource } from "../../../../src/types";
import { createStorage } from "../../../../src/core/storage/factory";

describe("The factory for different storage implementations", function () {
  Object.keys(BookmarkSource).map((item) => {
    it(`can create an instance of type ${item}`, () => {
      let value = BookmarkSource[item];
      let instance = createStorage(value, {}, async () => null);
      expect(instance.getAll).to.not.be.undefined;
    });
  });

  it("raises an appropriate exception for unknown types", () => {
    expect(function () {
      // @ts-ignore
      createStorage("a type that does not exist", {}, async () => null);
    }).to.throw(/Unsupported.*exist/);
  });
});
