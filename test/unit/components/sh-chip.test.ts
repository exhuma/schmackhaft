import "../../../src/components/sh-chip";
import { TagState, TagStateTransition } from "../../../src/types";
import { expect, it, vi } from "vitest";
import { Chip } from "../../../src/components/sh-chip";

describe("The chip custom element", async () => {
  let node: Chip;

  beforeEach(async () => {
    document.body.innerHTML = '<sh-chip name="the-title"></sh-chip>';
    let result: Chip | null = document.body.querySelector("sh-chip");
    if (result === null || result === undefined) {
      throw new Error("Required element not found");
    }
    node = result;
  });

  it("re-renders on modification", async () => {
    expect(node.shadowRoot?.textContent).toContain("the-title");
    node.name = "the-name";
    node.count = 10;
    await node.updateComplete;
    expect(node.shadowRoot?.textContent).toContain("the-name");
  });

  it("provides the name-attribute as a DOM property", () => {
    expect(node.name).to.equal("the-title");
  });

  it("provides the state as a DOM property", () => {
    expect(node.state).to.equal(TagState.NEUTRAL);
  });

  it("cycles throught the states on click", () => {
    const spyClick = vi.fn();
    node.addEventListener("chipClicked", spyClick);
    let clickTarget = node.shadowRoot?.querySelector(".chip");
    // @ts-ignore
    clickTarget?.click();

    expect(spyClick).toHaveBeenCalledOnce();
    // @ts-ignore
    expect(spyClick.calls[0][0].detail).toEqual({
      direction: TagStateTransition.ADVANCE,
      name: "the-title",
    });
  });

  it("cycles throught the states on right-click", () => {
    const spyClick = vi.fn();
    node.addEventListener("chipClicked", spyClick);
    let clickTarget = node.shadowRoot?.querySelector(".chip");
    // @ts-ignore
    clickTarget?.dispatchEvent(new MouseEvent("contextmenu"));

    expect(spyClick).toHaveBeenCalledOnce();
    // @ts-ignore
    expect(spyClick.calls[0][0].detail).toEqual({
      direction: TagStateTransition.REVERSE,
      name: "the-title",
    });
  });

  it("renders properly on different states", () => {
    node.state = TagState.INCLUDED;
    node.render();
    node.state = TagState.EXCLUDED;
    node.render();
    node.state = TagState.NEUTRAL;
    node.render();
  });
});
