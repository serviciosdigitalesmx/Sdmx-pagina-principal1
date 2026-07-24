import type { Page } from "playwright";
import { BasePage } from "./base-page.js";

export class LoginPage extends BasePage {
  async open(url: string) {
    await this.goto(url);
  }

  async login(email: string, password: string) {
    await this.page.locator('input[autocomplete="email"], input[type="email"], input[placeholder*="correo" i]').first().fill(email);
    await this.page.locator('input[autocomplete="current-password"], input[type="password"], input[placeholder*="contraseña" i]').first().fill(password);
    await this.page.getByRole("button", { name: /entrar|ingresar|iniciar sesión|sign in|login/i }).first().click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForURL(/dashboard|auth\/bridge/i);
  }
}
