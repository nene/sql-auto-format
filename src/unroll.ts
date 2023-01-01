import { isString, last } from "./utils";
import { Line, isLine, Layout } from "./layout";

export function unroll(item: Layout): Layout {
  if (isLine(item)) {
    return unrollLine(item);
  }
  if (item instanceof Array) {
    return unrollArray(item);
  }
  return item;
}

function unrollArray(array: Layout[]): Layout[] {
  const flatArray = array.flatMap(unroll);

  // No need to split when dealing with homogenous array
  if (flatArray.every(isLine) || flatArray.every(isString)) {
    return flatArray;
  }

  const results: Layout[] = [];
  flatArray.forEach((item) => {
    if (isLine(item)) {
      results.push(item);
    } else {
      const lastItem = last(results);
      if (isLine(lastItem)) {
        lastItem.items.push(item);
      } else {
        results.push(item);
      }
    }
  });
  return results;
}

function unrollLine(line: Line): Line[] {
  const lineItems = unrollArray(line.items);
  if (lineItems.every(isLine)) {
    return lineItems.map((subLine) => {
      if (line.indent) {
        return { ...subLine, indent: line.indent + (subLine.indent || 0) };
      } else {
        return subLine;
      }
    });
  }
  return [{ ...line, items: lineItems }];
}

// After the normal unroll is done, converts remaining top-level strings to lines
export function remainingStringsToLines(items: Layout[]): Line[] {
  return items.map((item) => {
    return isLine(item) ? item : { layout: "line", items: [item] };
  });
}
