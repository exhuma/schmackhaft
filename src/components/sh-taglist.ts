import { css, html, LitElement } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { Counter } from "../core/counter";
import { Links } from "../core/links";
import { Chip } from "./sh-chip";

@customElement("sh-taglist")
export class TagList extends LitElement {
  static styles = css`
    .countedTag {
      white-space: nowrap;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    .tagCount {
      border: 1px solid #888;
      background-color: #efefef;
      margin-left: -0.5rem;
      display: inline-block;
      padding: 0 0.5rem;
    }
  `;

  @property({ type: Object })
  links: Links | null = null;

  onFilterTagClick(evt: Event) {
    if (!evt.currentTarget) {
      console.error("Tag click event with empty target");
      return;
    }
    let chip = evt.currentTarget as Chip;
    this.dispatchEvent(
      new CustomEvent("tagFilterAdded", { detail: chip.name })
    );
  }

  onUnfilterTagClick(evt: Event) {
    if (!evt.currentTarget) {
      console.error("Tag click event with empty target");
      return;
    }
    let chip = evt.currentTarget as Chip;
    this.dispatchEvent(
      new CustomEvent("tagFilterRemoved", { detail: chip.name })
    );
  }

  renderFilterTag(tag: [string, number]) {
    return html`<div class="countedTag">
      <sh-chip @click="${this.onFilterTagClick}" name="${tag[0]}"></sh-chip
      >&nbsp;<span class="tagCount">${tag[1]}</span>
    </div>`;
  }

  renderUnfilterTag(tag: string) {
    return html`<sh-chip
        @click="${this.onUnfilterTagClick}"
        name="${tag}"
      ></sh-chip
      ><br />`;
  }

  override render() {
    if (!this.links) {
      return "No links";
    }
    let counter = new Counter<string>();
    this.links.filtered.forEach((element) => {
      counter.addAll(element.tags);
    });
    let unfilterTags = this.links.searchedTags.map(
      this.renderUnfilterTag,
      this
    );
    let filterTags = counter.sortedEntries().map(this.renderFilterTag, this);
    return html`${unfilterTags}
      <hr />
      ${filterTags}`;
  }
}
