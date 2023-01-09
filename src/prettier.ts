type Doc =
  | { type: "nil" }
  | { type: "text"; text: string; doc: Doc }
  | { type: "line"; indent: number; doc: Doc };

const MkText = (text: string, doc: Doc): Doc => ({ type: "text", text, doc });
const MkLine = (indent: number, doc: Doc): Doc => ({
  type: "line",
  indent,
  doc,
});

const nil: Doc = { type: "nil" };

const text = (x: string): Doc => MkText(x, nil);

const line: Doc = MkLine(0, nil);

const concat = (x: Doc, y: Doc): Doc => {
  switch (x.type) {
    case "text":
      return MkText(x.text, concat(x.doc, y));
    case "line":
      return MkLine(x.indent, concat(x.doc, y));
    case "nil":
      return y;
  }
};

const concatAll = (...args: Doc[]): Doc => args.reduce((a, b) => concat(a, b));

const nest = (width: number, x: Doc): Doc => {
  switch (x.type) {
    case "text":
      return MkText(x.text, nest(width, x.doc));
    case "line":
      return MkLine(width + x.indent, nest(width, x.doc));
    case "nil":
      return x;
  }
};

export const layout = (x: Doc): string => {
  switch (x.type) {
    case "text":
      return x.text + layout(x.doc);
    case "line":
      return "\n" + " ".repeat(x.indent) + layout(x.doc);
    case "nil":
      return "";
  }
};

export type FuncCall = { type: "func_call"; name: string; args: FuncCall[] };

export const showFuncCall = (fn: FuncCall): Doc =>
  concat(text(fn.name), showParen(fn.args));

const showParen = (args: FuncCall[]): Doc =>
  args.length === 0
    ? nil
    : concatAll(
        text("("),
        nest(2, concat(line, showArgs(args))),
        line,
        text(")")
      );

const showArgs = ([x, ...xs]: FuncCall[]): Doc =>
  xs.reduce(
    (res, fn) => concatAll(res, text(","), line, showFuncCall(fn)),
    showFuncCall(x)
  );
