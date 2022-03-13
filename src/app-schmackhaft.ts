import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import "./components/sh-vsplit";
import "./components/sh-taglist";
import "./components/sh-linklist";
import "@material/mwc-textfield";
import "@material/mwc-button";
import { demoLinks } from "./data";
import { LinkList } from "./components/sh-linklist";
import { TagList } from "./components/sh-taglist";

@customElement("app-schmackhaft")
class Schmackhaft extends LitElement {
  static styles = css`
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
  `;

  tagsRef: Ref<HTMLInputElement> = createRef();
  searchTextRef: Ref<HTMLInputElement> = createRef();
  linkListRef: Ref<LinkList> = createRef();
  tagListRef: Ref<TagList> = createRef();

  links = demoLinks;

  _addTag() {
    if (!this.tagsRef.value) {
      return;
    }
    const tagName = this.tagsRef.value.value;
    this.links.filter(tagName);
    this.requestUpdate();
  }

  _onSearchExecuted() {
    if (!this.searchTextRef.value) {
      return;
    }
    this.links.search(this.searchTextRef.value.value);
    this.requestUpdate();
  }

  onTagFilterAdded(evt: { detail: string }) {
    let tag = evt.detail;
    this.links.filter(tag);
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  onTagFilterRemoved(evt: { detail: string }) {
    let tag = evt.detail;
    this.links.unFilter(tag);
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  override render() {
    return html`
      <sh-vsplit>
        <div slot="left">
          <sh-taglist
            ${ref(this.tagListRef)}
            @tagFilterAdded="${this.onTagFilterAdded}"
            @tagFilterRemoved="${this.onTagFilterRemoved}"
            .links="${this.links}"
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
            .links=${this.links}
            @tagFilterAdded="${this.onTagFilterAdded}"
            @tagFilterRemoved="${this.onTagFilterRemoved}"
          ></sh-linklist>
        </div>
      </sh-vsplit>
    `;
  }
}
