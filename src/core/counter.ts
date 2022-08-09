/**
 * A counter encapsulates the logic to count how many items of something we
 * have. It provides a couple of helper methods to update those counts by simply
 * "adding" or "removing" items.
 *
 * It can be initialised with a list of items.
 */
export class Counter<Type> {
  items: Map<Type, number>;

  constructor(items: Array<Type> = []) {
    this.items = new Map();
    this.addAll(items);
  }

  /**
   * @param item The item for which we want to see the count
   * @returns The number of times we have counted this item (default=0)
   */
  count(item: Type): number {
    return this.items.get(item) || 0;
  }

  /**
   * Count the item once
   *
   * @param item The item we want to count
   */
  addOne(item: Type): void {
    let currentValue = this.items.get(item) || 0;
    this.items.set(item, currentValue + 1);
  }

  /**
   * Count every element of an array by counting it as many times as it appears
   * in the array.
   *
   * @param item THe list of items we want to count
   */
  addAll(item: Array<Type>): void {
    item.forEach((element) => {
      this.addOne(element);
    });
  }

  /**
   * Decrease the count of a given item by 1. This never goes to negative
   * values. It stops decreasing at 0
   *
   * @param item The item to be "removed"
   */
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

  /**
   * Reduce the count of an element to 0
   *
   * @param item The item to be removed
   */
  removeAll(item: Type): void {
    this.items.delete(item);
  }

  /**
   * Return all entries we have in the counter, sorted by the number of times we
   * counted it.
   *
   * @returns An array of tuples containing the item and its respective count
   */
  sortedEntries(): [Type, number][] {
    const output = [];
    for (let item of this.items) {
      output.push(item);
    }
    output.sort((a, b) => b[1] - a[1]);
    return output;
  }
}
