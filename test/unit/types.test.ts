import * as types from "../../src/types";
import { expect, it } from "vitest";

enum MyTestDefaultEnum {
  A,
  B,
}

enum MyTestStringEnum {
  A = "value-a",
  B = "value-b",
}

it("can load a string enum by value", () => {
  let result = types.getEnumByValue(MyTestStringEnum, "value-b");
  expect(result).to.equal(MyTestStringEnum.B);
});

it("can load an enum by value", () => {
  let result = types.getEnumByValue(MyTestDefaultEnum, 1);
  expect(result).to.equal(MyTestDefaultEnum.B);
});

it("fails on non-existing values", () => {
  expect(function () {
    types.getEnumByValue(MyTestDefaultEnum, 99);
  }).to.throw(/Unknown.*99/);
});
