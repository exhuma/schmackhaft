import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { TagState } from "../../types";
import 'material-icon-component/md-icon.js';

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

  @property({type: TagState})
  state: TagState = TagState.NEUTRAL;

  onClick(evt: Event) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: {name: this.name} }));
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
        label = html`<md-icon>label</md-icon>`
        actionText = "exclude links with this tag";
        break;
      case TagState.EXCLUDED:
        label = html`<md-icon>label_off</md-icon>`
        actionText = "ignore this tag";
        break;
      case TagState.NEUTRAL:
      default:
        label = html`<md-icon outlined>label</md-icon>`
        actionText = "include only links with this tag";
        break;
    }
    return html`<div
      class="chip ${classMap(dynamicClasses)}"
      @click="${this.onClick}"
      title="Click to ${actionText}"
    >
      ${label} ${this.name}
    </div>`;
  }
}
