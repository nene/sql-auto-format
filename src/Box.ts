/** A boxed value that allows mapping over it */
export class Box<T> {
  constructor(private value: T) {}

  map<T2>(fn: (v: T) => T2): Box<T2> {
    return new Box(fn(this.value));
  }

  unbox(): T {
    return this.value;
  }
}
