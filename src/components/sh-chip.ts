import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("sh-chip")
export class Chip extends LitElement {
  static styles = css`
    .chip {
      border: 1px solid #9494bb;
      background-color: #e0e0ee;
      margin-right: 0.5rem;
      padding: 0 0.8rem;
      border-radius: 1rem;
      cursor: pointer;
    }
  `;

  @property()
  name = "";

  onClick(evt: Event) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: this.name }));
  }

  override render() {
    return html`<span class="chip" @click="${this.onClick}"
      >${this.name}</span
    >`;
  }
}
