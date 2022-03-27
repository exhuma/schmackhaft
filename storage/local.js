export class LocalStorage {
  async get(href) {
    let all = await this.getAll();
    let existingItem = all.find((item) => item.href === href);
    return existingItem || null;
  }

  async getAll() {
    let result = await browser.storage.local.get({ bookmarks: [] });
    return result.bookmarks;
  }

  async put(data) {
    let result = await browser.storage.local.get({ bookmarks: [] });
    let newBookmarks = result.bookmarks.filter(
      (item) => item.href !== data.href
    );
    newBookmarks.push(data);
    await browser.storage.local.set({ bookmarks: newBookmarks });
  }
}
