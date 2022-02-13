import { css, html, LitElement } from "lit";
import { state, customElement } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import { Links } from "./core/links";
import { Link } from "./model/link";
import "@material/mwc-textfield";
import "@material/mwc-button";

@customElement("app-schmackhaft")
class Schmackhaft extends LitElement {
  static styles = css`
    .tag {
      border: 1px dashed blue;
      margin: 0.2rem;
    }
  `;

  tagsRef: Ref<HTMLInputElement> = createRef();
  searchTextRef: Ref<HTMLInputElement> = createRef();

  links = new Links([
    new Link(
      "https://example.com/1",
      ["tag1-1", "tag1-2", "group1"],
      "Link1",
      "/demo/example1.jpg",
      "description 1"
    ),
    new Link(
      "https://example.com/2",
      ["tag2-1", "tag2-2", "tag2-3", "group1", "group2"],
      "Link2",
      "/demo/example2.jpg",
      "description 2"
    ),
    new Link(
      "https://example.com/3",
      ["group2"],
      "Link3",
      "/demo/example3.jpg",
      "description 3"
    ),
  ]);

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

  onChipClicked(evt: Event) {
    this.links.filter(evt.detail);
    this.requestUpdate();
  }

  override render() {
    return html`
      <mwc-textfield
        ${ref(this.searchTextRef)}
        label="Search term"
      ></mwc-textfield>
      <mwc-button
        @click="${this._onSearchExecuted}"
        label="Search"
        icon="search"
      ></mwc-button>
      <mwc-textfield ${ref(this.tagsRef)} label="tags"></mwc-textfield>
      <mwc-button @click="${this._addTag}" label="Add" icon="add"></mwc-button>
      <br />
      <p class="tags">${this.links.searchedTags.map(this._renderTag, this)}</p>
      ${this.links.filtered.map(this._renderLink, this)}
    `;
  }
}
