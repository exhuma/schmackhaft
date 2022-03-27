export class HttpStorage {
  constructor(config) {
    this.config = config;
  }
  async get(href) {
    let data = await this.getAll();
    return data.find((item) => item.href === href) || null;
  }

  async getAll() {
    let result = await fetch(this.config.url);
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
