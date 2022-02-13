import { Link } from "../model/link";

export class Links {
  links: Array<Link>;
  searchedTags: Array<string>;

  constructor(links: Array<Link> = []) {
    this.links = links;
    this.searchedTags = [];
  }

  get filtered() {
    const output = this.links.filter((item) => {
      if (!this.searchedTags || this.searchedTags.length === 0) {
        return true;
      }
      return item.tags.includes(this.searchedTags[0]);
    });
    return output;
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
}
