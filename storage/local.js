export class LocalStorage {
  async get() {
    let result = await browser.storage.local.get({ bookmarks: [] });
    return result.bookmarks;
  }

  async put(data) {
    let result = await browser.storage.local.get({ bookmarks: [] });

    if (result.bookmarks.find((item) => item.href === data.href)) {
      // TODO Update existing tags instead of returning and doing nothing
      return;
    }
    result.bookmarks.push(data);
    await browser.storage.local.set({ bookmarks: result.bookmarks });
  }
}
