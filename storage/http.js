export class HttpStorage {
  constructor(settings) {
    this.settings = settings;
  }
  async get(href) {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll() {
    let remoteUrl = await this.settings.get("remoteUrl");
    let result = await fetch(remoteUrl);
    let data = await result.json();
    return data;
  }

  async put(data) {
    return;
  }

  async remove(href) {
    return;
  }
}
