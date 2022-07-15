import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import tailwind from "./sh-toolbar.css";

export enum ToolbarAction {
  REFRESH,
  SETTINGS,
  HELP,
}

@customElement("sh-toolbar")
export class Toolbar extends LitElement {
  static styles = [
    css([tailwind]),
    css`
      #Toolbar {
        display: flex;
        flex-direction: row;
        margin-bottom: 0.5rem;
      }
      #Toast {
        flex-grow: 1;
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

  get spinnerClasses() {
    return {
      ["inline"]: true,
      ["mr-2"]: true,
      ["w-4"]: true,
      ["h-4"]: true,
      ["text-gray-200"]: true,
      ["dark:text-gray-600"]: true,
      ["animate-spin"]: this.busy,
      ["hidden"]: !this.busy,
    };
  }

  override render() {
    return html`
      <div id="Toolbar">
        <div id="Toast">${this.toast}</div>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            @click="${() => this.sendEvent(ToolbarAction.REFRESH)}"
            class="inline-flex items-center py-1 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-sm border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <svg
              role="status"
              class=${classMap(this.spinnerClasses)}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Refresh
          </button>
          <button
            type="button"
            @click="${() => this.sendEvent(ToolbarAction.SETTINGS)}"
            class="py-1 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Settings
          </button>
          <button
            type="button"
            @click="${() => this.sendEvent(ToolbarAction.HELP)}"
            class="py-1 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-sm border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Help
          </button>
        </div>
      </div>
    `;
  }
}
