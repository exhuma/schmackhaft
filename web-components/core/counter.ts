export class Counter<Type> {
  items: Map<Type, number>;

  constructor(items: Array<Type> = []) {
    this.items = new Map();
    this.addAll(items);
  }

  count(item: Type): number {
    return this.items.get(item) || 0;
  }

  addOne(item: Type): void {
    let currentValue = this.items.get(item) || 0;
    this.items.set(item, currentValue + 1);
  }
  addAll(item: Array<Type>): void {
    item.forEach((element) => {
      this.addOne(element);
    });
  }
  removeOne(item: Type): void {
    if (!this.items.has(item)) {
      return;
    }
    if (this.items.get(item) === 1) {
      this.items.delete(item);
    }
    let currentValue = this.items.get(item) || 0;
    this.items.set(item, currentValue - 1);
  }
  removeAll(item: Type): void {
    this.items.delete(item);
  }

  sortedEntries(): [Type, number][] {
    const output = [];
    for (let item of this.items) {
      output.push(item);
    }
    output.sort((a, b) => b[1] - a[1]);
    return output;
  }
}
