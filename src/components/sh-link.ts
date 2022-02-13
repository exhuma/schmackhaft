import { css, CSSResultGroup, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./sh-chip";

@customElement("sh-link")
class Link extends LitElement {
  static styles = css`
    * {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
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
    H2 {
      margin: 0;
    }
    DIV {
      border: 1px solid #ddd;
      background: #fafafa;
      border-radius: 5px;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
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

  onClick(evt: Event) {
    console.log(evt);
    this.dispatchEvent(new CustomEvent("chipClicked", { detail: evt.detail }));
  }

  _chip(name: string) {
    return html`<sh-chip
      name="${name}"
      @chipClicked="${this.onClick}"
    ></sh-chip>`;
  }

  override render() {
    let title = html``;
    if (this.title) {
      title = html`<h2><a href="${this.href}">${this.title}</a></h2>`;
    }
    let description = html``;
    if (this.description) {
      description = html`<p>${this.description}</p>`;
    }
    return html`
      <div>
        <img class="screenshot" src="${this.img}" />
        ${title} ${description}
        <a href="${this.href}">${this.href}</a>
        <p>${this.tags.map(this._chip, this)}</p>
      </div>
    `;
  }
}
