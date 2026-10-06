# Proyecto 4 — Login de la Obra Social

Automatización de los **13 casos LOG-01 a LOG-13** del archivo `Casos de test-Login (para P4).xlsx`, hoja `login`, filas 3 a 15. Se utilizan **Gherkin, Cucumber, Playwright y Page Object Model (POM)**. Gherkin usa palabras clave en inglés y descripciones en español; cada caso está escrito por separado con sus propios `Given`, `When` y `Then`.

Sitio: http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html

## Instalación y ejecución

Requiere Node.js 22, 24 o una versión >=26 compatible con Cucumber 13.2.1, npm y acceso a Internet. El proyecto fue preparado con Node.js 24.

Desde esta carpeta:

```powershell
npm ci
npm run browsers:install
npm test
```

Otros comandos:

```powershell
# Comprobar la sintaxis Gherkin y la vinculación de los pasos, sin abrir el navegador.
npm run test:dry

# Verificar que el POM acepte una pantalla corregida de LOG-13 (sin red).
npm run test:pom

# Ejecutar con el navegador visible.
npm run test:headed

# Ejecutar únicamente el caso de acceso exitoso.
npm test -- --tags "@LOG-05"

# Ejecutar el caso de tres intentos fallidos.
npm test -- --tags "@LOG-13"

# Ejecutar un caso por su nombre.
npm test -- --name "LOG-06"

# Abrir la traza del caso fallido, después de una ejecución.
npm run trace -- reports/evidence/LOG-13-trace.zip
```

Para cambiar el sitio de destino en PowerShell:

```powershell
$env:LOGIN_URL = 'http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html'
npm test
```

`npm test` ejecuta **Cucumber**. Cucumber utiliza Playwright desde los Page Objects. No hace falta ejecutar `playwright test` ni configurar otro ejecutor.

## Organización y POM

```text
features/
  login.feature                    Casos Gherkin y datos del Excel.
  step_definitions/login.steps.js   Vinculación entre texto Gherkin y acciones POM.
  support/world.js                 Estado y datos propios de cada escenario.
  support/hooks.js                 Navegador, contexto aislado y evidencia.
pages/
  LoginPage.js                     Campos, botón, mensajes y acciones del Login.
  BienvenidaPage.js                Comprobación del acceso autorizado.
scripts/run-cucumber.js             Ejecución de Cucumber y creación de reports/.
cucumber.cjs                       Configuración del sitio y reportes.
```

Los selectores están en los Page Objects. Los pasos llaman a métodos como `iniciarSesion()`, `verificarError()` y `verificarAcceso()`. Los hooks administran el navegador y crean un **BrowserContext nuevo para cada escenario**, para aislar cookies y almacenamiento. Los tres intentos de LOG-13 se realizan en la misma página, sin recargarla.

## Pasaje de información entre Cucumber y Playwright

El flujo implementado es:

**DataTable / parámetros Gherkin → pasos Cucumber → World → Page Object → Playwright.**

1. El archivo `login.feature` contiene 13 bloques `Scenario`, de LOG-01 a LOG-13. Cada uno tiene su propio `Given` para abrir el Login, `When` para enviar los datos y `Then` para comprobar el resultado.
2. Cada escenario entrega una `DataTable` con las columnas `caso`, `correo` y `contrasena`.
3. La definición `When` recibe esa tabla y llama a `this.recibirDatos(dataTable)`.
4. `LoginWorld` utiliza `dataTable.hashes()`, convierte `(vacío)` en `''` y conserva los valores en `this.datos`.
5. El paso llama a `this.loginPage.iniciarSesion(this.datos, this.intentos)`. Playwright escribe esos valores en los campos.
6. Los pasos `Then` reciben el mensaje o destino mediante `{string}` y lo pasan al Page Object para comprobar el resultado.
7. En LOG-13, `{int}` recibe **3** desde Gherkin y el Page Object realiza exactamente esa cantidad de envíos.

Las funciones de los pasos usan `function` para que `this` sea el World de Cucumber. Así los datos permanecen disponibles entre los pasos de un escenario. Se adjuntan al reporte los valores recibidos, el resultado esperado, la URL y los mensajes observados; en LOG-13 también se registran los resultados de cada intento.

## Trazabilidad con el Excel

| Caso | Fila | Datos de entrada | Resultado que se verifica |
| --- | --- | --- | --- |
| LOG-01 | 3 | Correo vacío, contraseña vacía | Completar ambos campos y permanecer en Login. |
| LOG-02 | 4 | Correo vacío, `hermione2025` | Completar ambos campos y permanecer en Login. |
| LOG-03 | 5 | Correo vacío, `123` | Completar ambos campos y permanecer en Login. |
| LOG-04 | 6 | `ron@hogwarts.com`, contraseña vacía | Completar ambos campos y permanecer en Login. |
| LOG-05 | 7 | `ron@hogwarts.com`, `hermione2025` | Acceso a `bienvenida.html`, con Salir y Noticias visibles. |
| LOG-06 | 8 | `ron@hogwarts.com`, `123` | Acceso denegado: contraseña incorrecta; permanecer en Login. |
| LOG-07 | 9 | `vyvs@mail.com`, contraseña vacía | Completar ambos campos y permanecer en Login. |
| LOG-08 | 10 | `vyvs@mail.com`, `hermione2025` | Acceso denegado: usuario incorrecto; permanecer en Login. |
| LOG-09 | 11 | `vyvs@mail.com`, `123` | Acceso denegado: usuario incorrecto; permanecer en Login. |
| LOG-10 | 12 | `harry.com`, contraseña vacía | Completar ambos campos y permanecer en Login. |
| LOG-11 | 13 | `harry.com`, `hermione2025` | Solicitar un correo electrónico válido; permanecer en Login. |
| LOG-12 | 14 | `harry.com`, `123` | Solicitar un correo electrónico válido; permanecer en Login. |
| LOG-13 | 15 | Tres envíos de `ron@hogwarts.com`, `123` | Advertencia de cuenta a punto de ser bloqueada. |

El Excel almacena la contraseña inválida como un número `123.0`; se utiliza el texto `123`, su representación entera. Los espacios vacíos se representan explícitamente con `(vacío)` en Gherkin. El Excel original se conserva.

En LOG-06, LOG-08 y LOG-09, el resultado esperado del Excel pide acceso no autorizado de forma general. Se comprueba ese comportamiento junto con el mensaje concreto de la columna **Resultado Observado**. En LOG-05, el Excel llama al destino “página principal”; la ejecución del sitio identifica ese destino como `bienvenida.html`.

En LOG-08 y LOG-09, la columna de observado escribe el punto fuera de las comillas del mensaje. El texto real de la interfaz es `El usuario no es correcto.` y Gherkin incluye ese punto final para comprobarlo exactamente.

**LOG-13 tiene una diferencia documentada entre esperado y observado.** Se mantiene el resultado esperado: `Atención, su cuenta está a punto de ser bloqueada.`. Si el sitio sólo muestra `Usuario correcto, pero la contraseña es incorrecta.`, el escenario falla. La etiqueta `@defecto-conocido` sirve para identificarlo y no lo excluye de `npm test`.

## Reportes y evidencia

Cada ejecución escribe:

- `reports/cucumber.html`: reporte HTML con pasos, datos y capturas de fallos.
- `reports/cucumber.json`: resultado estructurado de Cucumber.
- `reports/evidence/LOG-XX.json`: datos recibidos, esperado y observado por caso.
- `reports/evidence/LOG-XX.png` y `LOG-XX-trace.zip`: captura y traza de los casos fallidos.

Los reportes HTML y JSON corresponden a la última ejecución, incluso si se ejecutó una selección o un dry-run. Los archivos de evidencia de casos que no se ejecutaron pueden pertenecer a una ejecución anterior. Para obtener la entrega completa, ejecutar `npm test` sin filtros como último comando de pruebas.

Un dry-run muestra pasos **skipped**: verifica su vinculación, pero no demuestra que el sitio funcione. Una ejecución real que detecta un defecto termina con código **1**; conservar ese estado permite detectar el problema también en una integración continua.

El resultado de la validación de esta entrega está en `docs/resultados.md`.

## Referencias

- [Page Object Model en Playwright](https://playwright.dev/docs/pom).
- [Tablas de datos en Cucumber.js](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/data_table_interface.md).
- [World de Cucumber.js](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md).
