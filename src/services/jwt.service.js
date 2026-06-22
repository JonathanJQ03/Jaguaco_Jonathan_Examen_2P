const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

/**
 * Genera un Token JWT firmado con clave privada asimétrica (RS256).
 * 
 * @param {Object} user - Objeto con la información del usuario a firmar.
 * @returns {string} JWT Token firmado.
 */
function signToken(user) {
  const privateKeyPath = process.env.PRIVATE_KEY_PATH || './private.pem';
  const privateKey = fs.readFileSync(path.resolve(process.cwd(), privateKeyPath), 'utf8');
  
  const payload = {
    sub: user.id || user.accountId || 'usr_unknown',
    name: user.name || user.email || 'Unknown User'
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '2m' });
}

/**
 * Verifica un Token JWT utilizando la clave pública asimétrica (RS256).
 * 
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload decodificado si es válido.
 */
function verifyToken(token) {
  const publicKeyPath = process.env.PUBLIC_KEY_PATH || './public.pem';
  const publicKey = fs.readFileSync(path.resolve(process.cwd(), publicKeyPath), 'utf8');
  
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

module.exports = {
  signToken,
  verifyToken
};
