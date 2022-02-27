import { expect } from "@esm-bundle/chai";
import { Counter } from "../dist/core/counter";

describe("Link Counter", () => {
  it("counts items", () => {
    let items = ["a", "b", "a"];
    let counter = new Counter(items);
    expect(counter.count("a")).to.equal(2);
    expect(counter.count("b")).to.equal(1);
    expect(counter.count("c")).to.equal(0);
  });
  it("counts newly added items", () => {
    let items = ["a", "b", "a"];
    let counter = new Counter(items);
    counter.addOne("a");
    expect(counter.count("a")).to.equal(3);
  });
  it("counts newly added items from a collection", () => {
    let items = ["a", "b", "a"];
    let counter = new Counter(items);
    counter.addAll(["a", "b", "c"]);
    expect(counter.count("a")).to.equal(3);
    expect(counter.count("b")).to.equal(2);
    expect(counter.count("c")).to.equal(1);
  });
  it("allows removing one item", () => {
    let items = ["a", "b", "a"];
    let counter = new Counter(items);
    counter.removeOne("a");
    expect(counter.count("a")).to.equal(1);
  });
  it("allows removing all items", () => {
    let items = ["a", "b", "a"];
    let counter = new Counter(items);
    counter.removeAll("a");
    expect(counter.count("a")).to.equal(0);
  });
  it("allows looping over sorted entries", () => {
    let items = ["a", "c", "b", "a", "a", "b"];
    let counter = new Counter(items);
    let expected = [
      ["a", 3],
      ["b", 2],
      ["c", 1],
    ];
    let result = counter.sortedEntries();
    expect(result).to.eql(expected);
  });
});
