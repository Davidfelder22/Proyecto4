const fs = require('node:fs/promises');
const path = require('node:path');
const { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { BienvenidaPage } = require('../../pages/BienvenidaPage');

let browser;
setDefaultTimeout(60_000);

BeforeAll(async function () {
  browser = await chromium.launch({ headless: this.parameters.headless });
});

Before(async function () {
  this.context = await browser.newContext();
  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(10_000);
  this.page.setDefaultNavigationTimeout(30_000);
  this.loginPage = new LoginPage(this.page, this.parameters.loginUrl);
  this.bienvenidaPage = new BienvenidaPage(this.page, this.parameters.loginUrl);
});

After(async function ({ pickle, result }) {
  if (!this.context) return;
  const failed = result?.status === Status.FAILED;
  const nombre = this.caso || pickle.name.match(/LOG-\d+/)?.[0] || 'sin-caso';
  const carpeta = path.resolve('reports', 'evidence');
  try {
    await fs.mkdir(carpeta, { recursive: true });
    const evidencia = {
      caso: nombre,
      escenario: pickle.name,
      estado: result?.status,
      datosRecibidosDeGherkin: this.datos,
      intentos: this.intentos,
      esperado: this.esperado,
      resultadosIntentos: this.resultadosIntentos,
      observado: this.page ? await this.loginPage.obtenerEstado() : null
    };
    const json = JSON.stringify(evidencia, null, 2);
    await fs.writeFile(path.join(carpeta, `${nombre}.json`), json, 'utf8');
    await this.attach(json, 'application/json');
    if (failed && this.page) {
      const captura = await this.page.screenshot({
        path: path.join(carpeta, `${nombre}.png`), fullPage: true
      });
      await this.attach(captura, 'image/png');
    } else if (!failed) {
      // Eliminar evidencia de fallos anteriores de este mismo caso.
      await fs.rm(path.join(carpeta, `${nombre}.png`), { force: true });
      await fs.rm(path.join(carpeta, `${nombre}-trace.zip`), { force: true });
    }
  } finally {
    try {
      await this.context.tracing.stop(failed ? { path: path.join(carpeta, `${nombre}-trace.zip`) } : {});
    } finally {
      await this.context.close();
    }
  }
});

AfterAll(async function () {
  await browser?.close();
});
