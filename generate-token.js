const jwtService = require('./src/services/jwt.service');
require('dotenv').config();

const testUser = {
  id: 'usr_001',
  email: 'estudiante.alpha@espe.edu.ec',
  accountId: 'ACC-12345'
};

const token = jwtService.signToken(testUser);
console.log('--- JWT GENERADO ---');
console.log(token);
console.log('--------------------');
