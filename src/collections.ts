/**
 * This module contains utility function operating on collections of items
 * (arrays, sets, ...)
 */

/**
 * Determines the intersection between two sets.
 *
 * @param setA A set of items
 * @param setB Another set of items
 * @returns A new set of items containing only items that exist in both
 */
export function intersection(setA: Array<string>, setB: Array<string>) {
  let _intersection = new Array();
  for (let elem of setB) {
    if (setA.includes(elem)) {
      _intersection.push(elem);
    }
  }
  return _intersection;
}
