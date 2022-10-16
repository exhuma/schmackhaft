import { beforeEach, describe, expect, it } from "vitest";
import { Link } from "../../../src/model/link";
import { Links } from "../../../src/model/link-collection";
import { TagState } from "../../../src/types";

describe("unfiltered link-container", function () {
  let testCollection: Links;

  beforeEach(function () {
    testCollection = new Links([
      new Link(
        "http://example.com/1",
        ["tag1", "unwanted-tag"],
        "example-title-1",
        "example-image-1",
        "example-description-1"
      ),
      new Link(
        "http://example.com/3",
        ["tag3", "grouped-tag"],
        "example-title-3",
        "example-image-3",
        "example-description-3"
      ),
      new Link(
        "http://example.com/2",
        ["tag2", "grouped-tag"],
        "example-title-2",
        "example-image-2",
        "example-description-2"
      ),
    ]);
  });

  it("a valid no-arg initialiser", () => {
    let container = new Links();
    expect(container.links).to.eql([]);
    expect(container.searchString).to.equal("");
    expect(container.states).to.eql({});
  });

  it("is indexable", () => {
    let result = testCollection.getFromFiltered(0);
    expect(result).to.eql(
      new Link(
        "http://example.com/1",
        ["tag1", "unwanted-tag"],
        "example-title-1",
        "example-image-1",
        "example-description-1"
      )
    );
  });

  it("is has a length", () => {
    let result = testCollection.filteredLength;
    expect(result).to.equal(3);
  });

  it("return a filtered and sorted collection on iteration", () => {
    testCollection.advanceState("grouped-tag");
    let result = new Array(...testCollection);
    expect(result).to.eql([
      new Link(
        "http://example.com/2",
        ["grouped-tag", "tag2"],
        "example-title-2",
        "example-image-2",
        "example-description-2"
      ),
      new Link(
        "http://example.com/3",
        ["grouped-tag", "tag3"],
        "example-title-3",
        "example-image-3",
        "example-description-3"
      ),
    ]);
  });

  it("can be converted to/from JSON", () => {
    let result = Links.fromJson(testCollection.toJson());
    expect(result).to.eql(testCollection);
  });
});

describe("filtered link-container", function () {
  let testCollection: Links;

  beforeEach(function () {
    testCollection = new Links([
      new Link(
        "http://example.com/1",
        ["tag1", "unwanted-tag"],
        "example-title-1",
        "example-image-1",
        "example-description-1"
      ),
      new Link(
        "http://example.com/3",
        ["tag3", "grouped-tag"],
        "example-title-3",
        "example-image-3",
        "example-description-3"
      ),
      new Link(
        "http://example.com/2",
        ["tag2", "grouped-tag"],
        "example-title-2",
        "example-image-2",
        "example-description-2"
      ),
    ]);
    testCollection.advanceState("grouped-tag");
  });

  it("is iterable", () => {
    let result = new Array(...testCollection);
    expect(result).to.eql([
      new Link(
        "http://example.com/2",
        ["grouped-tag", "tag2"],
        "example-title-2",
        "example-image-2",
        "example-description-2"
      ),
      new Link(
        "http://example.com/3",
        ["grouped-tag", "tag3"],
        "example-title-3",
        "example-image-3",
        "example-description-3"
      ),
    ]);
  });

  it("is indexable", () => {
    let result = testCollection.getFromFiltered(0);
    expect(result).to.eql(
      new Link(
        "http://example.com/2",
        ["grouped-tag", "tag2"],
        "example-title-2",
        "example-image-2",
        "example-description-2"
      )
    );
  });

  it("is has a length of all links", () => {
    let result = testCollection.totalLength;
    expect(result).to.equal(3);
  });

  it("shows the filtered length when filtering on tags", () => {
    let result = testCollection.filteredLength;
    expect(result).to.equal(2);
  });

  it("shows the filtered length including text-search", () => {
    testCollection.search("description-2");
    let result = testCollection.filteredLength;
    expect(result).to.equal(1);
  });

  it("provides a method to reset the search", () => {
    testCollection.search("description-2");
    testCollection.reset();
    let result = testCollection.filteredLength;
    expect(result).to.equal(testCollection.totalLength);
  });

  it("provides a method to retrieve the current tag state", () => {
    let result = testCollection.getState("grouped-tag");
    expect(result).to.equal(TagState.INCLUDED);
    result = testCollection.getState("unwanted-tag");
    expect(result).to.equal(TagState.NEUTRAL);
  });

  it("provides a method to advance the state of a tag", () => {
    let result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.NEUTRAL);
    testCollection.advanceState("tag1");
    result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.INCLUDED);
    testCollection.advanceState("tag1");
    result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.EXCLUDED);
    testCollection.advanceState("tag1");
    result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.NEUTRAL);
  });

  it("provides a method to reverse the state of a tag", () => {
    let result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.NEUTRAL);
    testCollection.reverseState("tag1");
    result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.EXCLUDED);
    testCollection.reverseState("tag1");
    result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.INCLUDED);
    testCollection.reverseState("tag1");
    result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.NEUTRAL);
  });

  it("has sensible defaults for 'corrupted' state values when advancing", () => {
    testCollection.states["tag1"] = 42;
    testCollection.advanceState("tag1");
    let result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.NEUTRAL);
  });

  it("has sensible defaults for 'corrupted' state values when reversing", () => {
    testCollection.states["tag1"] = 42;
    testCollection.reverseState("tag1");
    let result = testCollection.getState("tag1");
    expect(result).to.equal(TagState.NEUTRAL);
  });
});
