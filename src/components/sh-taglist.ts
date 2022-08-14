import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Counter } from "../core/counter";
import { Links } from "../model/link-collection";
import { classMap } from "lit/directives/class-map.js";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-taglist")
export class TagList extends LitElement {
  // @ts-ignore
  static styles = css([tailwind]);

  @property({ type: Object })
  links: Links | null = null;

  @property({ type: Boolean })
  dense: boolean = false;

  onChipClicked(evt: { detail: any }) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: evt.detail }));
  }

  renderFilterTag(tag: [string, number]) {
    if (!this.links) {
      return null;
    }
    let state = this.links.getState(tag[0]);
    return html`
      <sh-chip
        .state="${state}"
        @chipClicked="${this.onChipClicked}"
        name="${tag[0]}"
        count="${tag[1]}"
        ?dense="${this.dense}"
      ></sh-chip>
    `;
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
