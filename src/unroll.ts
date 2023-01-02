import { arrayWrap, isArray, isString, last } from "./utils";
import {
  Line,
  isLine,
  Layout,
  UnrolledLayout,
  UnrolledLine,
  isUnrolledLine,
  isLayoutLiteral,
  LayoutLiteral,
} from "./LayoutTypes";

export function unroll(layout: Layout): UnrolledLine[] {
  // After the normal unroll is done, convert remaining top-level strings to lines
  const unrolledLayouts = arrayWrap(unrollLayout(layout));
  return chunkByLayoutType(unrolledLayouts).flatMap((chunk): UnrolledLine[] => {
    if (isLine(chunk[0])) {
      return chunk as UnrolledLine[];
    } else {
      return [{ layout: "line", items: chunk as LayoutLiteral[] }];
    }
  });
}

const chunkByLayoutType = (
  array: UnrolledLayout[]
): (UnrolledLine[] | LayoutLiteral[])[] => {
  const chunks: (UnrolledLine[] | LayoutLiteral[])[] = [];
  let currentIsLine: boolean | undefined = undefined;
  for (const x of array) {
    if (isLine(x) === currentIsLine) {
      last(chunks).push(x as UnrolledLine & LayoutLiteral);
    } else {
      chunks.push([x] as UnrolledLine[] | LayoutLiteral[]);
      currentIsLine = isLine(x);
    }
  }
  return chunks;
};

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
