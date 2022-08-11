import "material-icon-component/md-icon.js";
import { LitElement, css, html } from "lit";
import { TagState, TagStateTransition } from "../types";
import { customElement, property } from "lit/decorators.js";
// @ts-ignore
import chipStyles from "./sh-chip.css";
import { classMap } from "lit/directives/class-map.js";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-chip")
export class Chip extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    // @ts-ignore
    css([chipStyles]),
  ];

  @property()
  name = "";

  @property()
  count = 0;

  @property({ type: Boolean })
  dense: boolean = false;

  @property({ type: TagState })
  state: TagState = TagState.NEUTRAL;

  onClick(evt: Event) {
    this.dispatchEvent(
      new CustomEvent("chipClicked", {
        detail: { name: this.name, direction: TagStateTransition.ADVANCE },
      })
    );
  }

  onAuxClick(evt: Event) {
    evt.preventDefault();
    this.dispatchEvent(
      new CustomEvent("chipClicked", {
        detail: { name: this.name, direction: TagStateTransition.REVERSE },
      })
    );
  }

  override render() {
    let dynamicClasses = {
      neutral: this.state === TagState.NEUTRAL,
      included: this.state === TagState.INCLUDED,
      excluded: this.state === TagState.EXCLUDED,
      ["rounded-l"]: this.state === TagState.NEUTRAL,
      ["rounded"]: this.state !== TagState.NEUTRAL,
    };
    let label;
    let actionText;
    switch (this.state) {
      case TagState.INCLUDED:
        label = html`<md-icon>label</md-icon>`;
        actionText = "exclude links with this tag";
        break;
      case TagState.EXCLUDED:
        label = html`<md-icon>label_off</md-icon>`;
        actionText = "ignore this tag";
        break;
      case TagState.NEUTRAL:
      default:
        label = html`<md-icon outlined>label</md-icon>`;
        actionText = "include only links with this tag";
        break;
    }
    let countBox = html``;
    if (this.state === TagState.NEUTRAL) {
      countBox = html`
        <div
          class="border-r border-t border-b rounded-r px-1 dark:border-slate-500"
        >
          ${this.count}
        </div>
      `;
    }
    return html`
      <div class="flex flex-row flex-nowrap gap-0">
        <div
          @click="${this.onClick}"
          @contextmenu="${this.onAuxClick}"
          title="Click to ${actionText}"
          class="chip border dark:border-slate-500 px-1 cursor-pointer flex gap-1 flex-row flex-nowrap items-center ${classMap(
            dynamicClasses
          )}"
        >
          <div>${label}</div>
          <div>${this.name}</div>
        </div>
        ${countBox}
      </div>
    `;
  }
}
