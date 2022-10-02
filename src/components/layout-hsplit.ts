import "material-icon-component/md-icon.js";
import { LitElement, css, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { customElement } from "lit/decorators.js";

@customElement("layout-hsplit")
export class Hsplit extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      overflow: hidden;
    }

    #left {
      flex-grow: 0;
      flex-shrink: 0;
      resize: horizontal;
      overflow: auto;
      width: 100px;
      max-width: calc(100% - 0.5em);
      margin-right: 0.5em;
      padding-right: 0.5em;
      border-right: var(--layout-hsplit-separator-border, 1px solid #ccc);
    }

    #right {
      width: 100%;
      overflow: auto;
    }
  `;

  leftRef = createRef();
  rightRef = createRef();

  onClick() {
    console.log(this.leftRef);
  }

  override render() {
    return html`
      <div id="left" ${ref(this.leftRef)}><slot name="left"></slot></div>
      <div id="right" ${ref(this.rightRef)}><slot name="right"></slot></div>
    `;
  }
}
