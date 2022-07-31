import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Link } from "../../model/link";
import { Links } from "../core/links";

@customElement("sh-linklist")
export class LinkList extends LitElement {
  static styles = css``;

  @property({ type: Object })
  links = new Links();

  @property({ type: Boolean })
  renderSearchedTags: boolean = true;

  @property({ type: Boolean })
  dense: boolean = false;

  @property()
  favIconTemplate = "";

  _renderTag(tagName: string, component: any) {
    return html`<sh-chip name="${tagName}" data-tag="${tagName}"
      >${tagName}</sh-chip
    >`;
  }

  _renderLink(link: Link) {
    let tagsWithStates = link.tags.map((tagName) => {
      return [tagName, this.links.getState(tagName)];
    });
    return html`
      <sh-link
        title="${link.title}"
        description="${link.description}"
        href="${link.href}"
        img="${link.image}"
        favIconTemplate="${this.favIconTemplate}"
        .tags="${tagsWithStates}"
        ?dense="${this.dense}"
        @chipClicked="${this.onChipClicked}"
      ></sh-link>
    `;
  }

  onChipClicked(evt: { detail: any }) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: evt.detail }));
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
