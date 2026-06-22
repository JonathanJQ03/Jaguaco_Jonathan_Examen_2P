# Explicación del Código y Conceptos Técnicos - Fintech SecurePay

A continuación se detalla el flujo de trabajo, los conceptos teóricos aplicados y las guías de pruebas para cada una de las fases realizadas durante la resolución del ABP.

---

## Fase 1: Git Branching & Refactorización SOLID

### Conceptos Clave
- **Monolito vs. Modularización**: El código base poseía un "monolito de servicio" (`transaction.monolith.service.js`). Toda la lógica matemática, la manipulación de arreglos (BD) y los console.logs (Notificaciones) convivían en una sola función. Esto provocaba un alto acoplamiento, dificultando el mantenimiento y las pruebas aisladas.
- **Principio de Responsabilidad Única (SRP - S de SOLID)**: Dictamina que un componente, clase o módulo debe tener un único propósito y una sola razón para cambiar.
- **Inversión de Dependencias (DIP - D de SOLID)**: Un módulo de alto nivel (como un Controlador que maneja peticiones HTTP) no debe depender ni instanciar módulos de bajo nivel (como las conexiones a BD). Deben depender de abstracciones, y las dependencias deben ser *inyectadas* desde el exterior.

### ¿Qué hicimos en el código?
1. **Desacoplamiento (SRP)**: Destruimos el monolito y repartimos sus tareas en 3 servicios:
   - `database.service.js`: Únicamente maneja lecturas y escrituras hacia el arreglo en memoria.
   - `notification.service.js`: Únicamente emite mensajes de correo (simulados con console.log).
   - `financial.service.js`: Es el cerebro de negocio. Valida si el saldo alcanza, pero él mismo no resta, sino que le dice a la Base de Datos que lo haga.
2. **Inyección de Dependencias (DIP)**: Modificamos los Controladores (`account.controller.js` y `transfer.controller.js`) para que funcionen a través de constructores (`class`).
3. **Contenedor DI**: Creamos un archivo `di.js` que se encarga de hacer el `new` a todos los servicios y pasarlos como piezas de lego armadas hacia los Controladores.

### ¿Cómo probarlo?
Inicia la API (`npm run dev`). La funcionalidad de la aplicación no debió cambiar en lo absoluto para el cliente final. Si haces llamadas POST o GET como solías hacerlo, las transferencias y consultas de saldo seguirán funcionando, pero por detrás la arquitectura ahora es limpia y escalable.

---

## Fase 2: Seguridad & Autenticación Asimétrica Stateless

### Conceptos Clave
- **JWT (JSON Web Token)**: Estándar para crear tokens de acceso que permiten enviar datos (`claims`) de forma segura y verificable en formato JSON.
- **Autenticación Stateless (Sin Estado)**: Significa que el servidor no recuerda al usuario entre petición y petición. No guarda sesiones en memoria ni en BD. Toda la información necesaria para saber quién eres viaja sellada dentro del Token.
- **Criptografía Asimétrica (Algoritmo RS256)**: Se usan dos llaves distintas.
  - **Llave Privada** (`private.pem`): Nunca sale del servidor central. Se usa exclusivamente para **Firmar** el token (es decir, ponerle un sello de autenticidad y fecha de expiración).
  - **Llave Pública** (`public.pem`): Puede estar distribuida en múltiples microservicios (Alpha, Beta, etc.). Se usa exclusivamente para **Verificar** si el token que manda el cliente realmente fue firmado por la llave privada original.

### ¿Qué hicimos en el código?
1. **Generación de Llaves**: Corrimos tu script de Bash invocando OpenSSL para generar el par de llaves en formato estándar PKCS#8.
2. **Carga Segura de Variables**: En lugar de "quemar" las rutas de las llaves en texto plano en el código (lo cual es inseguro e inflexible), agregamos soporte para un archivo `.env` y blindamos el repositorio evitando que se suban los `.pem` usando el `.gitignore`.
3. **Módulo JWT**: En `jwt.service.js`, leemos las llaves. En `signToken` le inyectamos los datos del usuario (`sub` y `name`) y configuramos una expiración forzosa de 2 minutos (`expiresIn: '2m'`).
4. **Middleware Interceptor**: El `auth.middleware.js` lee los headers HTTP de la petición, rescata el Bearer Token, y lo valida empleando `jwt.verify` y la llave pública.

### ¿Cómo probarlo?
1. Corre el comando `node generate-token.js` en tu consola. Te escupirá un JWT larguísimo recién generado.
2. En Postman, intenta hacer un `GET` a `/v1/account-alpha/balance?accountId=ACC-12345` sin autenticación. Te arrojará un error 401 (No autorizado).
3. En la pestaña Headers de Postman envía `Authorization: Bearer <pega_tu_token_aqui>`. Te dejará pasar.
4. Espera pacientemente 2 minutos. Vuelve a disparar la petición, y el middleware atrapará automáticamente que la fecha interna del token ha caducado y te botará con un 401 por "Token expirado".

---

## Fase 3: Observabilidad & Error Tracking Real-Time (Sentry)

### Conceptos Clave
- **Observabilidad Centralizada**: Permite monitorear la salud del software en tiempo real en la nube sin tener que meterse manualmente a leer la consola del servidor.
- **Excepción Lógica (No Critica)**: Errores que surgen de reglas de negocio esperadas. Por ejemplo, "Saldo insuficiente", "Monto negativo" o "Token Caducado". El sistema está diseñado para que estos pasen; se le avisa al cliente (HTTP 400 o 401) pero el sistema general sigue sano. No se reportan a Sentry para no inundarlo de alertas falsas.
- **Fallo Operacional 500 (Crítico / Crash)**: Errores imprevistos de infraestructura (ej. "Se cayó la base de datos", "No hay memoria", "Null Pointer Exception"). Estos detienen el servidor o corrompen datos, obligando a retornar un HTTP 500. **Deberán alertar siempre a Sentry**.

### ¿Qué hicimos en el código?
1. **Instrumentación del SDK**: Generamos `src/instrument.js` y metimos la inicialización de Sentry ahí. Sentry exige que esta sea, estrictamente, la primera línea de ejecución de tu backend, por lo que la importamos al inicio de `index.js`.
2. **Interceptar Errores Globales**: Usamos `Sentry.setupExpressErrorHandler(app)` para que Express mande directamente a Sentry cualquier excepción que llegue al final de la cadena no controlada o despachada mediante `next(error)`.
3. **Manejo Selectivo**:
   - En nuestro middleware JWT, capturamos los errores de expiración usando un bloque `try/catch` y respondemos el error, cerrando el ciclo. Al no llamar a `next(error)`, Sentry ni se entera de que ocurrió este fallo leve lógico.
   - En `transfer.controller.js`, introdujimos un disparador artificial (`triggerError`) en el Body. Si esto es verdadero, tiramos un error fatal simulando la desconexión a Base de Datos. Atrapamos este error e intencionalmente usamos `Sentry.captureException` adjuntándole un **Tag de Contexto** (el ID de usuario sacado del JWT) para saber quién sufrió el daño. Luego propagamos el error con `next(error)` para finalizar la petición devolviendo código 500.

### ¿Cómo probarlo?
1. Copia el `DSN` de tu proyecto en la plataforma Sentry.io y pégalo en tu `.env` (`SENTRY_DSN="http..."`).
2. En Postman, con un Token fresco en los Headers, haz un POST a `/v1/transfer-beta/execute` con este JSON:
```json
{
  "fromAccountId": "ACC-12345",
  "toAccountId": "ACC-67890",
  "amount": 100,
  "triggerError": true
}
```
3. Verás que la API colapsa de forma controlada y te responde el Error 500.
4. Revisa Sentry.io. Verás un nuevo *Issue* rojo resaltando: "Conexión interrumpida con el Clúster...". Si bajas hasta la sección de "Tags", verás explícitamente `user_id: usr_001`.
