import "@material/mwc-textfield";
import "@material/mwc-button";
import "../components/sh-http-settings";
import { BookmarkSource, TSettings } from "../../types";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import tailwind from "../tailwind.css";

@customElement("sh-settings")
export class Settings extends LitElement {
  static styles = [
    css([tailwind]),
    css`
      #GridContainer {
        display: grid;
        grid-template-columns: 70% 30%;
        grid-row-gap: 0.5rem;
      }
      #SaveButton {
        grid-column-start: 2;
      }
      #ClearButton {
        grid-column-start: 2;
      }
      .formField {
        grid-column-start: span 2;
      }
    `,
  ];

  private _settings: TSettings = { sources: [], version: 3 };

  @state()
  private _isVersionSupported = false;

  set settings(value: string) {
    let data = JSON.parse(value);
    this._isVersionSupported = data?.version === 3;
    this._settings = data;
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return JSON.stringify(this._settings);
  }

  onSaveClick() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: this.settings,
        },
      })
    );
  }

  onBlockSettingsChanged(event: {
    target: HTMLElement;
    detail: { settings: object };
  }) {
    let sourceIndexStr = event.target?.dataset?.sourceIndex;
    if (sourceIndexStr === undefined) {
      throw new Error(
        `${event.target} did not contain a data-source-index attribute`
      );
    }
    let sourceIndex = Number.parseInt(sourceIndexStr, 10);
    this._settings.sources[sourceIndex].settings = event.detail.settings;
  }

  /**
   * Render the settings UI for an HTTP bookmark source
   *
   * @param settings The local settings objec to this bookmark source.
   * @param index The index of the source in the global settings object.
   * @returns an HTML object to render the settings in
   */
  _renderHttpSettings(settings: object, index: number) {
    return html`<sh-http-settings
      data-source-index=${index}
      @change=${this.onBlockSettingsChanged}
      settings=${JSON.stringify(settings)}
    ></sh-http-settings>`;
  }

  _renderConfigBlock(type: string, settings: object, index: number) {
    const typeIndex = Object.values(BookmarkSource).indexOf(type);
    if (typeIndex < 0) {
      throw new Error(`Unknown bookmark source: ${type}`);
    }
    let typeName = Object.keys(BookmarkSource)[typeIndex];
    let sourceType = BookmarkSource[typeName];
    switch (sourceType) {
      case BookmarkSource.HTTP:
        return this._renderHttpSettings(settings, index);
      default:
        throw new Error(`Settings UI for ${sourceType} is not yet implemented`);
    }
  }

  override render() {
    if (!this._isVersionSupported) {
      return html`
        <p>Settings version is not supported</p>
        <p>
          The current version of the settings
          (<tt>${this._settings?.version}</tt>) is not supported by the settings
          editor. This <em>should</em> have been automatically handled. If the
          problem persists please open a bug-report, including (if possible your
          settings object shown below). Your current settings object:
        </p>
        <code> ${JSON.stringify(this._settings)} </code>
      `;
    }
    let configBlocks = this._settings.sources.map(({ type, settings }, index) =>
      this._renderConfigBlock(type, settings, index)
    );
    return html`
      <h1 class="text-2xl">Bookmark Sources</h1>
      ${configBlocks}
      <button
        type="button"
        id="SaveButton"
        @click="${this.onSaveClick}"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Save
      </button>
    `;
  }
}
