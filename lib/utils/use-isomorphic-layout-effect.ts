import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "./is-browser";

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
