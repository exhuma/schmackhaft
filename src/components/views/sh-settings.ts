import "@material/mwc-textfield";
import "@material/mwc-button";
import { css, html, LitElement } from "lit";
import { property, customElement, state } from "lit/decorators.js";

@customElement("sh-settings")
export class Settings extends LitElement {
  static styles = css`
  #GridContainer {
    display: grid;
    grid-template-columns: 70% 30%;
    grid-row-gap: 0.5rem;
  }
  #SaveButton {
    grid-column-start: 2;
  }
  .formField {
    grid-column-start: span 2;
  }
  `;

  private _settings = {}

  set settings(value: string) {
    this._settings = JSON.parse(value);
    this.requestUpdate();
  }

  @property({ type: String })
  get settings() {
    return JSON.stringify(this._settings);
  }

  onTextFieldChanged(evt) {
    this._settings.remoteUrl = evt.currentTarget.value;
  }

  onButtonClick() {
    this.dispatchEvent(new CustomEvent("change", {detail: {
      settings: this.settings
    }}));
  }

  override render() {
    return html`
    <div id="GridContainer">
      <mwc-textfield class="formField" label="External JSON file" 
      placeholder="https://my.domain.tld/my-bookmarks.json"
      value="${this._settings?.remoteUrl}"
      @change="${this.onTextFieldChanged}"
      ></mwc-textfield>
      <mwc-button id="SaveButton" raised @click="${this.onButtonClick}">Save</mwc-button>
    </div>
    `
  }
}
