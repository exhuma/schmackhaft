import { TagState } from "../../types";
import { JsonSchema as LinkSchema, Link } from "../model/link";

function intersection(setA: Array<string>, setB: Array<string>) {
  let _intersection = new Array();
  for (let elem of setB) {
    if (setA.includes(elem)) {
      _intersection.push(elem);
    }
  }
  return _intersection;
}

export class Links {
  links: Array<Link>;
  searchString: string = "";
  states: {[key: string]: TagState}

  constructor(links: Array<Link> = []) {
    this.links = links;
    this.states = {};
  }

  static fromJson(data: string): Links {
    let parsed = JSON.parse(data);
    let links = parsed.map((item: LinkSchema) => {
      return new Link(
        item["href"],
        item["tags"],
        item["title"],
        item["image"],
        item["description"]
      );
    });
    return new Links(links);
  }

  toJson(): string {
    return JSON.stringify(
      this.links.map((item): LinkSchema => {
        return {
          href: item.href,
          tags: item.tags,
          title: item.title || "",
          image: item.img || "",
          description: item.description || "",
        };
      })
    );
  }

  get filtered() {
    const output = this.links.filter((link) => {
      return this.isMatchingOnTags(link) && this.isMatchingOnSearchString(link);
    });
    output.sort((a: Link, b: Link) => {
      return a.compString.localeCompare(b.compString);
    });
    return output;
  }

  isMatchingOnSearchString(link: Link) {
    const regex = new RegExp(this.searchString, "i");
    return (
      link.title.search(regex) !== -1 ||
      link.description.search(regex) !== -1 ||
      link.href.search(regex) !== -1
    );
  }

  get searchedTags() {
    let output: string[] = [];
    Object.entries(this.states).forEach(([key, value]) => {
      if (value === TagState.INCLUDED) {
        output.push(key);
      }
    })
    return output;
  }

  get excludedTags() {
    let output: string[] = [];
    Object.entries(this.states).forEach(([key, value]) => {
      if (value === TagState.EXCLUDED) {
        output.push(key);
      }
    })
    return output;
  }

  getState(tagName: string): TagState {
    let output = TagState.NEUTRAL;
    if (this.links) {
      output = this.states[tagName] ?? TagState.NEUTRAL;
    }
    return output;
  }

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

  reset() {
    this.clearSearch();
    this.states = {};
  }

  advanceState(tagName: string) {
    let currentState = this.states[tagName] ?? TagState.NEUTRAL;
    let newState = TagState.NEUTRAL;
    switch(currentState) {
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

  search(substring: string) {
    this.searchString = substring;
  }

  clearSearch() {
    this.searchString = "";
  }
}
