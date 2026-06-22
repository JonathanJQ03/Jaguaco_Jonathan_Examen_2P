const jwtService = require('../services/jwt.service');

/**
 * Middleware de Autenticación para proteger las rutas de la Fintech.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    const decodedToken = jwtService.verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido o expirado',
      message: error.message
    });
  }
}

module.exports = authMiddleware;
