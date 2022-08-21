import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
import { Settings } from "../model/settings";
import { TBookmarkSource } from "../types";

@customElement("sh-fullscreen-settings")
export class FullScreenSettings extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      #ToolBar {
        display: flex;
        flex-direction: row;
        margin-bottom: 1em;
        justify-content: space-between;
      }

      #ToolBarLeft {
        display: flex;
        flex-direction: row;
      }

      DIV::part(ToolBarRight) {
        display: flex;
        flex-direction: row;
      }

      #MainContent {
        display: flex;
        flex-direction: column;
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
    `,
  ];

  private _textAreaRef: Ref<HTMLTextAreaElement> = createRef();
  private _selectorRef: Ref<HTMLSelectElement> = createRef();

  private _settings: Settings = new Settings();

  set settings(value: string) {
    this._settings = Settings.fromJson(value);
    this.requestUpdate();
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
        this._settings.sources[sourceIndex].settings
      );
    }
  }

  _onTextAreaBlur(evt) {
    let textArea = this._textAreaRef.value as HTMLTextAreaElement | null;
    let selector = this._selectorRef.value as HTMLSelectElement | null;
    if (textArea && selector && selector.selectedIndex !== 0) {
      let newSettings = null;
      try {
        newSettings = JSON.parse(textArea.value);
      } catch (error) {
        console.error(error);
      }
      if (newSettings !== null) {
        let sourceIndex = Number.parseInt(selector.value, 10);
        this._settings.sources[sourceIndex].settings = newSettings;
      }
    }
  }

  _onFaviconUrlBlur(evt: Event) {
    if (!evt || !evt.target) {
      return;
    }
    this._settings.favIconTemplate = evt.target.value;
  }

  _renderSelectOption(value: TBookmarkSource, index: number) {
    return html`<option value="${index}">Source: ${value.type}</option>`;
  }

  @property({ type: String })
  get settings() {
    return this._settings.toJson();
  }

  override render() {
    return html`
    <div id="ToolBar">
        <div id="ToolBarLeft">
          <!-- placeholder -->
        </div>
        <div part="ToolBarRight">
            <button part="addButton">Add</button>
            <button part="configureButton">Configure</button>
            <button part="showLinksButton">Show Links</button>
        </div>
    </div>
    <div id="MainContent">
      <h1>Settings</h1>
        <div class="keyValueField">
            <label for="favIconTemplateUrl">Favicon Service URL:</label>
            <input part="favIconTemplateUrl" @blur=${
              this._onFaviconUrlBlur
            } ="favIconTemplateUrl" value="${
      this._settings.favIconTemplate
    }" placeholder="https://www.google.com/s2/favicons?domain={domain}&sz=32"></input>
        </div>
        <h1>Sources</h1>
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
        <button @click="${this._onSaveClick}" part="saveButton">Save</button>
    </div>
    `;
  }
}
