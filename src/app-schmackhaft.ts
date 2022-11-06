import "./components/layout-vsplit";
import "./components/sh-bookmarklist";
import "./components/sh-error";
import "./components/sh-link";
import "./components/sh-linklist";
import "./components/sh-taglist";
import "./components/sh-toolbar";
import "./views/sh-settings";
import "@material/mwc-button";
import "material-icon-component/md-icon.js";
import { Bookmark, PageName, TBookmarkSource, TBrowserFactory } from "./types";
import { LitElement, css, html } from "lit";
import { Ref, createRef, ref } from "lit/directives/ref.js";
import { customElement, property, state } from "lit/decorators.js";
// @ts-ignore
import { parse, setOptions } from "marked";
// @ts-ignore
import Help from "./help/help.md?raw";
import { Link } from "./model/link";
import { Links } from "./model/link-collection";
import { Settings } from "./model/settings";
import { ToolbarAction } from "./components/sh-toolbar";
import { createStorage } from "./core/storage/factory";
// @ts-ignore
import helpStyles from "./help/help.css";
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
        font-size: 14px;
        height: 100%;
      }
    `,
  ];

  tagsRef: Ref<HTMLInputElement> = createRef();
  searchTextRef: Ref<HTMLInputElement> = createRef();
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

  private errors: { source: TBookmarkSource; errorMessage: string }[] = [];

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

    let collectors = this._settings.sources.map(async (source) => {
      let storage = createStorage(
        source.type,
        source.settings,
        this.getBrowser
      );
      let output: Bookmark[];
      try {
        output = await storage.getAll();
      } catch (error) {
        this.errors.push({
          source: source,
          errorMessage: `${error}`,
        });
        output = [];
      }
      return output;
    });
    let items = (await Promise.all(collectors)).flat();
    let links = items.map((item) => Link.fromObject(item));
    this._links = new Links(links);
    window.clearTimeout(timerId);
    this._toast = "";
    this._busy = false;
    this.requestUpdate();
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

  _onSettingsChanged(evt: { detail: { settings: string } }) {
    this.settings = evt.detail.settings;
    this.dispatchEvent(
      new CustomEvent("settingsChanged", {
        detail: { settings: evt.detail.settings },
      })
    );
  }

  async _onLinkActivated(evt: { detail: { link: Link } }) {
    let browser = await this.getBrowser();
    browser?.tabs.create({ url: evt.detail.link.href });
    window.close();
  }

  _renderBookmarks() {
    if (this._links.isEmpty) {
      return html` <strong>No links found.</strong>
        This could mean that you have no sources configured, or none of the
        sources contains any bookmarks. Please
        <a href="#" @click=${this.onSettingsClicked}>open the settings</a> and
        add one or more sources.`;
    }
    return html`<sh-bookmarklist
      @linkActivated=${this._onLinkActivated}
      .links=${this._links}
    ></sh-bookmarklist>`;
  }

  _renderSettings() {
    return html`
      <sh-settings
        class="overflow-auto"
        @change="${this._onSettingsChanged}"
        settings="${this._settings.toJson()}"
      ></sh-settings>
    `;
  }

  _renderHelp() {
    const content = parse(Help);
    return html`
      <div id="Help" class="mx-auto pr-4 overflow-auto">
        ${unsafeHTML(content)}
      </div>
    `;
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

  _removeError(event: Event) {
    let target: HTMLElement | null = event.target as HTMLElement;
    let errorIndexRaw = target?.dataset.errorIndex;
    if (!errorIndexRaw) {
      throw new Error(
        `Unable to get the error index on ${target} (via ${event})`
      );
    }
    let errorIndex = Number.parseInt(errorIndexRaw, 10);
    this.errors.splice(errorIndex, 1);
    this.requestUpdate();
  }

  _renderError(
    error: { source: TBookmarkSource; errorMessage: string },
    index: number
  ) {
    return html`<sh-error
      @error-closed=${this._removeError}
      data-error-index=${index}
      .error=${error}
    ></sh-error>`;
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
      <div class="p-2 h-full flex flex-col dark:bg-slate-800 dark:text-white">
        <sh-toolbar
          ?busy=${this._busy}
          toast=${this._toast}
          @buttonClicked=${this._onToolbarButtonClick}
        ></sh-toolbar>
        ${this._renderMainContent()}
        ${this.errors.map((error, index) => this._renderError(error, index))}
      </div>
    `;
  }
}
