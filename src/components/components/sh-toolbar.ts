import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
// @ts-ignore
import tailwind from "./sh-toolbar.css";

export enum ToolbarAction {
  REFRESH,
  SETTINGS,
  HELP,
  BOOKMARKS,
}

@customElement("sh-toolbar")
export class Toolbar extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    css`
      #ToolbarButtons {
        display: flex;
        flex-direction: row;
        margin-bottom: 0.5rem;
        justify-content: flex-end;
      }

      #Toast {
        font-size: small;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        margin-bottom: 0.3rem;
        padding: 0 0.5rem;
      }

      .action {
        flex-grow: 0;
        margin-left: 0.5em;
        cursor: pointer;
        border-radius: 100%;
        width: 20px;
        height: 20px;
        text-align: center;
      }

      .action:hover {
        background-color: #bdd5e4;
        color: #4747d4;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .spinning {
        animation-name: rotate;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    `,
  ];

  @property()
  toast = "test-toast";

  @property({ type: Boolean })
  private busy = false;

  sendEvent(eventType: ToolbarAction) {
    this.dispatchEvent(
      new CustomEvent("buttonClicked", {
        detail: { name: eventType },
      })
    );
  }

  _onSearchTextEdited(evt: { target: { value: string } }) {
    this.dispatchEvent(
      new CustomEvent("searchTextChange", {
        detail: {
          searchText: evt.target.value,
        },
      })
    );
  }

  get spinnerClasses() {
    return {
      ["animate-reverse-spin"]: this.busy,
    };
  }

  override render() {
    let _toastElement = html``;
    if (this.toast !== "") {
      _toastElement = html`<div id="Toast">${this.toast}</div>`;
    }
    return html`
      <div id="Toolbar">
        <div id="ToolbarButtons">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              title="Refresh all sources"
              @click="${() => this.sendEvent(ToolbarAction.REFRESH)}"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="${classMap(this.spinnerClasses)} h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="sr-only">Icon description</span>
            </button>

            <button
              type="button"
              title="Display all bookmarks"
              @click="${() => this.sendEvent(ToolbarAction.BOOKMARKS)}"
              class="py-1 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Bookmarks
            </button>
            <button
              type="button"
              title="Configure Schmackhaft"
              @click="${() => this.sendEvent(ToolbarAction.SETTINGS)}"
              class="py-1 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Settings
            </button>
            <button
              type="button"
              title="Display Help"
              @click="${() => this.sendEvent(ToolbarAction.HELP)}"
              class="py-1 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-sm border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Help
            </button>
          </div>
        </div>
        <input
          @keyup=${this._onSearchTextEdited}
          type="search"
          class="block p-1 mb-1 w-full text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Quicksearch (tags and details)"
        />
        ${_toastElement}
      </div>
    `;
  }
}
