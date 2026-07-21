import { BasePage } from "./base-page.js";

export class CustomersPage extends BasePage {
  async open(url: string) {
    await this.goto(`${url}/dashboard/clientes`);
  }

  async openNewDialog() {
    await this.page.getByTestId("btn-new-customer").click();
    await this.page.getByTestId("customer-dialog").waitFor({ state: "visible", timeout: 30000 });
  }
}
