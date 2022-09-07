import "./sh-fullscreen-settings-add-source";
import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
import { FullScreenSettingsAddSource } from "./sh-fullscreen-settings-add-source";
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

      INPUT[part="favIconTemplateUrl"] {
        flex-grow: 99;
      }

      P.hint {
        margin: 0;
        margin-bottom: 1em;
        font-size: 80%;
        color: #555;
      }
    `,
  ];

  private _sourceSettingsRef: Ref<FullScreenSettingsAddSource> = createRef();
  private _selectorRef: Ref<HTMLSelectElement> = createRef();

  private _settings: Settings = new Settings();

  set settings(value: string) {
    this._settings = Settings.fromJson(value);
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return this._settings.toJson();
  }

  _onSelectionChanged(evt: Event) {
    if (!evt || !evt.target) {
      return;
    }

    let target = evt.target as HTMLInputElement;
    let sourceIndex = Number.parseInt(target.value, 10);
    let editor = this._sourceSettingsRef.value;
    if (editor) {
      editor.source = JSON.stringify(this._settings.sources[sourceIndex]);
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

  _onSourceSettingsChanged(evt: CustomEvent) {
    let sourceSetting = JSON.parse(evt.detail.sourceSetting);
    let selector = this._selectorRef.value as HTMLSelectElement | null;
    if (selector && selector.selectedIndex !== 0) {
      let sourceIndex = Number.parseInt(selector.value, 10);
      this._settings.sources[sourceIndex] = sourceSetting;
    }
  }

  override render() {
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
      <sh-fullscreen-settings-add-source
        ${ref(this._sourceSettingsRef)}
        @change=${this._onSourceSettingsChanged}
      ></sh-fullscreen-settings-add-source>
    `;
  }
}
