# Resultado de la automatización — 2026-10-03

Se ejecutaron los **13 casos del Excel** contra el sitio real con `npm test`, usando Cucumber 13.2.1, Playwright 1.63.0, Node.js 24.14.1 y Chromium en Windows.

**Resultado: 12 escenarios aprobados y 1 fallido.** Cucumber informa 77 pasos contando los hooks por escenario: 75 aprobados, 1 fallido y 1 omitido después del fallo. Los dos hooks globales aprobaron. La ejecución termina con código 1 porque detecta el defecto de LOG-13.

| Caso | Estado | Resultado observado |
| --- | --- | --- |
| LOG-01 | Aprobado | Por favor, completa ambos campos. |
| LOG-02 | Aprobado | Por favor, completa ambos campos. |
| LOG-03 | Aprobado | Por favor, completa ambos campos. |
| LOG-04 | Aprobado | Por favor, completa ambos campos. |
| LOG-05 | Aprobado | Acceso a bienvenida.html; Salir y Noticias visibles. |
| LOG-06 | Aprobado | Usuario correcto, pero la contraseña es incorrecta. |
| LOG-07 | Aprobado | Por favor, completa ambos campos. |
| LOG-08 | Aprobado | El usuario no es correcto. |
| LOG-09 | Aprobado | El usuario no es correcto. |
| LOG-10 | Aprobado | Por favor, completa ambos campos. |
| LOG-11 | Aprobado | Por favor, ingrese un correo electrónico válido. |
| LOG-12 | Aprobado | Por favor, ingrese un correo electrónico válido. |
| LOG-13 | Fallido | Tres mensajes de contraseña incorrecta; advertencia vacía. |

## Defecto detectado: LOG-13

**Datos:** `ron@hogwarts.com`, contraseña `123`, tres envíos en una misma página y un contexto nuevo.

**Esperado según el Excel:** `Atención, su cuenta está a punto de ser bloqueada.`

**Observado en cada intento:** `Usuario correcto, pero la contraseña es incorrecta.`. El elemento de advertencia permanece vacío después del tercero. La comprobación del mensaje esperado falla; el paso posterior de permanencia en Login se omite por el fallo anterior. La URL capturada sigue siendo la de Login.

Este comportamiento coincide con la diferencia registrada en la columna Resultado Observado del Excel. La automatización conserva el resultado esperado y no excluye el escenario de la suite.

Una revisión posterior del JavaScript público del sitio confirmó la condición `if (failedAttempts >= 4)`: la advertencia se activa a partir del cuarto intento, mientras el caso exige tres. La reejecución aislada con `npm.cmd test -- --tags "@LOG-13"` volvió a fallar por advertencia vacía.

Se encontró una ejecución anterior aprobada cuya evidencia tenía la advertencia vacía en los tres intentos registrados y la advertencia presente en la lectura final. Eso indica un cambio entre el tercer envío y la comprobación; un cuarto clic manual durante una ejecución con navegador visible es compatible con ese resultado, pero la evidencia no permite confirmar qué originó ese cambio. Durante la ejecución automática conviene dejar que el script controle el navegador.

Evidencia de la ejecución:

- [Reporte HTML de Cucumber](../reports/cucumber.html).
- [Reporte JSON de Cucumber](../reports/cucumber.json).
- [Datos recibidos y resultados de los tres intentos](../reports/evidence/LOG-13.json).
- [Captura de pantalla](../reports/evidence/LOG-13.png).
- [Traza de Playwright](../reports/evidence/LOG-13-trace.zip).

Para inspeccionar la traza: `npm run trace -- reports/evidence/LOG-13-trace.zip`.

## Validación del requisito Cucumber → Playwright

Los 13 escenarios están escritos individualmente con palabras clave `Given`, `When` y `Then`, y entregan los datos mediante DataTable. El World recibe los datos por `dataTable.hashes()`, transforma `(vacío)` en la cadena vacía, y los pasos los pasan a `LoginPage.iniciarSesion()`. Los mensajes y el destino se reciben mediante `{string}`; los tres intentos de LOG-13 mediante `{int}`. Las evidencias JSON por caso permiten revisar los valores recibidos y la respuesta real.

## Notas de ejecución

- El dry-run final reconoció los 13 escenarios sin pasos undefined; no realiza acciones en el sitio.
- El primer intento dentro del entorno restringido no pudo acceder a la red (`ERR_NETWORK_ACCESS_DENIED`). Se repitió la suite con acceso autorizado al sitio real.
- LOG-08 y LOG-09 se precisaron con el punto final del texto real. El Excel escribe ese punto fuera de las comillas del mensaje observado y su esperado general es denegar el acceso.
- Una prueba adicional del POM, `npm run test:pom`, utiliza un navegador real y una pantalla local que sustituye el error por la advertencia en el tercer intento. Comprueba que la automatización también acepta una futura corrección válida del sitio; no reemplaza los 13 casos contra la página real.
- Los reportes se reemplazan en ejecuciones futuras; este documento registra la validación realizada el 2026-10-03.
