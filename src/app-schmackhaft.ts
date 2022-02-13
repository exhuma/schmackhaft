import { css, html, LitElement } from "lit";
import { state, customElement } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import "./components/sh-link";
import { Links } from "./core/links";
import { Link } from "./model/link";

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
      ></sh-link>
    `;
  }

  _renderTag(tagName: string, component: any) {
    return html`<span
      class="tag"
      data-tag="${tagName}"
      @click="${this._removeTag}"
      >${tagName}</span
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
    console.log(this.searchTextRef.value.value);
  }

  override render() {
    return html`
      <input
        ${ref(this.searchTextRef)}
        placeholder="search"
        type="text"
      /><input
        type="button"
        value="Go!"
        @click="${this._onSearchExecuted}"
      /><br />
      <input ${ref(this.tagsRef)} placeholder="tags" type="text" /><input
        type="button"
        value="Add"
        @click="${this._addTag}"
      /><br />
      <p class="tags">${this.links.searchedTags.map(this._renderTag, this)}</p>
      ${this.links.filtered.map(this._renderLink)}
    `;
  }
}
