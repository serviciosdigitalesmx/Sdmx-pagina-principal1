import { BasePage } from "./base-page.js";

export class DashboardPage extends BasePage {
  async ensureLoaded() {
    await this.page.waitForLoadState("networkidle");
    if (!/\/dashboard(\/|$)/.test(this.page.url())) {
      throw new Error(`Unexpected dashboard url: ${this.page.url()}`);
    }
  }
}
