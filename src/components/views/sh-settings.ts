import "@material/mwc-textfield";
import "@material/mwc-button";
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

  private _settings = {};

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

  onTextFieldChanged(evt) {
    let urlIndex = evt.currentTarget.dataset["urlIndex"];
    if (urlIndex) {
      this._settings.remoteUrls[urlIndex] = evt.currentTarget.value;
    }
    this._settings.remoteUrls = this._settings.remoteUrls.filter(
      (item) => item.trim() !== ""
    );
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: this.settings,
        },
      })
    );
  }

  onNewItemChanged(evt) {
    this._settings.remoteUrls.push(evt.currentTarget.value);
    evt.currentTarget.value = "";
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: this.settings,
        },
      })
    );
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

  onClearClick() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: "{}",
        },
      })
    );
  }

  private _renderRemoteUrl(url: string, index: number) {
    if (url.trim() === "") {
      return null;
    }
    let output = html`
      <div class="mb-6 formField">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >External JSON File</label
        >
        <input
          type="text"
          helper="Set this to the empty string to remove it from the list"
          value="${url}"
          data-url-index="${index}"
          @change="${this.onTextFieldChanged}"
          placeholder="https://my.domain.tld/my-bookmarks.json"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    `;
    return output;
  }

  _onSourceTypeChanged(event: { detail: any; target: any }) {
    let sourceIndex = Number.parseInt(event.target.dataset["sourceid"], 10);
    let source = this._settings.sources[sourceIndex];
    source.type = event.detail.newValue;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: this.settings,
        },
      })
    );
  }

  _onSourceSettingsChanged(event: { detail: any; target: any }) {
    let sourceIndex = Number.parseInt(event.target.dataset["sourceid"], 10);
    let source = this._settings.sources[sourceIndex];
    source.settings = event.detail.newValue;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          settings: this.settings,
        },
      })
    );
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
    let remoteUrls = this._settings.remoteUrls ?? [];
    return html`
    <div id="GridContainer">
      ${remoteUrls.map(this._renderRemoteUrl, this)}
      <div class="mb-6 formField">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >External JSON File</label>
        <input
          type="text"
          helper="Set this to the empty string to remove it from the list"
          @change="${this.onNewItemChanged}"
          placeholder="https://my.domain.tld/my-bookmarks.json"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
      </div>
      <div class="formField">
        <input @change="${
          this.onBrowserBookmarkToggled
        }" id="enableBrowserBookmarks" type="checkbox" ?checked="${
      this._settings.enableBrowserBookmarks
    }"></input>
        <label for="enableBrowserBookmarks">Include Browser Bookmarks (folders will be provided as tags)</label>
      </div>
      <button
        type="button"
        id="SaveButton"
        @click="${this.onSaveClick}"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >Save</button>
      <button
        type="button"
        id="ClearButton"
        @click="${this.onClearClick}"
        class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      >Clear all Settings</button>
    </div>
    `;
  }
}
