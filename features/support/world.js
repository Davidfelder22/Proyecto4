const assert = require('node:assert/strict');
const { World, setWorldConstructor } = require('@cucumber/cucumber');

class LoginWorld extends World {
  constructor(options) {
    super(options);
    this.caso = undefined;
    this.datos = undefined;
    this.intentos = 0;
    this.resultadosIntentos = [];
    this.esperado = undefined;
  }

  recibirDatos(dataTable, intentos = 1) {
    const filas = dataTable.hashes();
    assert.equal(filas.length, 1, 'La tabla debe contener exactamente un caso de Login');
    const { caso, correo, contrasena } = filas[0];
    assert.ok(caso && correo !== undefined && contrasena !== undefined,
      'La tabla debe tener las columnas caso, correo y contrasena');
    assert.ok(Number.isInteger(intentos) && intentos > 0, 'La cantidad de intentos debe ser positiva');
    const valor = dato => dato === '(vacío)' ? '' : dato;
    this.caso = caso;
    this.datos = { correo: valor(correo), contrasena: valor(contrasena) };
    this.intentos = intentos;
  }
}

setWorldConstructor(LoginWorld);
module.exports = { LoginWorld };
