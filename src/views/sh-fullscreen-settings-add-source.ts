import { BookmarkSource, TBookmarkSource, getEnumByValue } from "../types";
import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("sh-fullscreen-settings-add-source")
export class FullScreenSettingsAddSource extends LitElement {
  static styles = [
    css`
      :host {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 1em;
      }

      .fullWidth {
        grid-column-start: 1;
        grid-column-end: span 2;
      }

      DIV {
        align-self: center;
      }

      TEXTAREA,
      INPUT[type="text"] {
        width: 100%;
      }
    `,
  ];

  @state()
  _jsonError: string = "";

  _source: TBookmarkSource = {
    type: BookmarkSource.HTTP,
    settings: {},
  };

  _onTypeChanged(evt: { target: { value: string } }) {
    let enumValue = getEnumByValue(BookmarkSource, evt.target.value);
    this._source.type = enumValue;
  }

  _onSettingsBlurred(evt: { target: { value: string } }) {
    let value = "{}";
    if (evt.target.value.trim() !== "") {
      value = evt.target.value;
    }
    try {
      this._source.settings = JSON.parse(value);
      this._jsonError = "";
    } catch (error: any) {
      this._jsonError = error.message;
    }
  }

  _onSaveClicked() {
    if (this._jsonError !== "") {
      // TODO: Properly display the error to the user
      console.error(`Unable to save. Invalid JSON: ${this._jsonError}`);
      return;
    }
    this.dispatchEvent(
      new CustomEvent("sourceAdded", { detail: JSON.stringify(this._source) })
    );
  }

  _renderSourceTypeOption(name: string) {
    let displayString = name;
    switch (name) {
      case BookmarkSource.HTTP:
        displayString = "External JSON file";
        break;
      case BookmarkSource.BROWSER:
        displayString = "Browser Bookmarks";
        break;
      case BookmarkSource.EXTENSION_STORAGE:
        displayString = "Local extension storage";
        break;
    }
    return html` <option value="${name}">${displayString}</option> `;
  }

  override render() {
    return html`
      <div><label for="nameTextField">Name</label></div>
      <div><input type="text" id="nameTextField" /></div>

      <div><label for="tagsTextField">Default Tags</label></div>
      <div><input type="text" id="tagsTextField" /></div>

      <div><label for="enabledCheckBox">Enabled</label></div>
      <div><input type="checkbox" id="enabledCheckBox" /></div>

      <div><label for="enableFaviconsCheckBox">Enable Favicons</label></div>
      <div><input type="checkbox" id="enableFaviconsCheckBox" /></div>

      <div><label for="faviconUrlTextField">Favicon Template URL</label></div>
      <div><input type="text" id="faviconUrlTextField" /></div>

      <div><label for="typeSelector">Source Type</label></div>
      <div>
        <select id="typeSelector" @change=${this._onTypeChanged}>
          ${Object.values(BookmarkSource).map(this._renderSourceTypeOption)}
        </select>
      </div>

      <div class="fullWidth">
        <label for="sourceSettingsEditor">Source Settings</label>
      </div>
      <div class="fullWidth">
        <textarea
          id="sourceSettingsEditor"
          @blur=${this._onSettingsBlurred}
        ></textarea>
      </div>

      <div class="fullWidth">
        <button style="width: 100%;" @click=${this._onSaveClicked}>Save</button>
      </div>
    `;
  }
}
