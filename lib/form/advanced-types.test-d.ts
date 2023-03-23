import { assertType } from "vitest";
import { MapDeep } from "./advanced-types";

interface TestObject {
  test: 1;
  other: {
    hello: {
      world: 2;
    };
  };
  arr: [
    {
      item: 123;
    }
  ];
}

type TrueObject = MapDeep<TestObject, true>;
const testObj: TrueObject = {} as never;

assertType<true>(testObj.arr[0].item);
assertType<true>(testObj.test);
assertType<true>(testObj.other.hello.world);
