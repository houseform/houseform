/* c8 ignore start */
import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "./is-browser";

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
/* c8 ignore end */
