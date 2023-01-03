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

export function unroll(layout: Layout): UnrolledLine[] {
  return lonelyLiteralsToLines(arrayWrap(unrollLayout(layout)));
}

// After the normal unroll is done, converts remaining top-level layout literals to lines
function lonelyLiteralsToLines(layouts: UnrolledLayout[]): UnrolledLine[] {
  const lines: UnrolledLine[] = [];
  let runningLine: UnrolledLine | undefined = undefined;
  for (const item of layouts) {
    if (isLine(item)) {
      lines.push(item);
      runningLine = undefined;
    } else if (runningLine) {
      runningLine.items.push(item);
    } else {
      runningLine = { layout: "line", items: [item] };
      lines.push(runningLine);
    }
  }
  return lines;
}

function unrollLayout(item: Layout): UnrolledLayout | UnrolledLayout[] {
  if (isLine(item)) {
    return unrollLine(item);
  }
  if (isArray(item)) {
    return unrollArray(item);
  }
  return item;
}

function unrollArray(array: Layout[]): UnrolledLayout[] {
  const flatArray = array.flatMap(unrollLayout);

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
        return { ...subLine, indent: sumIndents(line, subLine) };
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
      lines.push({ ...item, indent: sumIndents(line, item) });
    } else {
      const lastLine = last(lines);
      if (isLine(lastLine)) {
        lastLine.items.push(item);
      } else {
        lines.push({ ...line, items: [item] });
      }
    }
  });
  return lines;
}

function sumIndents(line1: Line, line2: Line): number | undefined {
  if (!line1.indent && !line2.indent) {
    return undefined;
  }
  return (line1.indent || 0) + (line2.indent || 0);
}
