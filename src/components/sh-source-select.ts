import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Settings } from "../model/settings";
import { TBookmarkSource } from "../types";

@customElement("sh-source-select")
export class SourceSelect extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property({
    converter: {
      fromAttribute: (value: string, type) => {
        return Settings.fromJson(value);
      },
      toAttribute: (value: Settings, type) => {
        return value.toJson();
      },
    },
  })
  settings: Settings = new Settings();

  @property({ attribute: false })
  selectedIndex: number = 0;

  _renderSelectOption(value: TBookmarkSource, index: number) {
    return html`<option value="${index}">Source: ${value.type}</option>`;
  }

  _onSelectionChanged(evt: Event) {
    let target = evt.target as HTMLInputElement;
    this.selectedIndex = Number.parseInt(target.value, 10);
    let source = this.settings.sources[this.selectedIndex];
    this.dispatchEvent(
      new CustomEvent("sourceChanged", {
        detail: { sourceIndex: this.selectedIndex, source },
      })
    );
  }

  override render() {
    return html`
      <select
        @change=${this._onSelectionChanged}
        name="source"
        part="sourceSelection"
      >
        <option selected disabled>Select a source</option>
        ${this.settings.sources.map(this._renderSelectOption)}
      </select>
    `;
  }
}
