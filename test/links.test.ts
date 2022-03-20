import { expect } from "@esm-bundle/chai";
import { Links } from "../dist/core/links";
import { Link } from "../dist/model/link";

describe("Link Collection", () => {
  let links = new Links();
  beforeEach(function () {
    links = new Links([
      new Link(
        "https://example.com/1",
        ["defaultshown", "tag1-1", "tag1-2", "group1"],
        "Link1",
        "/demo/example1.jpg",
        "description 1"
      ),
      new Link(
        "https://example.com/2",
        ["defaultshown", "tag2-1", "tag2-2", "tag2-3", "group1", "group2"],
        "Link2",
        "/demo/example2.jpg",
        "description 2"
      ),
      new Link(
        "https://example.com/3",
        ["defaultshown", "group2"],
        "Link3",
        "/demo/example3.jpg",
        "description 3"
      ),
      new Link(
        "https://example.com/4",
        ["defaulthidden"],
        "Link4",
        "/demo/example4.jpg",
        "description 4"
      ),
    ]);
    links.filter("defaultshown");
  });
  it("Shows all links by default", () => {
    const hrefs = links.filtered.map((item) => item.href);
    const expected = [
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/3",
    ];
    expect(hrefs).to.have.members(expected);
  });
  it("Allows us to add a tag for filtering", () => {
    links.filter("tag1-1");
    const hrefs = links.filtered.map((item) => item.href);
    const expected = ["https://example.com/1"];
    expect(hrefs).to.have.members(expected);
  });
  it("Allows us to remove a tag from filtering", () => {
    links.unFilter("defaultshown");
    const hrefs = links.filtered.map((item) => item.href);
    const expected = [
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/3",
      "https://example.com/4",
    ];
    expect(hrefs).to.have.members(expected);
  });
  it("allows searching for a substring on the title case insensitively", () => {
    links.search("lInK1");
    const hrefs = links.filtered.map((item) => item.href);
    const expected = ["https://example.com/1"];
    expect(hrefs).to.have.members(expected);
  });
  it("allows searching for a substring on the description case insensitively", () => {
    links.search("EXAMPLE.COM/1");
    const hrefs = links.filtered.map((item) => item.href);
    const expected = ["https://example.com/1"];
    expect(hrefs).to.have.members(expected);
  });
  it("allows searching for a substring on the URL case insensitively", () => {
    links.search("dEsCrIpTiOn 1");
    const hrefs = links.filtered.map((item) => item.href);
    const expected = ["https://example.com/1"];
    expect(hrefs).to.have.members(expected);
  });
  it("allows clearing the searh term", () => {
    links.search("anything");
    links.clearSearch();
    const hrefs = links.filtered.map((item) => item.href);
    const expected = [
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/3",
    ];
    expect(hrefs).to.have.members(expected);
  });
});

describe("JSON links", () => {
  it("Allows loading links from JSON content", () => {
    let links = Links.fromJson(
      JSON.stringify([
        {
          href: "https://example.com/1",
          title: "example-1",
          description: "description-1",
          image: "https://image-1",
          tags: ["tag-1-1", "tag-1-2"],
        },
        {
          href: "https://example.com/2",
          title: "example-2",
          description: "description-2",
          image: "https://image-2",
          tags: ["tag-2-1", "tag-2-2"],
        },
      ])
    );
    let expected = new Links([
      new Link(
        "https://example.com/1",
        ["tag-1-1", "tag-1-2"],
        "example-1",
        "https://image-1",
        "description-1"
      ),
      new Link(
        "https://example.com/2",
        ["tag-2-1", "tag-2-2"],
        "example-2",
        "https://image-2",
        "description-2"
      ),
    ]);
    expect(links).to.eql(expected);
  });
  it("Allows converting links to JSON", () => {
    let data = new Links([
      new Link(
        "https://example.com/1",
        ["tag-1-1", "tag-1-2"],
        "example-1",
        "https://image-1",
        "description-1"
      ),
      new Link(
        "https://example.com/2",
        ["tag-2-1", "tag-2-2"],
        "example-2",
        "https://image-2",
        "description-2"
      ),
    ]);
    let expected = [
      {
        href: "https://example.com/1",
        title: "example-1",
        description: "description-1",
        image: "https://image-1",
        tags: ["tag-1-1", "tag-1-2"],
      },
      {
        href: "https://example.com/2",
        title: "example-2",
        description: "description-2",
        image: "https://image-2",
        tags: ["tag-2-1", "tag-2-2"],
      },
    ];
    let result = JSON.parse(data.toJson());
    expect(result).to.eql(expected);
  });
  it("sets sensible defaults on missing keys", () => {
    let result = Links.fromJson(
      JSON.stringify([
        {
          href: "https://example.com/2",
          tags: ["tag-2-1", "tag-2-2"],
        },
      ])
    );
    let expected = new Links([
      new Link("https://example.com/2", ["tag-2-1", "tag-2-2"]),
    ]);
    expect(result).to.eql(expected);
  });
});
