import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
// @ts-ignore
import tailwind from "../tailwind.css";

@customElement("sh-http-settings")
export class HttpSettings extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    css``,
  ];

  @state()
  _settings: { url: string } = { url: "" };

  set settings(value: string) {
    this._settings = JSON.parse(value);
  }

  @property()
  get settings() {
    return JSON.stringify(this._settings);
  }

  onUrlChanged(event: { target: HTMLInputElement }) {
    this._settings.url = event.target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: this._settings,
        },
      })
    );
  }

  override render() {
    return html`
      <div>
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >External JSON File</label
        >
        <input
          type="text"
          helper="Set this to the empty string to remove it from the list"
          value="${this._settings.url}"
          @change="${this.onUrlChanged}"
          placeholder="https://my.domain.tld/my-bookmarks.json"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    `;
  }
}
