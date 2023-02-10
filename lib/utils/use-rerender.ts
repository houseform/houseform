import { useReducer } from "react";

export const useRerender = () => {
  const [_, rerender] = useReducer(() => ({}), {});
  return rerender;
};
