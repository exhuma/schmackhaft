export class Link {
  title: string;
  description: string;
  href: string;
  img: string;
  tags: Array<string>;

  constructor(
    href: string,
    tags: Array<string>,
    title: string = "",
    img: string = "",
    description: string = ""
  ) {
    this.href = href;
    this.tags = tags;
    this.title = title;
    this.img = img;
    this.description = description;
  }
}
