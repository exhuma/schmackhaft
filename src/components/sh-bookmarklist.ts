import "material-icon-component/md-icon.js";
import { LitElement, PropertyValueMap, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property } from "lit/decorators.js";
import { LinkList } from "./sh-linklist";
import { Links } from "../model/link-collection";
import { TagList } from "./sh-taglist";
import { TagStateTransition } from "../types";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-bookmarklist")
export class Bookmarks extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    css`
      :host {
        /* TODO: "display: contents" has accessibility issues. See
         * https://developer.mozilla.org/en-US/docs/Web/CSS/display-box for more
         * information
         */
        display: contents;
        height: 100px;
        border: 2px dashed blue;
      }
    `,
  ];

  @property({ type: Object })
  links: Links = new Links();

  @property({ attribute: "fav-icon-template" })
  favIconTemplate = "";

  tagListRef: Ref<TagList> = createRef();
  linkListRef: Ref<LinkList> = createRef();
  quickSearchRef: Ref<HTMLInputElement> = createRef();

  _onKeyUp(evt: { target: { value: string }; key: string }) {
    switch (evt.key) {
      case "Enter":
        let link = this.linkListRef?.value?.focussedLink;
        if (link !== undefined && link !== null) {
          this.dispatchEvent(
            new CustomEvent("linkActivated", { detail: { link } })
          );
        }
        break;
      case "ArrowDown":
        this.linkListRef.value?.focusNextLink();
        break;
      case "ArrowUp":
        this.linkListRef.value?.focusPreviousLink();
        break;
      default:
        // TODO: lit does not detect any changes deep inside the "this.links"
        // object and we need to manually trigger the update. This is error-prone
        // and should be improved.
        this.links.search(evt.target.value);
        this.linkListRef.value?.requestUpdate();
        this.tagListRef.value?.requestUpdate();
        this.linkListRef.value?.focusLink(0);
    }
  }

  _onChipClicked(evt: {
    detail: { direction: TagStateTransition; name: string };
  }) {
    switch (evt.detail.direction) {
      case TagStateTransition.ADVANCE:
      default:
        this.links.advanceState(evt.detail.name);
        break;
      case TagStateTransition.REVERSE:
        this.links.reverseState(evt.detail.name);
        break;
    }
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.quickSearchRef.value?.focus();
  }

  updateHover(evt: { detail: string }) {
    this.dispatchEvent(new CustomEvent("updateHover", { detail: evt.detail }));
  }

  override render() {
    return html`
      <input
        @keyup=${this._onKeyUp}
        ${ref(this.quickSearchRef)}
        type="search"
        class="block p-1 mb-1 w-full text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Quicksearch (tags and details)"
      />
      <layout-vsplit>
        <sh-taglist
          slot="top"
          ${ref(this.tagListRef)}
          @chipClicked="${this._onChipClicked}"
          .links="${this.links}"
          dense
        ></sh-taglist>
        <sh-linklist
          slot="bottom"
          ${ref(this.linkListRef)}
          .links=${this.links}
          .renderSearchedTags="${false}"
          favIconTemplate=${this.favIconTemplate}
          @chipClicked="${this._onChipClicked}"
          @updateHover="${this.updateHover}"
          dense
        ></sh-linklist>
      </layout-vsplit>
    `;
  }
}
