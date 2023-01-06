import { sum } from "ramda";
import { isArray } from "../utils";
import { Layout, isLine, isSpace, isNewline } from "./LayoutTypes";

export function layoutLength(layout: Layout): number {
  if (isArray(layout)) {
    return sum(layout.map(layoutLength));
  } else if (isLine(layout)) {
    return layoutLength(layout.items);
  } else if (isSpace(layout)) {
    return 1;
  } else if (isNewline(layout)) {
    return 0; // todo
  } else {
    return layout.length;
  }
}
