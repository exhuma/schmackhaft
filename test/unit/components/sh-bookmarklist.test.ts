import "../../../src/components/sh-bookmarklist";
import { expect, it } from "vitest";
import { Bookmarks } from "../../../src/components/sh-bookmarklist";
import { Link } from "../../../src/model/link";
import { LinkList } from "../../../src/components/sh-linklist";
import { Links } from "../../../src/model/link-collection";

describe("The bookmark-list custom element", async () => {
  let node: Bookmarks;

  beforeEach(async () => {
    document.body.innerHTML = "<sh-bookmarklist></sh-bookmarklist>";
    let bookmarkList: Bookmarks | null =
      document.body.querySelector("sh-bookmarklist");
    if (bookmarkList === null || bookmarkList === undefined) {
      throw new Error("Required element not found");
    }
    bookmarkList.links = new Links([
      new Link("https://example.com", ["tag-1"], "the-title"),
      new Link("https://example.com/2", ["tag-2"]),
    ]);
    await bookmarkList.updateComplete;
    node = bookmarkList;
  });

  it("provides the name-attribute as a DOM property", () => {
    let vsplit = node.shadowRoot?.querySelector("LAYOUT-VSPLIT");
    let linkList = vsplit?.querySelector("SH-LINKLIST") as LinkList;
    if (!linkList) {
      // fail unit-test
      expect.fail("Missing either the LAYOUT-VSPLIT or SH-LINKLIST element");
    }

    let result = linkList?.links.links.map((link) => link.href);
    expect(result).to.eql(["https://example.com", "https://example.com/2"]);
  });
});
