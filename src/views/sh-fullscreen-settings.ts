import "./sh-fullscreen-settings-settings";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Settings } from "../model/settings";

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

  set settings(value: string) {
    this._settings = Settings.fromJson(value);
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return this._settings.toJson();
  }

  _bubble(evt: CustomEvent) {
    this.dispatchEvent(new CustomEvent(evt.type, evt.detail));
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
        <sh-fullscreen-settings-settings
          settings=${this.settings}
          @change=${this._bubble}
        ></sh-fullscreen-settings-settings>
      </div>
    `;
  }
}
