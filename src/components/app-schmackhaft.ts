import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import "./components/sh-taglist";
import "./components/sh-linklist";
import "./components/layout-vsplit";
import { LinkList } from "./components/sh-linklist";
import { TagList } from "./components/sh-taglist";
import { Links } from "./core/links";
import { TagStateTransition } from "../types";

@customElement("app-schmackhaft")
export class Schmackhaft extends LitElement {
  static styles = css`
    * {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      font-size: 16px;
    }

    :host {
      display: block;
    }

    layout-vsplit {
      height: 100%;
    }
  `;

  tagsRef: Ref<HTMLInputElement> = createRef();
  searchTextRef: Ref<HTMLInputElement> = createRef();
  linkListRef: Ref<LinkList> = createRef();
  tagListRef: Ref<TagList> = createRef();

  private _links: Links = new Links();

  @property({ type: String })
  get links() {
    return this._links.toJson();
  }

  set links(data: string) {
    this._links = Links.fromJson(data);
    this.requestUpdate();
  }

  onChipClicked(evt: { detail: string }) {
    switch(evt.detail.direction) {
      case TagStateTransition.ADVANCE:
      default:
        this._links.advanceState(evt.detail.name);
        break;
      case TagStateTransition.REVERSE:
        this._links.reverseState(evt.detail.name);
        break;
    }
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  override render() {
    return html`
      <layout-vsplit>
        <sh-taglist
          slot="top"
          ${ref(this.tagListRef)}
          @chipClicked="${this.onChipClicked}"
          .links="${this._links}"
          dense
        ></sh-taglist>
        <sh-linklist
          slot="bottom"
          ${ref(this.linkListRef)}
          .links=${this._links}
          .renderSearchedTags="${false}"
          @chipClicked="${this.onChipClicked}"
          dense
        ></sh-linklist>
      </layout-vsplit>
    `;
  }
}
