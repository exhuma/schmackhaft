import { css, html, LitElement } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { Counter } from "../core/counter";
import { Links } from "../core/links";
import { Chip } from "./sh-chip";

@customElement("sh-taglist")
export class TagList extends LitElement {
  static styles = css`
    .tagCount {
      border: 1px solid #888;
      background-color: #efefef;
      margin-left: -0.5rem;
      display: inline-block;
      padding: 0 0.5rem;
    }
    .countedTag {
      white-space: nowrap;
      margin-top: 5px;
      margin-bottom: 5px;
      display: inline-block;
      margin-left: 0.2rem;
    }
    .countedTag.dense {
      font-size: 0.6em;
      margin-top: 0;
      margin-bottom: 0;
    }
    .countedTag.dense .tagName {
      border-radius: 2px;
    }
    .countedTag.dense .tagCount {
      border: 1px solid #888;
      background-color: #efefef;
      margin-left: 0rem;
      padding: 0rem 0.2rem;
      border-left: 0;
    }
  `;

  @property({ type: Object })
  links: Links | null = null;

  @property({ type: Boolean })
  dense: boolean = false;

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
    let dynamicClasses = { dense: this.dense };
    return html`<div class="countedTag ${classMap(dynamicClasses)}">
      <sh-chip
        @click="${this.onFilterTagClick}"
        class="tagName"
        name="${tag[0]}"
        ?dense="${this.dense}"
      ></sh-chip
      ><span class="tagCount">${tag[1]}</span>
    </div>`;
  }

  renderUnfilterTag(tag: string) {
    let dynamicClasses = { dense: this.dense };
    return html`<div class="countedTag ${classMap(dynamicClasses)}">
      <sh-chip
        @click="${this.onUnfilterTagClick}"
        class="tagName"
        name="${tag}"
        ?dense="${this.dense}"
      ></sh-chip>
    </div>`;
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
