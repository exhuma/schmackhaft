import { css, html, LitElement } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { TagState } from "../../types";
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
    .countedTag,
    .unfilterTag {
      white-space: nowrap;
      margin-top: 5px;
      margin-bottom: 5px;
      display: inline-block;
      margin-left: 0.2rem;
    }
    .countedTag.dense,
    .unfilterTag.dense {
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 0;
    }
    .countedTag.dense .tagName,
    .unfilterTag.dense .tagName {
      border-radius: 2px;
    }
    .countedTag.dense .tagCount,
    .unfilterTag.dense .button {
      border: 1px solid #888;
      background-color: #efefef;
      margin-left: 0rem;
      padding: 0rem 0.2rem;
      border-left: 0;
    }
    .unfilterTag.dense .button {
      background-color: #e0c5c5;
      cursor: pointer;
    }
  `;

  @property({ type: Object })
  links: Links | null = null;

  @property({ type: Boolean })
  dense: boolean = false;

  onChipClicked(evt: {detail: any}) {
    this.dispatchEvent(
      new CustomEvent("chipClicked", { detail: evt.detail })
    );
  }

  renderFilterTag(tag: [string, number]) {
    if (!this.links) {
      return null;
    }
    let state = this.links.getState(tag[0]);
    let dynamicClasses = { dense: this.dense };
    return html`<div
      class="countedTag ${classMap(dynamicClasses)}"
    >
      <sh-chip
        .state="${state}"
        @chipClicked="${this.onChipClicked}"
        class="tagName"
        name="${tag[0]}"
        ?dense="${this.dense}"></sh-chip
      ><span class="tagCount">${tag[1]}</span>
    </div>`;
  }

  renderUnfilterTag(tag: string) {
    return this.renderFilterTag([tag, 0]); // TODO cleanup
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
    let excludedTags = this.links.excludedTags.map(
      this.renderUnfilterTag,
      this
    );
    let filterTags = counter.sortedEntries().filter((e) => {
      return !this.links?.searchedTags.includes(e[0]);
    });
    let filterTagElements = filterTags.map(this.renderFilterTag, this);
    return html`${excludedTags} ${unfilterTags} ${filterTagElements}`;
  }
}
