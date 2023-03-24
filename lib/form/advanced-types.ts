type AnyArray<T> = Array<T> | ReadonlyArray<T>;

type ObjectMapDeep<Obj extends object, MappedType> = {
  // A key must be in the query object to be added
  [key in keyof Obj]: Obj[key] extends AnyArray<infer Q>
    ? Array<MapDeep<Q, MappedType>>
    : // If it's an object, pick it
    Exclude<Obj[key], undefined> extends object
    ? // Check if the object is optional. If it is, we need to unwrap the undefined object
      // and then rewrap it (to keep the `undefined` types
      Obj[key] extends Exclude<Obj[key], undefined>
      ? MapDeep<Obj[key], MappedType>
      : MapDeep<Obj[key], MappedType> | undefined
    : MappedType;
};

export type MapDeep<Obj, MappedType> = Obj extends object
  ? ObjectMapDeep<Obj, MappedType>
  : Obj;
