import "./components/layout-vsplit";
import "./components/sh-link";
import "./components/sh-linklist";
import "./components/sh-taglist";
import "./components/sh-toolbar";
import "./views/sh-settings";
import "@material/mwc-button";
import "material-icon-component/md-icon.js";
import { LitElement, css, html } from "lit";
import { PageName, TagStateTransition } from "../types";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
import { parse, setOptions } from "marked";
import { Link } from "../model/link";
import { LinkList } from "./components/sh-linklist";
import { Links } from "./core/links";
import Readme from "../../README.md?raw";
import { Settings } from "../model/settings";
import { TagList } from "./components/sh-taglist";
import { ToolbarAction } from "./components/sh-toolbar";
import { createStorage } from "../core/storage/factory";
import hljs from "highlight.js";
import hlstyle from "highlight.js/styles/monokai.css";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

setOptions({
  langPrefix: "hljs language-",
  highlight: function (code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
});

@customElement("app-schmackhaft")
export class Schmackhaft extends LitElement {
  static styles = [
    // @ts-ignore
    css([hlstyle]),
    css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        font-size: 16px;
      }

      PRE CODE {
        font-family: "Fira Code", monospace;
      }

      layout-vsplit {
        height: 100%;
      }
    `,
  ];

  tagsRef: Ref<HTMLInputElement> = createRef();
  searchTextRef: Ref<HTMLInputElement> = createRef();
  linkListRef: Ref<LinkList> = createRef();
  tagListRef: Ref<TagList> = createRef();

  private _links: Links = new Links();

  @state()
  private _view = PageName.BOOKMARKS;

  @state()
  private _toast = "";

  @state()
  private _busy = false;

  @state()
  private _settings: Settings = new Settings();

  @property()
  set settings(data: string) {
    this._settings = Settings.fromJson(data);
    this._fetchBookmarks(); // TODO: Should we really always do this when the settings change?
  }

  _fetchBookmarks() {
    const timerId = window.setTimeout(() => {
      this._busy = true;
      this._toast = "Refreshing...";
    }, 500);
    let storage = createStorage(this._settings, "http", null);
    storage.getAll().then((result) => {
      let links = result.map((item) => Link.fromObject(item));
      window.clearTimeout(timerId);
      this._links = new Links(links);
      this._toast = "";
      this._busy = false;
      this.requestUpdate();
    });
  }

  onChipClicked(evt: {
    detail: { direction: TagStateTransition; name: string };
  }) {
    switch (evt.detail.direction) {
      case TagStateTransition.ADVANCE:
      default:
        this._links.advanceState(evt.detail.name);
        break;
      case TagStateTransition.REVERSE:
        this._links.reverseState(evt.detail.name);
        break;
    }
    this.requestUpdate();
    this.linkListRef.value?.requestUpdate();
    this.tagListRef.value?.requestUpdate();
  }

  onRefreshClicked() {
    this._fetchBookmarks();
  }

  onSettingsClicked() {
    this._view = PageName.SETTINGS;
  }

  onHelpClicked() {
    this._view = PageName.HELP;
  }

  _switchView(pageName: PageName): void {
    this._view = pageName;
  }

  _onSettingsChanged(evt: { detail: { settings: string } }) {
    this.settings = evt.detail.settings;
    this.dispatchEvent(
      new CustomEvent("settingsChanged", {
        detail: { settings: evt.detail.settings },
      })
    );
  }

  _renderBookmarks() {
    return html`
      <layout-vsplit>
        <sh-taglist
          slot="top"
          ${ref(this.tagListRef)}
          @chipClicked="${this.onChipClicked}"
          .links="${this._links}"
          dense
        ></sh-taglist>
        <sh-linklist
          slot="bottom"
          ${ref(this.linkListRef)}
          .links=${this._links}
          .renderSearchedTags="${false}"
          @chipClicked="${this.onChipClicked}"
          dense
        ></sh-linklist>
      </layout-vsplit>
    `;
  }

  _renderSettings() {
    return html`
      <sh-settings
        @change="${this._onSettingsChanged}"
        settings="${this._settings.toJson()}"
      ></sh-settings>
      <mwc-button raised @click="${() => this._switchView(PageName.BOOKMARKS)}"
        >Close</mwc-button
      >
    `;
  }

  _renderHelp() {
    const content = parse(Readme);
    return unsafeHTML(content);
  }

  _renderMainContent() {
    switch (this._view) {
      default:
      case PageName.BOOKMARKS:
        return this._renderBookmarks();
      case PageName.SETTINGS:
        return this._renderSettings();
      case PageName.HELP:
        return this._renderHelp();
    }
  }

  _onToolbarButtonClick(evt) {
    switch (evt.detail.name) {
      case ToolbarAction.REFRESH:
        this.onRefreshClicked();
        break;
      case ToolbarAction.SETTINGS:
        this.onSettingsClicked();
        break;
      case ToolbarAction.HELP:
        this.onHelpClicked();
        break;
      default:
        throw new Error(`Unknown toolbar action name: ${evt.detail.name}`);
    }
  }

  override render() {
    return html`
      <sh-toolbar
        ?busy=${this._busy}
        toast=${this._toast}
        @buttonClicked=${this._onToolbarButtonClick}
      ></sh-toolbar>
      ${this._renderMainContent()}
    `;
  }
}
