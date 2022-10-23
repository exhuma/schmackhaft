import { beforeEach, describe, expect, it } from "vitest";
import { Counter } from "../../../src/core/counter";

describe("default counter behaviour", function () {
  let sharedVariable;

  beforeEach(function () {
    sharedVariable = null;
  });

  it("has a default no-arg constructor", () => {
    let counter = new Counter();
    let result = counter.sortedEntries();
    expect(result).to.eql([]);
  });

  it("can be bootstrapped with some items", () => {
    let counter = new Counter(["a", "b"]);
    let result = counter.sortedEntries();
    expect(result).to.eql([
      ["a", 1],
      ["b", 1],
    ]);
  });

  it("can receive new items", () => {
    let counter = new Counter();
    counter.addOne("a");
    counter.addOne("b");
    let result = counter.sortedEntries();
    expect(result).to.eql([
      ["a", 1],
      ["b", 1],
    ]);
  });

  it("can receive new items in bulk", () => {
    let counter = new Counter();
    counter.addAll(["a", "b"]);
    let result = counter.sortedEntries();
    expect(result).to.eql([
      ["a", 1],
      ["b", 1],
    ]);
  });

  it("can be asked for the count of a given item", () => {
    let counter = new Counter();
    counter.addAll(["a", "b", "b"]);
    expect(counter.count("a")).to.equal(1);
  });

  it("properly counts repeating items", () => {
    let counter = new Counter();
    counter.addAll(["a", "b", "b"]);
    expect(counter.count("b")).to.equal(2);
  });

  it("shows the count of an unknown item as 0", () => {
    let counter = new Counter();
    counter.addAll(["a", "b", "b"]);
    expect(counter.count("c")).to.equal(0);
  });

  it("allows removing of single items", () => {
    let counter = new Counter(["a", "b", "b"]);
    counter.removeOne("b");
    expect(counter.count("b")).to.equal(1);
  });

  it("does not break if we remove non-existing items", () => {
    let counter = new Counter(["a", "b", "b"]);
    counter.removeOne("c");
    expect(counter.count("c")).to.equal(0);
  });

  it("properly cleans up when removing the last item", () => {
    let counter = new Counter(["a", "b", "b"]);
    counter.removeOne("a");
    expect(counter.count("a")).to.equal(0);
  });

  it("allows removing of multiple items", () => {
    let counter = new Counter(["a", "b", "b"]);
    counter.removeAll("b");
    expect(counter.count("b")).to.equal(0);
  });
});
