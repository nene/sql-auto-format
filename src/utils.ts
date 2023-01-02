/** Identity function */
export const identity = <T>(x: T): T => x;

/** Last item in array */
export const last = <T>(arr: T[]): T => arr[arr.length - 1];

/** Type guard to check that value is NOT undefined */
export const isDefined = <T>(x: T | undefined): x is T => x !== undefined;

/** Type guard for strings */
export const isString = (x: any): x is string => typeof x === "string";

/** Type guard for numbers */
export const isNumber = (x: any): x is number => typeof x === "number";

/** Type guard for objects */
export const isObject = (x: any): x is Record<string, any> =>
  typeof x === "object" && x !== null && !(x instanceof Array);

/* Removes elements from the start of the array that match the predicate */
export const dropWhile = <T>(fn: (x: T) => boolean, arr: T[]): T[] => {
  let i = 0;
  while (fn(arr[i])) {
    i++;
  }
  return i > 0 ? arr.slice(i) : arr;
};
