import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("sh-vsplit")
class VSplit extends LitElement {
  static styles = css`
    .vsplit {
      display: flex;
      justify-content: left;
      gap: 0.5rem;
    }

    .lhs {
      max-width: 15rem;
      max-height: 98vh;
      overflow: auto;
      padding: 1vh;
    }

    .rhs {
      flex-grow: 4;
      max-height: 98vh;
      padding: 1vh;
      overflow: auto;
    }
  `;

  override render() {
    return html`
      <div class="vsplit">
        <div class="lhs"><slot name="left"></slot></div>
        <div class="rhs"><slot name="right"></slot></div>
      </div>
    `;
  }
}
