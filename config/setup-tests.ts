// vitest-setup.ts
import { expect, afterEach } from "vitest";
import matchers, {
  TestingLibraryMatchers,
} from "@testing-library/jest-dom/matchers";

import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

expect.extend(matchers);

globalThis.user = userEvent.setup();

afterEach(() => {
  cleanup();
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}
