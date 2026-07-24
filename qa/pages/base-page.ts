import type { Page } from "playwright";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
  }

  async screenshot(path: string) {
    await this.page.screenshot({ path, fullPage: true });
  }

  async title() {
    return this.page.title();
  }
}
