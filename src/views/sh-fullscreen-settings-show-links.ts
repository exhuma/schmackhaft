import "../components/sh-source-select";
import "../components/layout-hsplit";
import "../components/sh-chip";
import { LitElement, TemplateResult, css, html } from "lit";
import { TBookmarkSource, TBrowserFactory, TagStateTransition } from "../types";
import { customElement, property, state } from "lit/decorators.js";
import { Counter } from "../core/counter";
import { Link } from "../model/link";
import { Links } from "../model/link-collection";
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
  links: Links = new Links();

  async _newSourceSelected(evt: { detail: { source: TBookmarkSource } }) {
    let source = evt.detail.source;
    let storage = createStorage(
      source.type,
      source.settings,
      this.browserFactory
    );
    let items = await storage.getAll();
    // TODO Double-check if this conversion from "Bookmark" to "Link" is really
    // necessary
    this.links = new Links(
      items.map((item) => {
        return new Link(
          item.href,
          item.tags,
          item.title,
          item.image,
          item.description
        );
      })
    );
  }

  _onChipClicked(evt: {
    detail: { name: string; direction: TagStateTransition };
  }) {
    this.links.advanceState(evt.detail.name);
    this.requestUpdate();
  }

  override render() {
    let tagCounter = new Counter();
    for (let bookmark of this.links) {
      tagCounter.addAll(bookmark.tags);
    }
    let tagElements = [];

    this.links.excludedTags.map((item) => {
      tagElements.push(
        html`<sh-chip
          name=${item}
          .state=${this.links.getState(item)}
          @chipClicked=${this._onChipClicked}
        ></sh-chip>`
      );
    });

    for (const item of tagCounter.items.entries() as IterableIterator<
      [string, number]
    >) {
      tagElements.push(
        html`<sh-chip
          name=${item[0]}
          count=${item[1]}
          .state=${this.links.getState(item[0])}
          @chipClicked=${this._onChipClicked}
        ></sh-chip>`
      );
    }

    let bookmarkElements: TemplateResult[] = [];
    for (let item of this.links) {
      bookmarkElements.push(
        html`<div>
          ${item.title}<br />${item.href}
          <hr />
        </div>`
      );
    }

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
