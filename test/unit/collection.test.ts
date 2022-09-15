import * as collections from "../../src/collections";
import { expect, it } from "vitest";

it("can intersect two empty arrays", () => {
  let result = collections.intersection([], []);
  expect(result).to.eql([]);
});

it("can intersect if the first array is empty", () => {
  let result = collections.intersection([], ["a", "b", "c"]);
  expect(result).to.eql([]);
});

it("can intersect if the second array is empty", () => {
  let result = collections.intersection(["a", "b", "c"], []);
  expect(result).to.eql([]);
});

it("can intersect two non-empty non-overlapping arrays", () => {
  let result = collections.intersection(["a", "b"], ["c", "d"]);
  expect(result).to.eql([]);
});

it("can intersect two non-empty overlapping arrays", () => {
  let result = collections.intersection(["a", "b"], ["b", "c"]);
  expect(result).to.eql(["b"]);
});

it("can intersect two non-empty identical arrays", () => {
  let result = collections.intersection(["a", "b"], ["a", "b"]);
  expect(result).to.eql(["a", "b"]);
});
