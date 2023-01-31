import { ForwardedRef, forwardRef, memo, useContext, useMemo } from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FormContext } from "../form/context";
import { stringToPath } from "../utils";
import { FieldArrayInstance } from "./types";

export interface FieldArrayRenderProps<T = any>
  extends FieldInstanceBaseProps<T> {
  children: (props: FieldArrayInstance<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const formContext = useContext(FormContext);

  const { formFieldsRef } = formContext;

  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  return undefined as any;
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;
