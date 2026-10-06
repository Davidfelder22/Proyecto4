const { Given, When, Then } = require('@cucumber/cucumber');

Given('que estoy en la página de Login de la Obra Social', async function () {
  await this.loginPage.abrir();
});

When('intento iniciar sesión con los siguientes datos:', async function (dataTable) {
  this.recibirDatos(dataTable);
  this.resultadosIntentos = await this.loginPage.iniciarSesion(this.datos, this.intentos);
});

When('intento iniciar sesión {int} veces con los siguientes datos:', async function (intentos, dataTable) {
  this.recibirDatos(dataTable, intentos);
  this.resultadosIntentos = await this.loginPage.iniciarSesion(this.datos, this.intentos);
});

Then('debo ver el mensaje de error {string}', async function (mensaje) {
  this.esperado = { tipo: 'error', mensaje };
  await this.loginPage.verificarError(mensaje);
});

Then('debo permanecer en la página de Login', async function () {
  await this.loginPage.verificarPermanencia();
});

Then('debo acceder a la página {string}', async function (destino) {
  this.esperado = { tipo: 'acceso', destino };
  await this.bienvenidaPage.verificarAcceso(destino);
});

Then('debo ver la advertencia {string}', async function (mensaje) {
  this.esperado = { tipo: 'advertencia', mensaje };
  // Se verifica el esperado del Excel; el observado histórico no lo reemplaza.
  await this.loginPage.verificarAdvertencia(mensaje);
});
