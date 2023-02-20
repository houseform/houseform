/** Used to match property names within property paths. */
const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
const reEscapeChar = /\\(\\)?/g;

/**
 * Originally adapted from Lodash's `toPath` function. Imported and modified to reduce bundle size.
 * @see https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L6735-L6744
 *
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} str The string to convert.
 * @returns {Array} Returns the property path array.
 */
export const stringToPath = (str: string) => {
  const result = [] as string[];
  str.replace(rePropName, (match, number, quote, subString) => {
    const resultToPush = quote
      ? subString.replace(reEscapeChar, "$1")
      : number || match;
    resultToPush && result.push(resultToPush);
    return undefined as any;
  });
  return result;
};

/**
 * Mutates the `obj`
 */
export const fillPath = (obj: object, path: string, value: any) => {
  const pathArray = stringToPath(path);

  let current: any = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i] as string;

    if (i === pathArray.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }

  return obj;
};

export const getPath = (obj: object, path: string) => {
  const pathArray = stringToPath(path);

  let current: any = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i] as string;

    if (i === pathArray.length - 1) {
      return current[key];
    } else {
      current = current[key];
    }
  }
};
