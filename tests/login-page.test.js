const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('permite que el tercer intento sustituya el error por la advertencia esperada', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // Pantalla de prueba con una corrección válida del comportamiento de LOG-13.
    // Se ejercita el Page Object real en un navegador real, sin acceso a la red.
    await page.setContent(`
      <label for="email">Correo Electrónico *</label><input id="email">
      <label for="password">Contraseña *</label><input id="password" type="password">
      <div id="error-message"></div><div id="warning-message"></div>
      <button>Ingresar</button>
      <script>
        let intentos = 0;
        document.querySelector('button').addEventListener('click', () => {
          intentos++;
          document.querySelector('#error-message').textContent = intentos < 3
            ? 'Usuario correcto, pero la contraseña es incorrecta.' : '';
          document.querySelector('#warning-message').textContent = intentos === 3
            ? 'Atención, su cuenta está a punto de ser bloqueada.' : '';
        });
      </script>
    `);
    const login = new LoginPage(page, 'http://example.test/login.html');
    const resultados = await login.iniciarSesion({ correo: 'ron@hogwarts.com', contrasena: '123' }, 3);
    assert.equal(resultados.length, 3);
    assert.equal(resultados[2].error, '');
    assert.equal(resultados[2].advertencia, 'Atención, su cuenta está a punto de ser bloqueada.');
    await login.verificarAdvertencia('Atención, su cuenta está a punto de ser bloqueada.');
  } finally {
    await browser.close();
  }
});
