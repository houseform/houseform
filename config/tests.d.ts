import { UserEvent } from "@testing-library/user-event";

declare global {
  // eslint-disable-next-line no-var
  var user: UserEvent;
}

export {};
