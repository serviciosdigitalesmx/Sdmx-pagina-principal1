import { BasePage } from "./base-page.js";

export class InventoryPage extends BasePage {
  async open(url: string) {
    await this.goto(`${url}/dashboard/stock`);
  }

  async openNewDialog() {
    await this.page.getByTestId("btn-new-product").click();
    await this.page.getByTestId("product-dialog").waitFor({ state: "visible", timeout: 30000 });
  }
}
