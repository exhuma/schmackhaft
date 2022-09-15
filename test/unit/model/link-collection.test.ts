import { beforeEach, describe, expect, it } from "vitest";
import { Link } from "../../../src/model/link";
import { Links } from "../../../src/model/link-collection";

describe("link-container", function () {
  let testCollection: Links;

  beforeEach(function () {
    testCollection = new Links([
      new Link(
        "http://example.com",
        ["tag1", "tag2", "tag3"],
        "example-title",
        "example-image",
        "example-description"
      ),
    ]);
  });

  it("a valid no-arg initialiser", () => {
    let container = new Links();
    expect(container.links).to.eql([]);
    expect(container.searchString).to.equal("");
    expect(container.states).to.eql({});
  });

  it("returns the links in the collection", () => {
    expect(testCollection.links).to.eql([
      new Link(
        "http://example.com",
        ["tag1", "tag2", "tag3"],
        "example-title",
        "example-image",
        "example-description"
      ),
    ]);
  });
});
