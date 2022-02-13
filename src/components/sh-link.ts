import { css, CSSResultGroup, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

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
      border: 1px dashed blue;
    }
    H2 {
      margin: 0;
    }
    DIV {
      border: 1px solid black;
    }
  `;

  @property({ type: Array })
  tags: Array<string> = [];

  @property()
  title = "Link Title";

  @property()
  description = "Link Description";

  @property()
  href = "https://example.com";

  @property()
  img = "";

  _chip(name: string) {
    return html`<span class="chip">${name}</span>`;
  }

  override render() {
    return html`
      <div>
        <img class="screenshot" src="${this.img}" />
        <h2><a href="${this.href}">${this.title}</a></h2>
        <p>${this.description}</p>
        <a href="${this.href}">${this.href}</a>
        <p>${this.tags.map(this._chip)}</p>
      </div>
    `;
  }
}
