# Proyecto 4-comisión 20- Felder,Ferraro— Login de la Obra Social

## Ejecutar los tests

Con Node.js 22, 24 o 26 en adelante y npm instalados, abrir una terminal en la carpeta del proyecto y ejecutar:

```powershell
npm ci
npm run browsers:install
npm test
```

Los primeros dos comandos preparan las dependencias y el navegador. Para las siguientes ejecuciones, alcanza con `npm test`. Se requiere conexión a Internet para acceder al sitio.

Para ejecutar con el navegador visible: (si se ejecuta este comando esperar 5 segundos a que el navegador se cierre solo)

```powershell
npm run test:headed
```

Para ejecutar un caso específico, por ejemplo LOG-05:

```powershell
npm test -- --tags "@LOG-05"
```

Para ejecutar ese caso con el navegador visible:

```powershell
npm run test:headed -- --tags "@LOG-05"
```

Reemplazar `@LOG-05` por la etiqueta del caso que se quiera ejecutar (`@LOG-01` a `@LOG-13`).

Automatización de los 13 casos de prueba de login definidos en el Excel, utilizando Gherkin, Cucumber y Playwright con el patrón Page Object Model (POM).

## Estructura

- `features/login.feature`: escenarios de prueba escritos en Gherkin.
- `features/step_definitions/`: pasos que conectan los escenarios con las acciones de Playwright.
- `features/support/`: configuración del navegador y datos de cada escenario.
- `features/support/hooks.js`: hooks `BeforeAll`, `Before`, `After` y `AfterAll` para preparar el navegador, crear cada sesión, guardar evidencias y cerrar los recursos.
- `features/support/world.js`: datos compartidos por los pasos de un mismo escenario y conversión de los parámetros recibidos de Gherkin.
- `pages/`: Page Objects con los selectores, acciones y verificaciones de cada página.
- `scripts/`: script que inicia Cucumber y permite activar el navegador visible.
- `tests/`: pruebas del comportamiento del Page Object de login.
- `reports/`: reportes y evidencias de las ejecuciones.
- `cucumber.cjs`: configuración de Cucumber, parámetros y formatos de salida HTML y JSON.
- `Casos de test-Login (para P4).xlsx`: documento de referencia de los 13 casos; los datos utilizados durante la ejecución están escritos en `features/login.feature`.

## Pasaje de parámetros entre Cucumber y Playwright

Cucumber lee los escenarios de `features/login.feature` y entrega los valores a las funciones de `features/step_definitions/login.steps.js`:

1. Las tablas de Gherkin llegan como un `dataTable`. El método `recibirDatos` del World las convierte con `dataTable.hashes()` y guarda el caso, el correo, la contraseña y la cantidad de intentos. El texto `(vacío)` se convierte en una cadena vacía.
2. Los parámetros `{int}` y `{string}` de los pasos reciben, respectivamente, la cantidad de intentos y los textos esperados, como mensajes de error o la página de destino.
3. Los pasos pasan esos datos a los Page Objects. Por ejemplo, `this.loginPage.iniciarSesion(this.datos, this.intentos)` utiliza Playwright para completar los campos y hacer clic en Ingresar. Los pasos `Then` pasan el resultado esperado a los métodos de verificación.

Por ejemplo, en `LOG-13`, Cucumber recibe `3` intentos y la tabla con `ron@hogwarts.com` y `123`; el Page Object realiza los tres envíos en la misma página y luego verifica la advertencia indicada en el escenario.

La configuración también pasa parámetros: `cucumber.cjs` define `worldParameters.loginUrl` y `worldParameters.headless`, disponibles mediante `this.parameters`. Los hooks usan `headless` al iniciar Chromium y entregan `loginUrl` a los Page Objects. La variable `LOGIN_URL` permite cambiar la dirección del sitio y `npm run test:headed` activa el navegador visible.

## Hooks y tags

El hook `BeforeAll` inicia el navegador una vez. Antes de cada escenario, `Before` crea un contexto y una página nuevos; todos los pasos de ese escenario comparten esa sesión. Al finalizar, `After` guarda las evidencias y cierra el contexto. Finalmente, `AfterAll` cierra el navegador. Al ejecutar los 13 escenarios, se crean 13 contextos independientes.

La etiqueta `@login` identifica la funcionalidad completa y las etiquetas `@LOG-01` a `@LOG-13` permiten seleccionar cada caso. El caso 13 tiene además `@defecto-conocido`; esta etiqueta lo identifica, pero no lo excluye de la ejecución ni convierte su fallo en un resultado exitoso.

## Fallo conocido: LOG-13

**En la ejecución guardada en `reports/evidence/LOG-13.json`, el caso LOG-13 falla.** Después de tres intentos con un correo registrado y una contraseña incorrecta, se espera la advertencia: “Atención, su cuenta está a punto de ser bloqueada.” Sin embargo, la evidencia muestra que el sitio sigue presentando “Usuario correcto, pero la contraseña es incorrecta.” y la advertencia está vacía.

La prueba conserva el resultado esperado del Excel para detectar este defecto. Mientras el sitio mantenga ese comportamiento, la suite completa terminará con un fallo y un código de salida distinto de cero. Si el sitio se corrige y muestra la advertencia esperada, el caso podrá pasar.

Los reportes se generan en `reports/cucumber.html` y `reports/cucumber.json`. Para este fallo también se guardan los datos observados en `reports/evidence/LOG-13.json`, una captura en `reports/evidence/LOG-13.png` y una traza en `reports/evidence/LOG-13-trace.zip`.

## Login y bienvenida

`LoginPage.js` representa la página de login: permite completar el correo y la contraseña, enviar el formulario y comprobar errores o advertencias.

`BienvenidaPage.js` representa la página que aparece después de un login exitoso: verifica la URL de destino y la presencia de “Salir” y “Noticias de la Obra Social”.

Se utiliza un Page Object por página para separar sus responsabilidades, evitar repetir selectores y facilitar el mantenimiento de las pruebas.
