import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import { Links } from "../core/links";
import { Link } from "../model/link";

@customElement("sh-linklist")
export class LinkList extends LitElement {
  static styles = css``;

  @property({ type: Object })
  links = new Links();

  @property({ type: Boolean })
  renderSearchedTags: boolean = true;

  @property({ type: Boolean })
  dense: boolean = false;

  _renderTag(tagName: string, component: any) {
    return html`<sh-chip
      name="${tagName}"
      data-tag="${tagName}"
      @click="${this._removeTag}"
      >${tagName}</sh-chip
    >`;
  }

  _renderLink(link: Link) {
    return html`
      <sh-link
        title="${link.title}"
        description="${link.description}"
        href="${link.href}"
        img="${link.img}"
        .tags="${link.tags}"
        dense="${this.dense}"
        @chipClicked="${this.onChipClicked}"
      ></sh-link>
    `;
  }

  _removeTag(event: { currentTarget: HTMLElement }) {
    const tagName = event.currentTarget?.dataset.tag;
    if (!tagName) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("tagFilterRemoved", { detail: tagName })
    );
  }

  onChipClicked(evt: { detail: any }) {
    this.dispatchEvent(
      new CustomEvent("tagFilterAdded", { detail: evt.detail })
    );
  }

  override render() {
    if (this.renderSearchedTags) {
      return html`
        <p>${this.links.searchedTags.map(this._renderTag, this)}</p>
        ${this.links.filtered.map(this._renderLink, this)}
      `;
    }
    return html` ${this.links.filtered.map(this._renderLink, this)} `;
  }
}
