import { arrayWrap, isArray, isString, last } from "./utils";
import {
  Line,
  isLine,
  Layout,
  UnrolledLayout,
  UnrolledLine,
  isUnrolledLine,
  isLayoutLiteral,
} from "./LayoutTypes";

export function unrollToLines(layout: Layout): UnrolledLine[] {
  // After the normal unroll is done, convert remaining top-level strings to lines
  return arrayWrap(unroll(layout)).map((item) => {
    return isLine(item) ? item : { layout: "line", items: [item] };
  });
}

export function unroll(item: Layout): UnrolledLayout | UnrolledLayout[] {
  if (isLine(item)) {
    return unrollLine(item);
  }
  if (isArray(item)) {
    return unrollArray(item);
  }
  return item;
}

function unrollArray(array: Layout[]): UnrolledLayout[] {
  const flatArray = array.flatMap(unroll);

  // No need to split when dealing with homogenous array
  if (flatArray.every(isLine) || flatArray.every(isString)) {
    return flatArray;
  }

  const results: UnrolledLayout[] = [];
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

function unrollLine(line: Line): UnrolledLine[] {
  const lineItems = unrollArray(line.items);
  if (lineItems.length === 0) {
    return [{ ...line, items: [] }];
  }
  if (lineItems.every(isUnrolledLine)) {
    return lineItems.map((subLine) => {
      if (line.indent) {
        return { ...subLine, indent: line.indent + (subLine.indent || 0) };
      } else {
        return subLine;
      }
    });
  }
  if (lineItems.every(isLayoutLiteral)) {
    return [{ ...line, items: lineItems }];
  }

  // gather leading strings/numbers to separate line
  const lines: UnrolledLine[] = [];
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
