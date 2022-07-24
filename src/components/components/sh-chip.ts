import "material-icon-component/md-icon.js";
import { LitElement, css, html } from "lit";
import { TagState, TagStateTransition } from "../../types";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-chip")
export class Chip extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    css`
      .chip.neutral {
      }

      .chip.included {
        background-color: #aaffaa;
      }

      .chip.excluded {
        background-color: #ffaaaa;
      }
    `,
  ];

  @property()
  name = "";

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
    return html`
      <div
        @click="${this.onClick}"
        @contextmenu="${this.onAuxClick}"
        title="Click to ${actionText}"
        class="chip border px-1 rounded-l cursor-pointer flex gap-1 flex-row flex-nowrap items-center ${classMap(
          dynamicClasses
        )}"
      >
        <div>${label}</div>
        <div>${this.name}</div>
      </div>
    `;
  }
}
