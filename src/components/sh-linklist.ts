import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property } from "lit/decorators.js";
import { Link } from "../model/link";
import { Links } from "../model/link-collection";
import { classMap } from "lit/directives/class-map.js";
// @ts-ignore
import linkListStyles from "./sh-linklist.css";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-linklist")
export class LinkList extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    // @ts-ignore
    css([linkListStyles]),
  ];

  @property({ type: Object })
  links = new Links();

  @property({ type: Boolean })
  renderSearchedTags: boolean = true;

  @property({ type: Boolean })
  dense: boolean = false;

  @property()
  favIconTemplate = "";

  containerRef: Ref<HTMLElement> = createRef();

  focussedLinkIndex = 0;

  focusLink(index: number, updateLink?: boolean) {
    this.focussedLinkIndex = index;
    if (this.focussedLinkIndex < 0) {
      this.focussedLinkIndex = 0;
    } else if (this.focussedLinkIndex > this.links.length - 1) {
      this.focussedLinkIndex = this.links.length - 1;
    }
    let selectedElement =
      this.containerRef?.value?.getElementsByClassName("selected");
    if (selectedElement && selectedElement[0]) {
      selectedElement[0].scrollIntoView({ block: "center" });
      if (updateLink) {
        const link = selectedElement[0].getAttribute("href");
        if (link != null) {
          this.updateHover({ detail: link });
        }
      } else {
        this.updateHover({ detail: "" });
      }
    }
    this.requestUpdate();
  }

  focusPreviousLink() {
    this.focusLink(this.focussedLinkIndex - 1, true);
  }

  focusNextLink() {
    this.focusLink(this.focussedLinkIndex + 1, true);
  }

  get focussedLink(): Link | null {
    if (this.links.isEmpty) {
      return null;
    }
    return this.links[this.focussedLinkIndex];
  }

  _renderTag(tagName: string, component: any) {
    return html`<sh-chip name="${tagName}" data-tag="${tagName}"
      >${tagName}</sh-chip
    >`;
  }

  updateHover(evt: { detail: string }) {
    this.dispatchEvent(new CustomEvent("updateHover", { detail: evt.detail }));
  }

  _renderLink(link: Link, idx: number) {
    let tagsWithStates = link.tags.map((tagName) => {
      return [tagName, this.links.getState(tagName)];
    });
    let dynamicClasses = {
      selected: idx === this.focussedLinkIndex,
      ["non-selected"]: idx !== this.focussedLinkIndex,
    };
    return html`
      <sh-link
        class="${classMap(dynamicClasses)}"
        title="${link.title}"
        description="${link.description}"
        href="${link.href}"
        img="${link.image}"
        favIconTemplate="${this.favIconTemplate}"
        .tags="${tagsWithStates}"
        ?dense="${this.dense}"
        @chipClicked="${this.onChipClicked}"
        @updateHover="${this.updateHover}"
      ></sh-link>
    `;
  }

  onChipClicked(evt: { detail: any }) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: evt.detail }));
  }

  override render() {
    let links = [];
    for (let item of this.links) {
      links.push(item);
    }
    if (this.renderSearchedTags) {
      return html`
        <p>${this.links.searchedTags.map(this._renderTag, this)}</p>
        ${links.map(this._renderLink, this)}
      `;
    }
    return html`<div ${ref(this.containerRef)}>
      ${links.map(this._renderLink, this)}
    </div>`;
  }
}
