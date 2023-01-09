type Doc = string;

const concat = (...args: Doc[]): Doc => args.reduce((a, b) => a + b);

const nil: Doc = "";

const text = (x: string): Doc => x;

const line: Doc = "\n";

const nest = (width: number, lines: Doc): Doc =>
  lines.replace(/\n/g, "\n" + " ".repeat(width));

export const layout = (doc: Doc): string => doc;

export type FuncCall = { type: "func_call"; name: string; args: FuncCall[] };

export const showFuncCall = (fn: FuncCall): Doc =>
  concat(fn.name, showParen(fn.args));

const showParen = (args: FuncCall[]): Doc =>
  args.length === 0
    ? nil
    : concat(text("("), nest(2, concat(line, showArgs(args))), line, text(")"));

const showArgs = ([x, ...xs]: FuncCall[]): Doc =>
  xs.reduce(
    (res, fn) => concat(res, text(","), line, showFuncCall(fn)),
    showFuncCall(x)
  );
