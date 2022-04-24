import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import "./components/sh-vsplit";
import "./components/sh-taglist";
import "./components/sh-linklist";
import "@material/mwc-textfield";
import "@material/mwc-button";
import { LinkList } from "./components/sh-linklist";
import { TagList } from "./components/sh-taglist";
import { Links } from "./core/links";

@customElement("app-schmackhaft")
export class Schmackhaft extends LitElement {
  static styles = css`
    #FlexContainer {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 20% 80%;
      height: 100vh;
    }

    .tag {
      border: 1px dashed blue;
      margin: 0.2rem;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
    }

    .action-textfield {
      flex-grow: 2;
    }

    sh-taglist {
      display: block;
      overflow-y: scroll;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid black;
    }

    sh-linklist {
      display: block;
      overflow: auto;
    }
  `;

  tagsRef: Ref<HTMLInputElement> = createRef();
  searchTextRef: Ref<HTMLInputElement> = createRef();
  linkListRef: Ref<LinkList> = createRef();
  tagListRef: Ref<TagList> = createRef();

  private _links: Links = new Links();

  @property({ type: Boolean })
  narrow: boolean = false;

  @property({ type: String })
  get links() {
    return this._links.toJson();
  }

  set links(data: string) {
    this._links = Links.fromJson(data);
    this.requestUpdate();
  }

  _addTag() {
    if (!this.tagsRef.value) {
      return;
    }
    const tagName = this.tagsRef.value.value;
    this._links.filter(tagName);
    this.requestUpdate();
  }

  _onSearchExecuted() {
    if (!this.searchTextRef.value) {
      return;
    }
    this._links.search(this.searchTextRef.value.value);
    this.requestUpdate();
  }

  onTagFilterAdded(evt: { detail: string }) {
    let tag = evt.detail;
    this._links.filter(tag);
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  onTagFilterRemoved(evt: { detail: string }) {
    let tag = evt.detail;
    this._links.unFilter(tag);
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  renderNarrow() {
    return html`
      <div id="FlexContainer">
        <sh-taglist
          ${ref(this.tagListRef)}
          @tagFilterAdded="${this.onTagFilterAdded}"
          @tagFilterRemoved="${this.onTagFilterRemoved}"
          .links="${this._links}"
          dense
        ></sh-taglist>
        <sh-linklist
          ${ref(this.linkListRef)}
          .links=${this._links}
          .renderSearchedTags="${false}"
          @tagFilterAdded="${this.onTagFilterAdded}"
          @tagFilterRemoved="${this.onTagFilterRemoved}"
          dense
        ></sh-linklist>
      </div>
    `;
  }

  renderWide() {
    return html`
      <sh-vsplit>
        <div slot="left">
          <sh-taglist
            ${ref(this.tagListRef)}
            @tagFilterAdded="${this.onTagFilterAdded}"
            @tagFilterRemoved="${this.onTagFilterRemoved}"
            .links="${this._links}"
          ></sh-taglist>
        </div>
        <div slot="right">
          <div class="actions">
            <mwc-textfield
              ${ref(this.searchTextRef)}
              label="Search term"
              helper="Search for a substring in the bookmark entries"
              outlined
              class="action-textfield"
            ></mwc-textfield>
            <mwc-button
              @click="${this._onSearchExecuted}"
              label="Search"
              icon="search"
            ></mwc-button>
            <mwc-textfield
              ${ref(this.tagsRef)}
              label="tags"
              outlined
              helper="Search for a specific tag"
              class="action-textfield"
            ></mwc-textfield>
            <mwc-button
              @click="${this._addTag}"
              label="Add"
              icon="add"
            ></mwc-button>
          </div>
          <sh-linklist
            ${ref(this.linkListRef)}
            .links=${this._links}
            @tagFilterAdded="${this.onTagFilterAdded}"
            @tagFilterRemoved="${this.onTagFilterRemoved}"
          ></sh-linklist>
        </div>
      </sh-vsplit>
    `;
  }

  override render() {
    if (this.narrow) {
      return this.renderNarrow();
    }
    return this.renderWide();
  }
}
