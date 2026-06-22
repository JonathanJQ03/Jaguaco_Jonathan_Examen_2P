# Examen 2P - Fintech SecurePay Refactoring

## Bitácora de Evidencias

### Fase 1: Git Branching & Refactorización SOLIDo
Para evidenciar este procedimiento al archivo original el cual era transaction.monolith.service.js se identifico que se violaba 2 principios solid:
1. S: El archivo contenia mas de una responsabilidad, ya que manejaba la logica financiera, la base de datos en memoria y las notificaciones.
2. D: El archivo tenia dependencias de alto nivel y de bajo nivel, por lo que no se podia reutilizar la logica financiera en otro servicio.
- Solución: Se dividio este archivo en otros 3 archivos para asi lograr cumplir con el principio de responsabilidad unica y pe ara el segundo principio se aplicó la inyección de dependencias de modo que modificamos los Controladores account.controller.js  y transfer.controller.js para que funcionen a través de constructores con class
![Resultado de Principio Solid 1:](./Evidencias/ev1.png)
![Inserción de Class:](./Evidencias/ev2.png)

### Fase 2: Seguridad & Autenticación Asimétrica Stateless (JWT RS256)
Se emplearon llaves públicas y privadas (PKCS#8) generadas vía OpenSSL y se ha configurado la firma y validación de tokens JWT mediante el algoritmo asimétrico **RS256**. El middleware `auth.middleware.js` realiza la validación de forma autónoma usando únicamente la llave pública, la cual es cargada mediante variables de entorno seguras. 

> **Directriz Crítica**: El archivo `.env` y las llaves `.pem` generadas han sido exitosamente excluidos del repositorio mediante `.gitignore`. Se provee una plantilla segura en `.env.example`.

**Evidencia 1: Postman - JWT Generado y Accesos Válidos**
*(Reemplazar con la captura de pantalla de Postman validando el acceso a un endpoint protegido)*

**Evidencia 2: Postman - JWT Expirado (Error 401)**
*(Reemplazar con la captura de pantalla de Postman mostrando el error 401)*

### Fase 3: Observabilidad & Error Tracking Real-Time (Sentry)
El backend cuenta con instrumentación del SDK de Sentry (`@sentry/node` v8). Los controladores manejan y diferencian correctamente los errores lógicos (que responden con códigos HTTP seguros) y los errores operacionales (crash de conexión simulado que responde 500 y alerta a la nube).

**Evidencia 3: Panel de Sentry - Error Operacional 500 Capturado con Tags de Usuario**
*(Reemplazar con la captura de pantalla del dashboard de Sentry mostrando el fallo "Conexión interrumpida..." y el tag `user_id` capturado del JWT)*

---
## Trazabilidad de Autoría (GitOps)
- Se manejaron ramas individuales: `feature/01-refactor-solid`, `feature/02-auth-jwt` y `feature/03-observabilidad`.
- Se aplicó la convención de Commits Semánticos (Ej: `refactor(solid): ...`, `feat(jwt): ...`, `feat(sentry): ...`).
