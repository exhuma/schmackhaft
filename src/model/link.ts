import { Bookmark } from "../types";

export class Link {
  title: string;
  description: string;
  href: string;
  image: string;
  _tags: Array<string>;

  constructor(
    href: string,
    tags: Array<string>,
    title: string = "",
    image: string = "",
    description: string = ""
  ) {
    this.href = href;
    this._tags = tags;
    this.title = title;
    this.image = image;
    this.description = description;
  }

  static fromObject(data: Bookmark): Link {
    return new Link(
      data.href,
      data.tags ?? [],
      data.title ?? "",
      data.image ?? "",
      data.description ?? ""
    );
  }

  toObject(): Bookmark {
    return {
      href: this.href,
      tags: this.tags,
      title: this.title || "",
      image: this.image || "",
      description: this.description || "",
    };
  }

  get tags() {
    return this._tags.sort((a: string, b: string) => {
      return a.localeCompare(b);
    });
  }

  get compString(): string {
    if (this.title !== "") {
      return this.title.toLowerCase();
    }
    if (this.href !== "") {
      return this.href.toLowerCase();
    }
    return "";
  }
}
