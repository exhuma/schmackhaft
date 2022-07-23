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
  private _newStorageType = "http";

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

  _renderBrowserSettings(settings: object, index: number) {
    return html` <div>
      <h1 class="text-lg">Browser bookmarks</h1>
      <em>No settings for this source</em>
    </div>`;
  }

  _renderExtensionStorageSettings(settings: object, index: number) {
    return html` <div>
      <h1 class="text-lg">Schmackhaft Internal Storage</h1>
      <em>No settings for this source</em>
    </div>`;
  }

  _deleteBookmarkSource(index: number) {
    this._settings.sources.splice(index, 1);
    this.requestUpdate();
  }

  _renderConfigBlock(type: string, settings: object, index: number) {
    const typeIndex = Object.values(BookmarkSource).indexOf(type);
    if (typeIndex < 0) {
      throw new Error(`Unknown bookmark source: ${type}`);
    }
    let typeName = Object.keys(BookmarkSource)[typeIndex];
    let sourceType = BookmarkSource[typeName];
    let configBlock;
    switch (sourceType) {
      case BookmarkSource.BROWSER:
        configBlock = this._renderBrowserSettings(settings);
        break;
      case BookmarkSource.EXTENSION_STORAGE:
        configBlock = this._renderExtensionStorageSettings(settings);
        break;
      case BookmarkSource.HTTP:
        configBlock = this._renderHttpSettings(settings, index);
        break;
      default:
        throw new Error(`Settings UI for ${sourceType} is not yet implemented`);
    }

    return html`<div class="justify-self-center">
        <button
          type="button"
          title="Delete this source"
          class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          @click=${() => this._deleteBookmarkSource(index)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
      </div>
      <div class="border-l-4 border-slate-200 p-4">${configBlock}</div>`;
  }

  _onNewStorageTypeChanged(event) {
    this._newStorageType = event.target.value;
  }

  _addSource() {
    this._settings.sources.push({ type: this._newStorageType, settings: {} });
    this.requestUpdate();
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
      <div
        class="grid grid-cols-[100px_auto] justify-items-stretch items-center"
      >
        ${configBlocks}
      </div>
      <div class="pt-4 pb-4 border-t-2 border-b-2">
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          @change=${this._onNewStorageTypeChanged}
        >
          <option value="http" selected>Remote JSON file</option>
          <option value="browser">Browser Bookmarks</option>
          <option value="extension_storage">Extension Storage</option>
        </select>
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          title="Add new source"
          @click=${this._addSource}
        >
          Add source
        </button>
      </div>
      <div class="mx-40 mt-8">
        <button
          type="button"
          id="SaveButton"
          @click="${this.onSaveClick}"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save
        </button>
      </div>
    `;
  }
}
