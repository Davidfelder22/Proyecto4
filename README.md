# Proyecto 4 — Login de la Obra Social

## Ejecutar los tests

Con Node.js 22, 24 o 26 en adelante y npm instalados, abrir una terminal en la carpeta del proyecto y ejecutar:

```powershell
npm ci
npm run browsers:install
npm test
```

Los primeros dos comandos preparan las dependencias y el navegador. Para las siguientes ejecuciones, alcanza con `npm test`. Se requiere conexión a Internet para acceder al sitio.

Para ejecutar con el navegador visible:

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
- `pages/`: Page Objects con los selectores, acciones y verificaciones de cada página.
- `reports/`: reportes y evidencias de las ejecuciones.

## Login y bienvenida

`LoginPage.js` representa la página de login: permite completar el correo y la contraseña, enviar el formulario y comprobar errores o advertencias.

`BienvenidaPage.js` representa la página que aparece después de un login exitoso: verifica la URL de destino y la presencia de “Salir” y “Noticias de la Obra Social”.

Se utiliza un Page Object por página para separar sus responsabilidades, evitar repetir selectores y facilitar el mantenimiento de las pruebas.
