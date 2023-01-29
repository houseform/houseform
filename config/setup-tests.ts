import { afterEach, expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import userEvent from "@testing-library/user-event";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

globalThis.user = userEvent.setup();

afterEach(() => {
  cleanup();
});
