import { expect, test } from "vitest";
import { fillPath, getPath, stringToPath } from "houseform";

test("stringToPath to adapt dot notation with prefixed dot", () => {
  expect(stringToPath(".test.one.other")).toStrictEqual([
    "test",
    "one",
    "other",
  ]);
});

test("stringToPath to adapt dot notation with postfixed dot", () => {
  expect(stringToPath("test.one.other.")).toStrictEqual([
    "test",
    "one",
    "other",
  ]);
});

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

test("getPath should get a key from an object", () => {
  expect(getPath({ test: "value" }, "test")).toStrictEqual("value");
});

test("getPath should return undefined", () => {
  expect(getPath({ test: "value" }, "test.other")).toStrictEqual(undefined);
});

test("getPath should get a deep key from an object", () => {
  expect(
    getPath({ test: { one: { other: "value" } } }, "test.one.other")
  ).toStrictEqual("value");
});
