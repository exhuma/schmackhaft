import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

export enum ToolbarAction {
  REFRESH,
  SETTINGS,
  HELP,
}

@customElement("sh-toolbar")
export class Toolbar extends LitElement {
  static styles = css`
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
  `;

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

  get refreshClasses() {
    return {
      spinning: this.busy,
    };
  }

  override render() {
    return html`
      <div id="Toolbar">
        <div id="Toast">${this.toast}</div>
        <div
          class="action"
          @click="${() => this.sendEvent(ToolbarAction.REFRESH)}"
        >
          <md-icon class=${classMap(this.refreshClasses)}>refresh</md-icon>
        </div>
        <div
          class="action"
          @click="${() => this.sendEvent(ToolbarAction.SETTINGS)}"
        >
          <md-icon>settings</md-icon>
        </div>
        <div
          class="action"
          @click="${() => this.sendEvent(ToolbarAction.HELP)}"
        >
          <md-icon>help</md-icon>
        </div>
      </div>
    `;
  }
}
