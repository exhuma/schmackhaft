import "material-icon-component/md-icon.js";
import { LitElement, css, html } from "lit";
import { TagState, TagStateTransition } from "../../types";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("sh-chip")
export class Chip extends LitElement {
  static styles = css`
    .chip {
      border: 1px solid #9494bb;
      background-color: #e0e0ee;
      padding: 0 0.8rem;
      border-radius: 1rem;
      cursor: pointer;
      white-space: nowrap;
      display: inline-block;
      margin-top: 0.2rem;
    }

    .chip.dense {
      border-radius: 2px;
      padding: 0 0.2rem;
    }

    .chip.neutral {
      background-color: #e0e0ee;
    }

    .chip.included {
      background-color: #aaffaa;
    }

    .chip.excluded {
      background-color: #ffaaaa;
    }
  `;

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
      dense: this.dense,
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
    return html`<div
      class="chip ${classMap(dynamicClasses)}"
      @click="${this.onClick}"
      @contextmenu="${this.onAuxClick}"
      title="Click to ${actionText}"
    >
      ${label} ${this.name}
    </div>`;
  }
}
