import { css, html, LitElement } from "lit";
import { state, customElement } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import "./components/sh-vsplit";
import "./components/sh-taglist";
import { Links } from "./core/links";
import { Link } from "./model/link";
import "@material/mwc-textfield";
import "@material/mwc-button";
import { demoLinks } from "./data";

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

  links = demoLinks;

  _renderLink(link: Link) {
    return html`
      <sh-link
        title="${link.title}"
        description="${link.description}"
        href="${link.href}"
        img="${link.img}"
        .tags="${link.tags}"
        @chipClicked="${this.onChipClicked}"
      ></sh-link>
    `;
  }

  _renderTag(tagName: string, component: any) {
    return html`<sh-chip
      name="${tagName}"
      data-tag="${tagName}"
      @click="${this._removeTag}"
      >${tagName}</sh-chip
    >`;
  }

  _addTag() {
    if (!this.tagsRef.value) {
      return;
    }
    const tagName = this.tagsRef.value.value;
    this.links.filter(tagName);
    this.requestUpdate();
  }

  _removeTag(event: Event) {
    const tagName = event.currentTarget?.dataset.tag;
    if (!tagName) {
      return;
    }
    this.links.unFilter(tagName);
    this.requestUpdate();
  }

  _onSearchExecuted() {
    if (!this.searchTextRef.value) {
      return;
    }
    this.links.search(this.searchTextRef.value.value);
    this.requestUpdate();
  }

  onTagsModified(evt: { detail: string[] }) {
    this.links.reset();
    evt.detail.forEach((tagName) => {
      this.links.filter(tagName);
    });
    this.requestUpdate();
  }

  onChipClicked(evt: Event) {
    this.links.filter(evt.detail);
    this.requestUpdate();
  }

  override render() {
    return html`
      <sh-vsplit>
        <div slot="left">
          <sh-taglist
            @tagsModified="${this.onTagsModified}"
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
          <p class="tags">
            ${this.links.searchedTags.map(this._renderTag, this)}
          </p>
          ${this.links.filtered.map(this._renderLink, this)}
        </div>
      </sh-vsplit>
    `;
  }
}
