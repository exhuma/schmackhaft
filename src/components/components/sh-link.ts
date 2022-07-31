import "./sh-chip";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TagState } from "../../types";
import { classMap } from "lit/directives/class-map.js";
// @ts-ignore
import tailwind from "./sh-link.css";
import { until } from "lit/directives/until.js";

@customElement("sh-link")
class Link extends LitElement {
  static styles = [
    // @ts-ignore
    css([tailwind]),
    css`
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
      DIV.denseLink {
        padding: 0;
      }
      DIV.fullLink {
        border: 1px solid #ddd;
        background: #fafafa;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        margin-bottom: 0.5rem;
      }
      DIV.tags {
        margin-top: 0.3rem;
      }
      SH-CHIP {
        margin-left: 0.1rem;
        font-size: 14px;
      }
    `,
  ];

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

  @property()
  favIconTemplate = "";

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

  async getFavicon(href: string) {
    let url = new URL(href);
    let imageUrl = this.favIconTemplate.replace("{domain}", url.host);
    let output = html``;
    if (imageUrl !== "") {
      output = html`<img src="${imageUrl}" width="20" height="20"></img>`;
    }
    return output;
  }

  get dynamicClasses() {
    return {
      dense: this.dense,
      denseLink: this.dense,
      fullLink: !this.dense,
    };
  }

  override render() {
    let title = html`<a
      class="underline text-blue-900 dark:text-blue-100"
      href="${this.href}"
      target="_blank"
      >${this.title || this.href}</a
    >`;
    let description = html``;
    if (this.description && !this.dense) {
      description = html`<p class="description">${this.description}</p>`;
    }

    let image = html`<img class="screenshot" src="${this.img}" />`;
    let tags = html`<div class="tags">${this.tags.map(this._chip, this)}</div>`;
    if (this.dense) {
      image = until(this.getFavicon(this.href), html``);
      tags = html``;
    }
    return html`
      <div class="flex flex-row gap-x-2 mb-2 ${classMap(this.dynamicClasses)}">
        <div class="flex-none">${image}</div>
        <div class="flex flex-col flex-1">
          <div>${title}</div>
          <div class="text-sm text-slate-500 italic">${description}</div>
          <div>${tags}</div>
        </div>
      </div>
    `;
  }
}
