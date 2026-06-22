# Examen 2P - Fintech SecurePay Refactoring

## Bitácora de Evidencias

### Fase 1: Git Branching & Refactorización SOLID
Se ha aplicado correctamente el Principio de Responsabilidad Única (SRP) y la Inversión de Dependencias (DIP) al monolito. La lógica financiera, base de datos en memoria y notificaciones fueron abstraídas en servicios independientes (`financial.service.js`, `database.service.js`, `notification.service.js`), inyectados vía constructor hacia los controladores mediante un contenedor de dependencias (`di.js`).

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
