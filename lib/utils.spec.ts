import { test, expect } from "vitest";
import { fillPath, stringToPath } from "./utils";

test("stringToPath to adapt dot notation", () => {
  expect(stringToPath("test.one.other")).toStrictEqual([
    "test",
    "one",
    "other",
  ]);
});

test("stringToPath to adapt bracket notation", () => {
  expect(stringToPath('test["one"]["other"]')).toStrictEqual([
    "test",
    "one",
    "other",
  ]);
});

test("stringToPath to adapt a mix of dot and bracket notation", () => {
  expect(stringToPath('test["one"].other')).toStrictEqual([
    "test",
    "one",
    "other",
  ]);
});

test("fillPath should add a key to an object", () => {
  expect(fillPath({}, "test", "value")).toStrictEqual({ test: "value" });
});

test("fillPath should add a key to an object two levels deep", () => {
  expect(
    fillPath({ test: { one: { other: {} } } }, "test.one.other", "value")
  ).toStrictEqual({ test: { one: { other: "value" } } });
});

test("fillPath should add a key to an object without prefixed keys", () => {
  expect(fillPath({}, "test.one.other", "value")).toStrictEqual({
    test: { one: { other: "value" } },
  });
});
