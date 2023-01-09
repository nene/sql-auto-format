class Nil {
  public readonly type = "nil";
  inspect(): string {
    return "Nil";
  }
}

class Text {
  public readonly type = "text";
  constructor(public text: string, public doc: Doc) {}
  inspect(): string {
    return `["${this.text}" Text ${this.doc.inspect()}]`;
  }
}

class Line {
  public readonly type = "line";
  constructor(public indent: number, public doc: Doc) {}
  inspect(): string {
    return `[${this.indent} Line ${this.doc.inspect()}]`;
  }
}

type Doc = Nil | Text | Line;

const nil: Doc = new Nil();

const text = (x: string): Doc => new Text(x, nil);

const line: Doc = new Line(0, nil);

const concatTwo = (x: Doc, y: Doc): Doc => {
  switch (x.type) {
    case "text":
      return new Text(x.text, concatTwo(x.doc, y));
    case "line":
      return new Line(x.indent, concatTwo(x.doc, y));
    case "nil":
      return y;
  }
};

const concat = (...args: Doc[]): Doc => args.reduce(concatTwo);

const nest = (width: number, x: Doc): Doc => {
  switch (x.type) {
    case "text":
      return new Text(x.text, nest(width, x.doc));
    case "line":
      return new Line(width + x.indent, nest(width, x.doc));
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
    : concat(text("("), nest(2, concat(line, showArgs(args))), line, text(")"));

const showArgs = ([x, ...xs]: FuncCall[]): Doc =>
  xs.reduce(
    (res, fn) => concat(res, text(","), line, showFuncCall(fn)),
    showFuncCall(x)
  );
