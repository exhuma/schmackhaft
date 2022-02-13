import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("sh-chip")
class Chip extends LitElement {
  static styles = css`
    .chip {
      border: 1px solid #9494bb;
      background-color: #e0e0ee;
      margin-right: 0.5rem;
      padding: 0 0.8rem;
      border-radius: 1rem;
    }
  `;

  @property()
  name = "";

  override render() {
    return html`<span class="chip">${this.name}</span>`;
  }
}
