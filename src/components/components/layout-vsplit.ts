import "material-icon-component/md-icon.js";
import { LitElement, css, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { customElement } from "lit/decorators.js";

@customElement("layout-vsplit")
export class Vsplit extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #top {
      flex-grow: 0;
      flex-shrink: 0;
      resize: vertical;
      overflow: auto;
      height: 25%;
      max-height: calc(100% - 0.5em);
      margin-bottom: 0.5em;
      padding-bottom: 0.5em;
      border-bottom: var(--layout-vsplit-separator-border, 1px solid #ccc);
    }

    #bottom {
      height: 100%;
      overflow: auto;
    }
  `;

  topRef = createRef();
  bottomRef = createRef();

  onClick() {
    console.log(this.topRef);
  }

  override render() {
    return html`
      <div id="top" ${ref(this.topRef)}><slot name="top"></slot></div>
      <div id="bottom" ${ref(this.bottomRef)}><slot name="bottom"></slot></div>
    `;
  }
}
