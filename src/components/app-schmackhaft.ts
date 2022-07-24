import "./components/layout-vsplit";
import "./components/sh-link";
import "./components/sh-linklist";
import "./components/sh-taglist";
import "./components/sh-toolbar";
import "./views/sh-settings";
import "@material/mwc-button";
import "material-icon-component/md-icon.js";
import {
  BookmarkSource,
  Browser,
  PageName,
  TBrowserFactory,
  TagStateTransition,
} from "../types";
import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
// @ts-ignore
import { parse, setOptions } from "marked";
// @ts-ignore
import Help from "../help/help.md?raw";
import { Link } from "../model/link";
import { LinkList } from "./components/sh-linklist";
import { Links } from "./core/links";
import { Settings } from "../model/settings";
import { TagList } from "./components/sh-taglist";
import { ToolbarAction } from "./components/sh-toolbar";
import { createStorage } from "../core/storage/factory";
// @ts-ignore
import helpStyles from "./help.css";
import hljs from "highlight.js";
// @ts-ignore
import hlstyle from "highlight.js/styles/monokai.css";
// @ts-ignore
import tailwind from "./tailwind.css";
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
    css([tailwind]),
    // @ts-ignore
    css([hlstyle]),
    // @ts-ignore
    css([helpStyles]),
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
  getBrowser: TBrowserFactory = async () => null;

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

  /**
   * Provide concrete implementations for external dependencies used in the
   * application.
   *
   * @param injections The objects that we want to replace
   * @param injections.getBrowser An factory method to build a reference to the
   *   browser API following the polyfill provided by Mozilla
   */
  @property({ type: Object, attribute: false })
  set injections(injections: { getBrowser: TBrowserFactory }) {
    this.getBrowser = injections.getBrowser;
    this._fetchBookmarks();
  }

  async _fetchBookmarks() {
    const timerId = window.setTimeout(() => {
      this._busy = true;
      this._toast = "Refreshing...";
    }, 500);

    let collectors = this._settings.sources.map((source) => {
      let storage = createStorage(
        source.type,
        source.settings,
        this.getBrowser
      );
      return storage.getAll();
    });
    let items = (await Promise.all(collectors)).flat();
    let links = items.map((item) => Link.fromObject(item));
    this._links = new Links(links);
    window.clearTimeout(timerId);
    this._toast = "";
    this._busy = false;
    this.requestUpdate();
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

  onBookmarksClicked() {
    this._view = PageName.BOOKMARKS;
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
    `;
  }

  _renderHelp() {
    const content = parse(Help);
    return html` <div id="Help" class="mx-auto">${unsafeHTML(content)}</div> `;
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

  _onToolbarButtonClick(evt: { detail: { name: ToolbarAction } }) {
    switch (evt.detail.name) {
      case ToolbarAction.BOOKMARKS:
        this.onBookmarksClicked();
        break;
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
      <div class="p-2">
        <sh-toolbar
          ?busy=${this._busy}
          toast=${this._toast}
          @buttonClicked=${this._onToolbarButtonClick}
        ></sh-toolbar>
        ${this._renderMainContent()}
      </div>
    `;
  }
}
