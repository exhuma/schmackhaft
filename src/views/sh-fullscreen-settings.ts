import "./sh-fullscreen-settings-settings";
import "./sh-fullscreen-settings-add-source";
import "./sh-fullscreen-settings-show-links";
import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
import { FullScreenSettingsAddSource } from "./sh-fullscreen-settings-add-source";
import { FullScreenSettingsSettings } from "./sh-fullscreen-settings-settings";
import { Settings } from "../model/settings";

enum SelectedComponent {
  SETTINGS,
  ADD_SOURCE,
  SHOW_LINKS,
}

@customElement("sh-fullscreen-settings")
export class FullScreenSettings extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      H1 {
        margin-bottom: 0;
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
        width: 50%;
        margin: auto;
      }
    `,
  ];

  private _settings: Settings = new Settings();

  @state()
  private _selectedComponent: SelectedComponent = SelectedComponent.SETTINGS;

  private _addSourceRef: Ref<FullScreenSettingsAddSource> = createRef();
  private _editSourceRef: Ref<FullScreenSettingsSettings> = createRef();

  set settings(value: string) {
    this._settings = Settings.fromJson(value);
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return this._settings.toJson();
  }

  _setView(view: SelectedComponent) {
    this._selectedComponent = view;
  }

  _onAddSourceSaveClicked() {
    if (this._addSourceRef.value) {
      let data = JSON.parse(this._addSourceRef.value.source);
      this._settings.sources.push(data);
      this.dispatchEvent(
        new CustomEvent("change", { detail: { newSettings: this.settings } })
      );
    }
  }

  _onChangeSettingsSaveClicked() {
    if (this._editSourceRef.value) {
      this.settings = this._editSourceRef.value.settings;
      this.dispatchEvent(
        new CustomEvent("change", { detail: { newSettings: this.settings } })
      );
    }
  }

  override render() {
    let currentComponent = html``;
    switch (this._selectedComponent) {
      case SelectedComponent.SETTINGS:
      default:
        currentComponent = html`
          <sh-fullscreen-settings-settings
            settings=${this.settings}
            ${ref(this._editSourceRef)}
          ></sh-fullscreen-settings-settings>
          <button @click=${this._onChangeSettingsSaveClicked}>Save</button>
        `;
        break;
      case SelectedComponent.ADD_SOURCE:
        currentComponent = html`
          <h1>Add new Source</h1>
          <sh-fullscreen-settings-add-source
            ${ref(this._addSourceRef)}
          ></sh-fullscreen-settings-add-source>
          <button @click=${this._onAddSourceSaveClicked}>Save</button>
        `;
        break;
      case SelectedComponent.SHOW_LINKS:
        currentComponent = html`
          <sh-fullscreen-settings-show-links
            settings=${this.settings}
          ></sh-fullscreen-settings-show-links>
        `;
        break;
    }

    return html`
      <div id="ToolBar">
        <div id="ToolBarLeft">
          <!-- placeholder -->
        </div>
        <div part="ToolBarRight">
          <button
            part="addButton"
            @click=${() => this._setView(SelectedComponent.ADD_SOURCE)}
          >
            Add
          </button>
          <button
            part="configureButton"
            @click=${() => this._setView(SelectedComponent.SETTINGS)}
          >
            Settings
          </button>
          <button
            part="showLinksButton"
            @click=${() => this._setView(SelectedComponent.SHOW_LINKS)}
          >
            Show Links
          </button>
        </div>
      </div>
      <div id="MainContent">${currentComponent}</div>
    `;
  }
}
