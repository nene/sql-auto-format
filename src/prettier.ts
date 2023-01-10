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

class Union {
  public readonly type = "union";
  constructor(public left: Doc, public right: Doc) {}
  inspect(): string {
    return `[${this.left.inspect()} Union ${this.right.inspect()}]`;
  }
}

type Doc = Nil | Text | Line | Union;

const nil: Doc = new Nil();

const text = (x: string): Doc => new Text(x, nil);

const line: Doc = new Line(0, nil);

const concatTwo = (x: Doc, y: Doc): Doc => {
  switch (x.type) {
    case "nil":
      return y;
    case "line":
      return new Line(x.indent, concatTwo(x.doc, y));
    case "text":
      return new Text(x.text, concatTwo(x.doc, y));
    case "union":
      return new Union(concatTwo(x.left, y), concatTwo(x.right, y));
  }
};

const concat = (...args: Doc[]): Doc => args.reduce(concatTwo);

const nest = (width: number, x: Doc): Doc => {
  switch (x.type) {
    case "nil":
      return x;
    case "line":
      return new Line(width + x.indent, nest(width, x.doc));
    case "text":
      return new Text(x.text, nest(width, x.doc));
    case "union":
      return new Union(nest(width, x.left), nest(width, x.right));
  }
};

export const layout = (x: Doc): string => {
  switch (x.type) {
    case "nil":
      return "";
    case "line":
      return "\n" + " ".repeat(x.indent) + layout(x.doc);
    case "text":
      return x.text + layout(x.doc);
    case "union":
      throw new Error("Union should never be passed to layout()");
  }
};

const flatten = (x: Doc): Doc => {
  switch (x.type) {
    case "nil":
      return x;
    case "line":
      return new Text(" ", flatten(x.doc));
    case "text":
      return new Text(x.text, flatten(x.doc));
    case "union":
      return flatten(x.left);
  }
};

const group = (x: Doc): Doc => {
  switch (x.type) {
    case "nil":
      return x;
    case "line":
      return new Union(
        new Text(" ", flatten(x.doc)),
        new Line(x.indent, x.doc)
      );
    case "text":
      return new Text(x.text, group(x.doc));
    case "union":
      return new Union(group(x.left), x.right);
  }
};

const best = (width: number, runWidth: number, x: Doc): Doc => {
  switch (x.type) {
    case "nil":
      return x;
    case "line":
      return new Line(x.indent, best(width, x.indent, x.doc));
    case "text":
      return new Text(x.text, best(width, runWidth + x.text.length, x.doc));
    case "union":
      return better(
        width,
        runWidth,
        best(width, runWidth, x.left),
        best(width, runWidth, x.right)
      );
  }
};

const better = (width: number, runWidth: number, x: Doc, y: Doc): Doc => {
  return fits(width - runWidth, x) ? x : y;
};

const fits = (width: number, x: Doc): boolean => {
  if (width < 0) {
    return false;
  }
  switch (x.type) {
    case "nil":
      return true;
    case "line":
      return true;
    case "text":
      return fits(width - x.text.length, x.doc);
    case "union":
      throw new Error("Union should never be passed to fits()");
  }
};

export const pretty = (width: number, x: Doc): string =>
  layout(best(width, 0, x));

export type FuncCall = { type: "func_call"; name: string; args: FuncCall[] };

export const showFuncCall = (fn: FuncCall): Doc =>
  group(concat(text(fn.name), showParen(fn.args)));

const showParen = (args: FuncCall[]): Doc =>
  args.length === 0
    ? nil
    : concat(text("("), nest(2, concat(line, showArgs(args))), line, text(")"));

const showArgs = ([x, ...xs]: FuncCall[]): Doc =>
  xs.reduce(
    (res, fn) => concat(res, text(","), line, showFuncCall(fn)),
    showFuncCall(x)
  );
