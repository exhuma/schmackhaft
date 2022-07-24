/**
 * This file contains the definition for a collection of links. The collection
 * provides implementations for searching links on various conditions.
 */

import { Bookmark, TagState } from "../../types";
import { Link } from "../../model/link";
import { intersection } from "../../collections";

/**
 * A colelction of links.
 *
 * This is the main implementation for working and search for links.
 */
export class Links {
  links: Array<Link>;
  searchString: string = "";
  states: { [key: string]: TagState };

  /**
   * @param links An initial collection of links. Can be an empty array.
   */
  constructor(links: Array<Link> = []) {
    this.links = links;
    this.states = {};
  }

  /**
   * Instantiate a collection of links from a JSON string.
   *
   * The JSON string must have a top-level list of items. Each item is loaded
   * via Link.fromObject and must conform to the schema required by it.
   *
   * @param data A JSON string
   * @returns A new instance of a "Links" object
   */
  static fromJson(data: string): Links {
    let parsed = JSON.parse(data);
    let links = parsed.map(Link.fromObject);
    return new Links(links);
  }

  /**
   * Convert this collection of links to a JSON string
   *
   * @returns A JSON string
   */
  toJson(): string {
    return JSON.stringify(this.links.map((item): Bookmark => item.toObject()));
  }

  /**
   * Return a new list of links acording to the specified filter(s) in this class.
   * The returned list will also be sorted according to the link's "compString"
   * argument
   *
   * @todo Is it not possible to make objects comparable in JS? It should be?
   * @returns Return only links matching the current filters
   */
  get filtered() {
    const output = this.links.filter((link) => {
      return this.isMatchingOnTags(link) && this.isMatchingOnSearchString(link);
    });
    output.sort((a: Link, b: Link) => {
      return a.compString.localeCompare(b.compString);
    });
    return output;
  }

  /**
   * Determines whether a user searching for the string stored in this "Links"
   * class should see the given link.
   *
   * @param link The link we compare
   * @returns  Whether the link matches the string or not.
   */
  isMatchingOnSearchString(link: Link) {
    const regex = new RegExp(this.searchString, "i");
    return (
      link.title.search(regex) !== -1 ||
      link.description.search(regex) !== -1 ||
      link.href.search(regex) !== -1
    );
  }

  /**
   * Return all the searched tags that are currently "included" when filtering
   * using this "Links" class.
   *
   * @returns A list of tag names
   */
  get searchedTags() {
    let output: string[] = [];
    Object.entries(this.states).forEach(([key, value]) => {
      if (value === TagState.INCLUDED) {
        output.push(key);
      }
    });
    return output;
  }

  /**
   * Return all the searched tags that are currently "excluded" when filtering
   * using this "Links" class.
   *
   * @returns A list of tag names
   */
  get excludedTags() {
    let output: string[] = [];
    Object.entries(this.states).forEach(([key, value]) => {
      if (value === TagState.EXCLUDED) {
        output.push(key);
      }
    });
    return output;
  }

  /**
   * Determines the current "mode" of a given tag in this collection.
   *
   * @param tagName The tag we want to inspect
   * @returns A TagState instance
   */
  getState(tagName: string): TagState {
    let output = TagState.NEUTRAL;
    if (this.links) {
      output = this.states[tagName] ?? TagState.NEUTRAL;
    }
    return output;
  }

  /**
   * @param link The link we inspect
   * @returns Whether the link should be included in a result when searching on
   * tags or not.
   */
  isMatchingOnTags(link: Link) {
    if (!this.states || Object.keys(this.states).length === 0) {
      return true;
    }
    let intersectExcluded = intersection(this.excludedTags, link.tags);
    if (intersectExcluded.length !== 0) {
      return false;
    }
    let intersect = intersection(this.searchedTags, link.tags);
    let output = true;
    this.searchedTags.forEach((item) => {
      output = output && intersect.includes(item);
    });
    return output;
  }

  /**
   * Remove all search filters and/or set them to their default values.
   */
  reset() {
    this.clearSearch();
    this.states = {};
  }

  /**
   * Modify how a given tag affects the current search. This is multi-state and
   * this method will "move" the state in one direction. See "reverseState"
   * for the inverse operation.
   *
   * @param tagName The tag we want to modify
   */
  advanceState(tagName: string) {
    let currentState = this.states[tagName] ?? TagState.NEUTRAL;
    let newState = TagState.NEUTRAL;
    switch (currentState) {
      case TagState.NEUTRAL:
        newState = TagState.INCLUDED;
        break;
      case TagState.INCLUDED:
        newState = TagState.EXCLUDED;
        break;
      case TagState.EXCLUDED:
        newState = TagState.NEUTRAL;
        break;
      default:
        newState = TagState.NEUTRAL;
        break;
    }
    this.states[tagName] = newState;
  }

  /**
   * Modify how a given tag affects the current search. This is multi-state and
   * this method will "move" the state in the opposite direction of
   * "advanceState".
   *
   * @param tagName The tag we want to modify
   */
  reverseState(tagName: string) {
    let currentState = this.states[tagName] ?? TagState.NEUTRAL;
    let newState = TagState.NEUTRAL;
    switch (currentState) {
      case TagState.NEUTRAL:
        newState = TagState.EXCLUDED;
        break;
      case TagState.INCLUDED:
        newState = TagState.NEUTRAL;
        break;
      case TagState.EXCLUDED:
        newState = TagState.INCLUDED;
        break;
      default:
        newState = TagState.NEUTRAL;
        break;
    }
    this.states[tagName] = newState;
  }

  /**
   * Set the search-string of this collection
   *
   * @param substring The search string
   */
  search(substring: string) {
    this.searchString = substring;
  }

  /**
   * Remove the search string from this collection
   */
  clearSearch() {
    this.searchString = "";
  }
}
