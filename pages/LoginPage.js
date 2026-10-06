const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page, loginUrl) {
    this.page = page;
    this.loginUrl = loginUrl;
    this.correo = page.getByLabel('Correo Electrónico *', { exact: true });
    this.contrasena = page.getByLabel('Contraseña *', { exact: true });
    this.ingresar = page.getByRole('button', { name: 'Ingresar', exact: true });
    this.error = page.locator('#error-message');
    this.advertencia = page.locator('#warning-message');
  }

  async abrir() {
    await this.page.goto(this.loginUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.ingresar).toBeVisible();
  }

  async iniciarSesion({ correo, contrasena }, intentos = 1) {
    await this.correo.fill(correo);
    await this.contrasena.fill(contrasena);
    const resultados = [];
    // Los envíos ocurren en la misma página: no se recarga el contador.
    for (let intento = 1; intento <= intentos; intento++) {
      await this.ingresar.click();
      if (intentos > 1) {
        // Una corrección del sitio puede reemplazar el error por la advertencia.
        // El paso Entonces es el que decide qué mensaje se espera al finalizar.
        await expect(this.error.or(this.advertencia).filter({ visible: true }).first()).toBeVisible();
        resultados.push({ intento, ...(await this.obtenerEstado()) });
      }
    }
    return resultados;
  }

  async verificarError(mensaje) {
    await expect(this.error).toHaveText(mensaje);
    await expect(this.error).toBeVisible();
  }

  async verificarAdvertencia(mensaje) {
    await expect(this.advertencia).toHaveText(mensaje);
    await expect(this.advertencia).toBeVisible();
  }

  async verificarPermanencia() {
    await expect(this.page).toHaveURL(this.loginUrl);
    await expect(this.ingresar).toBeVisible();
  }

  async obtenerEstado() {
    const mensaje = async locator => (await locator.count()) ? locator.textContent() : '';
    return {
      url: this.page.url(),
      error: await mensaje(this.error),
      advertencia: await mensaje(this.advertencia)
    };
  }
}

module.exports = { LoginPage };
