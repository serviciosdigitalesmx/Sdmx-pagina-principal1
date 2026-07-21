import { BasePage } from "./base-page.js";

export class SecurityPage extends BasePage {
  async open(url: string) {
    await this.goto(`${url}/dashboard/seguridad`);
  }
}
