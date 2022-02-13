export class Link {
  title: string;
  description: string;
  href: string;
  img: string;
  _tags: Array<string>;

  constructor(
    href: string,
    tags: Array<string>,
    title: string = "",
    img: string = "",
    description: string = ""
  ) {
    this.href = href;
    this._tags = tags;
    this.title = title;
    this.img = img;
    this.description = description;
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
