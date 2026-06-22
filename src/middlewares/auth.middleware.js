const jwtService = require('../services/jwt.service');

/**
 * Middleware de Autenticación para proteger las rutas de la Fintech.
 * 
 * TODO (Estudiante):
 * 1. Extraer la cabecera 'authorization'.
 * 2. Verificar que empiece con la palabra 'Bearer '.
 * 3. Extraer el token crudo y validarlo usando jwtService.verifyToken(token).
 * 4. Si el token es válido, adjuntar el payload al objeto 'req.user' y llamar a next().
 * 5. Si hay error en la validación (TokenExpiredError, JsonWebTokenError), capturar la excepción y responder 401/403.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  // Simulación incompleta de extracción del Bearer Token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    // TODO (Estudiante):
    // 1. Invocar jwtService.verifyToken(token).
    // 2. Adjuntar el payload de usuario a la petición, ej. req.user = decodedToken.
    // 3. Quitar o comentar la siguiente línea temporal de prueba y habilitar next() bajo validación exitosa.

    console.log(`[AUTH MIDDLEWARE] Token extraído para validar: ${token.substring(0, 15)}...`);
    
    // NOTA TEMPORAL: Por ahora el middleware deja pasar la petición sin validar para evitar bloqueos iniciales,
    // pero el estudiante debe implementar la validación criptográfica correspondiente.
    next();
  } catch (error) {
    // TODO (Estudiante): Retornar una respuesta adecuada según el tipo de error (ej: Expirado o Inválido)
    return res.status(401).json({
      error: 'Token inválido o expirado',
      message: error.message
    });
  }
}

module.exports = authMiddleware;
