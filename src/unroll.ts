import { isNumber, isString, last } from "./utils";
import { Line, isLine, Layout } from "./LayoutTypes";

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
  if (lineItems.length === 0) {
    return [{ ...line, items: [] }];
  }
  if (lineItems.every(isLine)) {
    return lineItems.map((subLine) => {
      if (line.indent) {
        return { ...subLine, indent: line.indent + (subLine.indent || 0) };
      } else {
        return subLine;
      }
    });
  }
  if (lineItems.every((x) => isString(x) || isNumber(x))) {
    return [{ ...line, items: lineItems }];
  }

  // gather leading strings/numbers to separate line
  const lines: Line[] = [];
  lineItems.forEach((item) => {
    if (isLine(item)) {
      lines.push(item);
    } else {
      const lastLine = last(lines);
      if (isLine(lastLine)) {
        lastLine.items.push(item);
      } else {
        lines.push({ layout: "line", items: [item] });
      }
    }
  });
  return lines;
}

// After the normal unroll is done, converts remaining top-level strings to lines
export function remainingStringsToLines(items: Layout[]): Line[] {
  return items.map((item) => {
    return isLine(item) ? item : { layout: "line", items: [item] };
  });
}
