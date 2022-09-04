import { BookmarkSource, TBookmarkSource, getEnumByValue } from "../types";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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

      TEXTAREA {
        min-height: 300px;
      }

      DIV.error {
        border: 1px solid red;
        margin: 1em 3em;
      }

      DIV.error DIV {
        padding: 0.2em 1em;
      }

      DIV.error DIV.errorType {
        background-color: rgba(255, 0, 0, 0.2);
        border-bottom: 1px solid red;
        font-weight: bolder;
      }
    `,
  ];

  @state()
  _jsonError: string = "";

  _source: TBookmarkSource = {
    type: BookmarkSource.HTTP,
    settings: {},
    name: "",
    isEnabled: true,
    hasFaviconsEnabled: true,
    favIconTemplateURL: "",
    defaultTags: [],
  };

  @property({ type: String })
  get source() {
    return JSON.stringify(this._source);
  }

  set source(data: string) {
    this._source = JSON.parse(data);
    this.requestUpdate();
  }

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
      this._dispatchChangeEvent();
      this._jsonError = "";
    } catch (error: any) {
      this._jsonError = error.message;
    }
  }

  _renderSourceTypeOption(name: string, currentName: string = "") {
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
    return html`
      <option value="${name}" ?selected=${name === currentName}>
        ${displayString}
      </option>
    `;
  }

  _dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("change", { detail: { sourceSetting: this.source } })
    );
  }

  _onNameChanged(evt: { target: { value: string } }) {
    this._source.name = evt.target.value;
    this._dispatchChangeEvent();
  }

  _onTagsChanged(evt: { target: { value: string } }) {
    this._source.defaultTags = evt.target.value
      .split(",")
      .map((item) => item.trim());
    this._dispatchChangeEvent();
  }

  _onEnabledChanged(evt: { target: { checked: boolean } }) {
    this._source.isEnabled = evt.target.checked;
    this._dispatchChangeEvent();
  }

  _onFaviconsEnabledChanged(evt: { target: { checked: boolean } }) {
    this._source.hasFaviconsEnabled = evt.target.checked;
    this._dispatchChangeEvent();
  }

  _onFaviconUrlChanged(evt: { target: { value: string } }) {
    this._source.favIconTemplateURL = evt.target.value;
    this._dispatchChangeEvent();
  }

  override render() {
    let errorDisplay = html``;
    if (this._jsonError !== "") {
      errorDisplay = html`
        <div class="error">
          <div class="errorType">JSON Error</div>
          <div class="errorMessage">${this._jsonError}</div>
        </div>
      `;
    }
    return html`
      <div><label for="nameTextField">Name</label></div>
      <div>
        <input
          type="text"
          id="nameTextField"
          value=${this._source.name}
          @change=${this._onNameChanged}
        />
      </div>

      <div><label for="tagsTextField">Default Tags</label></div>
      <div>
        <input
          type="text"
          id="tagsTextField"
          value=${this._source.defaultTags}
          @change=${this._onTagsChanged}
        />
      </div>

      <div><label for="enabledCheckBox">Enabled</label></div>
      <div>
        <input
          type="checkbox"
          id="enabledCheckBox"
          ?checked=${this._source.isEnabled}
          @change=${this._onEnabledChanged}
        />
      </div>

      <div><label for="enableFaviconsCheckBox">Enable Favicons</label></div>
      <div>
        <input
          type="checkbox"
          id="enableFaviconsCheckBox"
          ?checked=${this._source.hasFaviconsEnabled}
          @change=${this._onFaviconsEnabledChanged}
        />
      </div>

      <div><label for="faviconUrlTextField">Favicon Template URL</label></div>
      <div>
        <input
          type="text"
          id="faviconUrlTextField"
          value=${this._source.favIconTemplateURL}
          @change=${this._onFaviconUrlChanged}
        />
      </div>

      <div><label for="typeSelector">Source Type</label></div>
      <div>
        <select id="typeSelector" @change=${this._onTypeChanged}>
          ${Object.values(BookmarkSource).map((type) => {
            return this._renderSourceTypeOption(type, this._source.type);
          })}
        </select>
      </div>

      <div class="fullWidth">
        <label for="sourceSettingsEditor">Source Settings</label>
      </div>
      <div class="fullWidth">
        <textarea id="sourceSettingsEditor" @blur=${this._onSettingsBlurred}>
${JSON.stringify(this._source.settings, null, 2)}</textarea
        >
        ${errorDisplay}
      </div>
    `;
  }
}
