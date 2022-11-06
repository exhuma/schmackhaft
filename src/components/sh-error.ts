import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TBookmarkSource } from "../types";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-error")
export class Error extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    css`
      PRE CODE {
        font-family: "Fira Code", monospace;
      }
      .closeIcon {
        float: right;
        cursor: pointer;
      }
    `,
  ];

  @property()
  error: { source: TBookmarkSource; errorMessage: string } | null = null;

  _closeError() {
    this.dispatchEvent(new CustomEvent("error-closed"));
  }

  _renderCloseIcon() {
    return html`
      <div
        @click="${this._closeError}"
        class="closeIcon border border-red-800 bg-red-300 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    `;
  }

  override render() {
    if (!this.error) {
      return html`Empty error (nothing to display)`;
    }
    return html`<div class="border border-red-800 bg-red-200 rounded p-2">
      ${this._renderCloseIcon()}
      <strong>Error:</strong> <em>${this.error.errorMessage}</em><br />
      <strong>Source Type:</strong> ${this.error.source.type}<br />
      <strong>Source Settings:</strong>
      <pre class="overflow-auto">
${JSON.stringify(this.error.source.settings, null, 2)}</pre
      >
    </div> `;
  }
}
