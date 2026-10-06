# language: en
@login
Feature: Login de la Obra Social de los Trabajadores de Hogwarts
  Como afiliado de la Obra Social
  Quiero iniciar sesión con mi correo y contraseña
  Para acceder a los servicios y recibir una explicación cuando no puedo ingresar

  # Fuente: hoja login, filas 3 a 15 del Excel.
  # Cada caso tiene sus propios Given, When y Then.
  # (vacío) se transforma en una cadena vacía en la definición del paso.

  @LOG-01
  Scenario: LOG-01 - Correo vacío y contraseña vacía
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-01 | (vacío) | (vacío) |
    Then debo ver el mensaje de error "Por favor, completa ambos campos."
    And debo permanecer en la página de Login

  @LOG-02
  Scenario: LOG-02 - Correo vacío y contraseña válida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-02 | (vacío) | hermione2025 |
    Then debo ver el mensaje de error "Por favor, completa ambos campos."
    And debo permanecer en la página de Login

  @LOG-03
  Scenario: LOG-03 - Correo vacío y contraseña inválida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-03 | (vacío) | 123 |
    Then debo ver el mensaje de error "Por favor, completa ambos campos."
    And debo permanecer en la página de Login

  @LOG-04
  Scenario: LOG-04 - Correo registrado y contraseña vacía
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-04 | ron@hogwarts.com | (vacío) |
    Then debo ver el mensaje de error "Por favor, completa ambos campos."
    And debo permanecer en la página de Login

  @LOG-05
  Scenario: LOG-05 - Acceso con correo registrado y contraseña válida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-05 | ron@hogwarts.com | hermione2025 |
    Then debo acceder a la página "bienvenida.html"

  @LOG-06
  Scenario: LOG-06 - Correo registrado y contraseña inválida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-06 | ron@hogwarts.com | 123 |
    Then debo ver el mensaje de error "Usuario correcto, pero la contraseña es incorrecta."
    And debo permanecer en la página de Login

  @LOG-07
  Scenario: LOG-07 - Correo no registrado y contraseña vacía
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-07 | vyvs@mail.com | (vacío) |
    Then debo ver el mensaje de error "Por favor, completa ambos campos."
    And debo permanecer en la página de Login

  @LOG-08
  Scenario: LOG-08 - Correo no registrado y contraseña válida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-08 | vyvs@mail.com | hermione2025 |
    Then debo ver el mensaje de error "El usuario no es correcto."
    And debo permanecer en la página de Login

  @LOG-09
  Scenario: LOG-09 - Correo no registrado y contraseña inválida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-09 | vyvs@mail.com | 123 |
    Then debo ver el mensaje de error "El usuario no es correcto."
    And debo permanecer en la página de Login

  @LOG-10
  Scenario: LOG-10 - Correo con formato inválido y contraseña vacía
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-10 | harry.com | (vacío) |
    Then debo ver el mensaje de error "Por favor, completa ambos campos."
    And debo permanecer en la página de Login

  @LOG-11
  Scenario: LOG-11 - Correo con formato inválido y contraseña válida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-11 | harry.com | hermione2025 |
    Then debo ver el mensaje de error "Por favor, ingrese un correo electrónico válido."
    And debo permanecer en la página de Login

  @LOG-12
  Scenario: LOG-12 - Correo con formato inválido y contraseña inválida
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-12 | harry.com | 123 |
    Then debo ver el mensaje de error "Por favor, ingrese un correo electrónico válido."
    And debo permanecer en la página de Login

  @LOG-13 @defecto-conocido
  Scenario: LOG-13 - Advertencia después de tres intentos con contraseña incorrecta
    Given que estoy en la página de Login de la Obra Social
    When intento iniciar sesión 3 veces con los siguientes datos:
      | caso | correo | contrasena |
      | LOG-13 | ron@hogwarts.com | 123 |
    Then debo ver la advertencia "Atención, su cuenta está a punto de ser bloqueada."
    And debo permanecer en la página de Login
