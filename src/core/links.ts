import { Link } from "../model/link";

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
  searchedTags: Array<string>;
  searchString: string = "";

  constructor(links: Array<Link> = []) {
    this.links = links;
    this.searchedTags = [];
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

  isMatchingOnTags(link: Link) {
    if (!this.searchedTags || this.searchedTags.length === 0) {
      return true;
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
    this.searchedTags = [];
  }

  unFilter(tagName: string) {
    if (!this.searchedTags.includes(tagName)) {
      return;
    }
    this.searchedTags = this.searchedTags.filter((item) => item !== tagName);
  }

  filter(tagName: string) {
    if (this.searchedTags.includes(tagName)) {
      return;
    }
    this.searchedTags.push(tagName);
  }

  search(substring: string) {
    this.searchString = substring;
  }

  clearSearch() {
    this.searchString = "";
  }
}
