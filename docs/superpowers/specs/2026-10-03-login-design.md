# Diseño aprobado: automatización del Login

## Objetivo
Automatizar los 13 casos LOG-01 a LOG-13 de `Casos de test-Login (para P4).xlsx`, hoja `login`, filas 3 a 15, contra http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html.

## Arquitectura
JavaScript, Cucumber y Playwright, con Page Object Model. Gherkin con palabras clave en inglés y descripciones en español define los datos y las expectativas. Por pedido posterior del usuario, los 13 casos se escriben individualmente, cada uno con sus propios Given, When y Then. Los pasos reciben parámetros y DataTable de Cucumber, guardan información en un World propio por escenario y delegan las operaciones y verificaciones de la interfaz en LoginPage y BienvenidaPage. Los pasos no contienen selectores.

## Datos y expectativas
Conservar los identificadores, correos, contraseñas y resultados esperados del Excel. `(vacío)` representa la cadena vacía. La celda numérica 123.0 se utiliza como `123`, su representación entera en el Excel. LOG-05 debe alcanzar `bienvenida.html`, destino observado en la página real. Para LOG-06, LOG-08 y LOG-09, el esperado general de acceso denegado se verifica permaneciendo en Login y con el mensaje concreto documentado en la columna de resultados observados.

LOG-13 conserva como esperado `Atención, su cuenta está a punto de ser bloqueada.` después de tres intentos en una misma página. La inspección manual confirmó que actualmente sólo se muestra el error de contraseña; la prueba debe fallar mientras persista esta diferencia. No omitir ni invertir su expectativa.

## Aislamiento y evidencia
Un BrowserContext nuevo por escenario, sin compartir cookies ni almacenamiento. Cucumber administra los hooks y la ejecución. Playwright realiza las acciones y las aserciones con espera automática. Generar reportes HTML y JSON, adjuntar datos recibidos y estado observado, y guardar capturas y trazas de los escenarios fallidos.

## Entrega y verificación
Feature, pasos, World, hooks, Page Objects, configuración, dependencias reproducibles y README en español. Verificar primero los escenarios sin implementación mediante dry-run; luego completar los pasos y ejecutar los 13 casos en el sitio real. Documentar el resultado de la ejecución y distinguir los defectos del sitio de los errores de automatización.

## Aprobación
El usuario aprobó la estructura en el chat el 2026-10-03. Se implementa en la carpeta original, que no es un repositorio Git.
