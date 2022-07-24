import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Counter } from "../core/counter";
import { Links } from "../core/links";
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
    let dynamicClasses = { dense: this.dense };
    return html`
      <div class="inline-block mb-1">
        <div
          class="flex flex-row flex-nowrap gap-0 ${classMap(dynamicClasses)}"
        >
          <sh-chip
            .state="${state}"
            @chipClicked="${this.onChipClicked}"
            class="tagName"
            name="${tag[0]}"
            ?dense="${this.dense}"
          ></sh-chip
          ><span
            class="border-r border-t border-b rounded-r px-1 dark:border-slate-500"
            >${tag[1]}</span
          >
        </div>
      </div>
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
