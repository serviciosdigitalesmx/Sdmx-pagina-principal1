import { BasePage } from "./base-page.js";

export class OrdersPage extends BasePage {
  async open(url: string) {
    await this.goto(`${url}/dashboard/ordenes`);
  }
}
