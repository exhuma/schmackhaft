import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BookmarkSource } from "../../types";
import tailwind from "../tailwind.css";

const SourceSettingKeys = {
  [BookmarkSource.BROWSER]: [],
  [BookmarkSource.HTTP]: ["url"],
  [BookmarkSource.EXTENSION_STORAGE]: [],
};

@customElement("sh-source-settings")
export class SourceSettings extends LitElement {
  // @ts-ignore
  static styles = [css([tailwind])];

  @property()
  private type = "";

  private _settings = {};

  set settings(value: string) {
    let data = JSON.parse(value);
    this._settings = data;
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return JSON.stringify(this._settings);
  }

  _onTypeChanged(event) {
    this.dispatchEvent(
      new CustomEvent("typeChanged", {
        detail: {
          newValue: BookmarkSource[event.target.value],
        },
      })
    );
  }

  _onConfigItemChanged(event) {
    this._settings[event.target.name] = event.target.value;
    this.dispatchEvent(
      new CustomEvent("settingsChanged", {
        detail: {
          newValue: this._settings,
        },
      })
    );
  }

  _renderTypeOption([key, value]) {
    return html`<option value=${key}>${value}</option>`;
  }

  _renderConfigItem([key, value]) {
    return html`${key}:
      <input
        @change=${this._onConfigItemChanged}
        class="border px-2"
        type="text"
        value="${value}"
        name="${key}"
      /><br />`;
  }

  override render() {
    return html`
      Source Type:
      <select @change=${this._onTypeChanged}>
        ${Object.entries(BookmarkSource).map(this._renderTypeOption.bind(this))}
      </select>
      <br />
      ${Object.entries(this._settings).map(this._renderConfigItem.bind(this))}
      <button class="border">Save</button>
    `;
  }
}
