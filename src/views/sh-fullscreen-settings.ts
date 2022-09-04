import "./sh-fullscreen-settings-settings";
import "./sh-fullscreen-settings-add-source";
import "./sh-fullscreen-settings-show-links";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
      }
    `,
  ];

  private _settings: Settings = new Settings();

  @state()
  private _selectedComponent: SelectedComponent = SelectedComponent.SETTINGS;

  set settings(value: string) {
    this._settings = Settings.fromJson(value);
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return this._settings.toJson();
  }

  _bubble(evt: CustomEvent) {
    this.dispatchEvent(new CustomEvent(evt.type, { detail: evt.detail }));
  }

  _setView(view: SelectedComponent) {
    this._selectedComponent = view;
  }

  _onSourceAdded(evt) {
    this._settings.sources.push(JSON.parse(evt.detail));
    this.dispatchEvent(
      new CustomEvent("change", { detail: { newSettings: this.settings } })
    );
  }

  override render() {
    let currentComponent = html``;
    switch (this._selectedComponent) {
      case SelectedComponent.SETTINGS:
      default:
        currentComponent = html`
          <sh-fullscreen-settings-settings
            settings=${this.settings}
            @change=${this._bubble}
          ></sh-fullscreen-settings-settings>
        `;
        break;
      case SelectedComponent.ADD_SOURCE:
        currentComponent = html`
          <h1>Add new Source</h1>
          <sh-fullscreen-settings-add-source
            @sourceAdded=${this._onSourceAdded}
          ></sh-fullscreen-settings-add-source>
        `;
        break;
      case SelectedComponent.SHOW_LINKS:
        currentComponent = html`
          <sh-fullscreen-settings-show-links></sh-fullscreen-settings-show-links>
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
