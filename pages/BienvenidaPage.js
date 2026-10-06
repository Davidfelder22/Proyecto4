const { expect } = require('@playwright/test');

class BienvenidaPage {
  constructor(page, loginUrl) {
    this.page = page;
    this.loginUrl = loginUrl;
    this.salir = page.getByRole('link', { name: 'Salir', exact: true });
    this.noticias = page.getByRole('heading', { name: 'Noticias de la Obra Social', exact: true });
  }

  async verificarAcceso(destino) {
    await expect(this.page).toHaveURL(new URL(destino, this.loginUrl).href);
    await expect(this.salir).toBeVisible();
    await expect(this.noticias).toBeVisible();
  }
}

module.exports = { BienvenidaPage };
