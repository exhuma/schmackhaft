import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
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
  `;

  @property()
  name = "";

  @property({ type: Boolean })
  dense: boolean = false;

  onClick(evt: Event) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: this.name }));
  }

  override render() {
    let dynamicClasses = { dense: this.dense };
    return html`<div
      class="chip ${classMap(dynamicClasses)}"
      @click="${this.onClick}"
    >
      ${this.name}
    </div>`;
  }
}
