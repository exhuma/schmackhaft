import "./sh-chip";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TagState } from "../../types";
import { classMap } from "lit/directives/class-map.js";

@customElement("sh-link")
class Link extends LitElement {
  static styles = css`
    .screenshot {
      width: 64px;
      height: 64px;
      float: left;
      margin-right: 1rem;
    }
    .chip {
      border: 1px solid #9494bb;
      background-color: #e0e0ee;
      margin-right: 0.5rem;
      padding: 0 0.8rem;
      border-radius: 1rem;
    }
    .description {
      margin: 0.2rem 0;
    }
    H4 {
      margin: 0;
      margin-left: 0.1rem;
    }
    DIV.link {
      border: 1px solid #ddd;
      background: #fafafa;
      border-radius: 5px;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
    }
    DIV.link.dense {
      padding: 0.5rem 0.5rem;
    }
    DIV.tags {
      margin-top: 0.3rem;
    }
    SH-CHIP {
      margin-left: 0.1rem;
      font-size: 14px;
    }
  `;

  @property({ type: Array })
  tags: Array<[string, TagState]> = [];

  @property()
  title = "Link Title";

  @property()
  description = "Link Description";

  @property()
  href = "https://example.com";

  @property()
  img = "";

  @property({ type: Boolean })
  dense: boolean = false;

  onClick(evt: { detail: any }) {
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: evt.detail }));
  }

  _chip([name, state]: [string, TagState]) {
    return html`<sh-chip
      name="${name}"
      ?dense="${this.dense}"
      .state="${state}"
      @chipClicked="${this.onClick}"
    ></sh-chip>`;
  }

  override render() {
    let dynamicClasses = { dense: this.dense };
    let title = html`<h4>
      <a href="${this.href}" target="_blank">${this.title || this.href}</a>
    </h4>`;
    let description = html``;
    if (this.description) {
      description = html`<p class="description">${this.description}</p>`;
    }
    let image = html`<img class="screenshot" src="${this.img}" />`;
    if (this.dense) {
      image = html``;
    }
    return html`
      <div class="link ${classMap(dynamicClasses)}">
        ${image} ${title} ${description}
        <div class="tags">${this.tags.map(this._chip, this)}</div>
      </div>
    `;
  }
}
