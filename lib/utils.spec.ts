import {test, expect} from "vitest";
import {stringToPath} from "./utils";

test("stringToPath to adapt dot notation", () => {
    expect(stringToPath('test.one.other')).toStrictEqual(['test', 'one', 'other']);
});

test("stringToPath to adapt bracket notation", () => {
    expect(stringToPath('test[one][other]')).toStrictEqual(['test', 'one', 'other']);
});

test("stringToPath to adapt a mix of dot and bracket notation", () => {
    expect(stringToPath('test[one].other')).toStrictEqual(['test', 'one', 'other']);
});