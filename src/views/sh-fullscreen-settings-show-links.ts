import "../components/sh-source-select";
import "../components/layout-hsplit";
import "../components/sh-chip";
import {
  Bookmark,
  TBookmarkSource,
  TBrowserFactory,
  TagStateTransition,
} from "../types";
import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Counter } from "../core/counter";
import { Settings } from "../model/settings";
import { createStorage } from "../core/storage/factory";

@customElement("sh-fullscreen-settings-show-links")
export class FullScreenSettingsShowLinks extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      SH-CHIP {
        display: block;
      }

      SH-SOURCE-SELECT {
        margin-bottom: 1em;
      }
    `,
  ];

  @property()
  browserFactory: TBrowserFactory = async () => null;

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

  @state()
  bookmarks: Bookmark[] = [];

  async _newSourceSelected(evt: { detail: { source: TBookmarkSource } }) {
    let source = evt.detail.source;
    let storage = createStorage(
      source.type,
      source.settings,
      this.browserFactory
    );
    let items = await storage.getAll();
    this.bookmarks = items;
  }

  _onChipClicked(evt: {
    detail: { name: string; direction: TagStateTransition };
  }) {
    console.log(evt.detail);
  }

  override render() {
    let tagCounter = new Counter();
    this.bookmarks.forEach((bookmark) => {
      tagCounter.addAll(bookmark.tags);
    });
    let tagElements = [];
    for (const item of tagCounter.items.entries() as IterableIterator<
      [string, number]
    >) {
      tagElements.push(
        html`<sh-chip
          name=${item[0]}
          count=${item[1]}
          @chipClicked=${this._onChipClicked}
        ></sh-chip>`
      );
    }

    let bookmarkElements: TemplateResult[] = [];
    this.bookmarks.forEach((item) => {
      bookmarkElements.push(html`<div>${item.title ?? item.href}</div>`);
    });

    return html`
      <sh-source-select
        settings=${this.settings.toJson()}
        @sourceChanged=${this._newSourceSelected}
      ></sh-source-select>
      <layout-hsplit style="height: 300px">
        <div slot="left">${tagElements}</div>
        <div slot="right">${bookmarkElements}</div>
      </layout-hsplit>
    `;
  }
}
