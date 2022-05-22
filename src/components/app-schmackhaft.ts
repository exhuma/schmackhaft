import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import "./components/sh-taglist";
import "./components/sh-linklist";
import { LinkList } from "./components/sh-linklist";
import { TagList } from "./components/sh-taglist";
import { Links } from "./core/links";

@customElement("app-schmackhaft")
export class Schmackhaft extends LitElement {
  static styles = css`
    * {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      font-size: 16px;
    }

    #GridContainer {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 20% 80%;
      height: 100vh;
    }

    sh-taglist {
      display: block;
      overflow-y: scroll;
      padding: 1rem;
      border-bottom: 1px solid black;
    }

    sh-linklist {
      display: block;
      overflow: auto;
      padding: 1rem;
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

  onTagClicked(evt: { detail: string }) {
    let tag = evt.detail;
    this._links.advanceState(tag);
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  override render() {
    return html`
      <div id="GridContainer">
        <sh-taglist
          ${ref(this.tagListRef)}
          @tagClicked="${this.onTagClicked}"
          .links="${this._links}"
          dense
        ></sh-taglist>
        <sh-linklist
          ${ref(this.linkListRef)}
          .links=${this._links}
          .renderSearchedTags="${false}"
          @tagClicked="${this.onTagClicked}"
          dense
        ></sh-linklist>
      </div>
    `;
  }
}
