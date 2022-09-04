import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
import { Settings } from "../model/settings";
import { TBookmarkSource } from "../types";

@customElement("sh-fullscreen-settings-settings")
export class FullScreenSettingsSettings extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      H1 {
        margin-bottom: 0;
      }

      .keyValueField {
        display: flex;
        gap: 1em;
      }

      TEXTAREA {
        width: 100%;
        min-height: 300px;
      }

      INPUT[part="favIconTemplateUrl"] {
        flex-grow: 99;
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

      P.hint {
        margin: 0;
        margin-bottom: 1em;
        font-size: 80%;
        color: #555;
      }
    `,
  ];

  private _textAreaRef: Ref<HTMLTextAreaElement> = createRef();
  private _selectorRef: Ref<HTMLSelectElement> = createRef();

  @state()
  private _jsonError: string = "";

  private _settings: Settings = new Settings();

  set settings(value: string) {
    this._settings = Settings.fromJson(value);
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return this._settings.toJson();
  }

  _onSaveClick() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { newSettings: JSON.stringify(this._settings) },
      })
    );
  }

  _onSelectionChanged(evt: Event) {
    if (!evt || !evt.target) {
      return;
    }

    let target = evt.target as HTMLInputElement;
    let sourceIndex = Number.parseInt(target.value, 10);
    let textArea = this._textAreaRef.value;
    if (textArea) {
      textArea.value = JSON.stringify(
        this._settings.sources[sourceIndex].settings,
        null,
        2
      );
      this._jsonError = "";
    }
  }

  _onTextAreaBlur(evt: FocusEvent) {
    let textArea = this._textAreaRef.value as HTMLTextAreaElement | null;
    let selector = this._selectorRef.value as HTMLSelectElement | null;
    this._jsonError = "";
    if (textArea && selector && selector.selectedIndex !== 0) {
      let newSettings = null;
      try {
        newSettings = JSON.parse(textArea.value);
      } catch (error: any) {
        this._jsonError = error.message;
      }
      if (newSettings !== null) {
        let sourceIndex = Number.parseInt(selector.value, 10);
        this._settings.sources[sourceIndex].settings = newSettings;
      }
    }
  }

  _onFaviconUrlBlur(evt: FocusEvent) {
    if (!evt || !evt.target) {
      return;
    }
    // @ts-ignore
    this._settings.favIconTemplate = evt.target.value;
  }

  _renderSelectOption(value: TBookmarkSource, index: number) {
    return html`<option value="${index}">Source: ${value.type}</option>`;
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
    <h1>Settings</h1>
      <div class="keyValueField">
          <label for="favIconTemplateUrl">Favicon Service URL:</label>
          <input part="favIconTemplateUrl" @blur=${
            this._onFaviconUrlBlur
          } ="favIconTemplateUrl" value="${
      this._settings.favIconTemplate
    }" placeholder="https://www.google.com/s2/favicons?domain={domain}&sz=32"></input>
      </div>
      <p class="hint">Fallback external service providing favicons if they are not provided by the source backend.</p>
      <h1>Sources</h1>
      <p class="hint">
        Select a bookmark source below to access and edit its settings.
      </p>
      <select
            ${ref(this._selectorRef)}
            @change=${this._onSelectionChanged}
            name="source"
            part="sourceSelection">
          <option selected disabled>Select a source</option>
          ${this._settings.sources.map(this._renderSelectOption)}
          </select>
      <textarea
      @blur=${this._onTextAreaBlur}
      ${ref(this._textAreaRef)}
      part="currentSourceSettings"></textarea>
      ${errorDisplay}
      <button @click="${this._onSaveClick}" part="saveButton">Save</button>
    `;
  }
}
