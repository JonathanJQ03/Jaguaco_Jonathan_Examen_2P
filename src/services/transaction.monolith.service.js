// SIMULACIÓN DE UNA BASE DE DATOS EN MEMORIA (Estado global/local)
const usersDb = [
  { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
  { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
];

const transactionsHistory = [];

/**
 * Servicio monolítico que procesa una transferencia bancaria.
 * VIOLACIÓN CRÍTICA DE SRP (Single Responsibility Principle):
 * 1. Valida el estado de saldos y la existencia del usuario consultando el array directamente.
 * 2. Realiza la deducción/cálculo matemático de saldo directamente.
 * 3. Escribe y formatea manualmente la transacción para el historial.
 * 4. Envía un correo simulado mediante console.log con lógica de negocio incrustada.
 */
function executeTransfer(fromAccountId, toAccountId, amount) {
  // --- RESPONSABILIDAD 1: Validación y Reglas de Negocio en la Base de Datos Local ---
  const sender = usersDb.find(u => u.accountAlpha === fromAccountId);
  if (!sender) {
    throw new Error(`Error de validación: La cuenta origen '${fromAccountId}' no existe en la base de datos.`);
  }

  const receiver = usersDb.find(u => u.accountAlpha === toAccountId);
  if (!receiver) {
    throw new Error(`Error de validación: La cuenta destino '${toAccountId}' no existe en la base de datos.`);
  }

  if (amount <= 0) {
    throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
  }

  if (sender.balance < amount) {
    throw new Error(`Saldo insuficiente: La cuenta '${fromAccountId}' tiene $${sender.balance}, requiere $${amount}.`);
  }

  // --- RESPONSABILIDAD 2: Deducción y Actualización de Cuenta ---
  sender.balance -= amount;
  receiver.balance += amount;

  // --- RESPONSABILIDAD 3: Escritura manual del registro de transferencia ---
  const newTransaction = {
    transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    from: fromAccountId,
    to: toAccountId,
    amount: amount,
    status: 'COMPLETED',
    timestamp: new Date().toISOString()
  };
  transactionsHistory.push(newTransaction);

  // --- RESPONSABILIDAD 4: Envío simulado de correo electrónico ---
  console.log(`\n--- [EMAIL OUTBOX MONOLITH] Enviando correo de confirmación ---`);
  console.log(`Para: ${sender.email}`);
  console.log(`Asunto: Débito por Transferencia Realizada - Fintech SecurePay`);
  console.log(`Mensaje: Estimado usuario, se ha debitado de su cuenta ${fromAccountId} el valor de $${amount}.`);
  console.log(`Su nuevo saldo disponible es: $${sender.balance}.`);
  console.log(`------------------------------------------------------------\n`);

  console.log(`\n--- [EMAIL OUTBOX MONOLITH] Enviando correo de recepción ---`);
  console.log(`Para: ${receiver.email}`);
  console.log(`Asunto: Crédito por Transferencia Recibida - Fintech SecurePay`);
  console.log(`Mensaje: Estimado usuario, ha recibido una transferencia de $${amount} de la cuenta ${fromAccountId}.`);
  console.log(`Su nuevo saldo disponible es: $${receiver.balance}.`);
  console.log(`------------------------------------------------------------\n`);

  return {
    success: true,
    message: 'Transferencia ejecutada con éxito',
    transaction: newTransaction,
    balanceRestante: sender.balance
  };
}

/**
 * Obtiene el saldo actual de una cuenta.
 */
function getAccountBalance(accountId) {
  const account = usersDb.find(u => u.accountAlpha === accountId);
  if (!account) {
    throw new Error(`La cuenta '${accountId}' no existe.`);
  }
  return {
    accountId: account.accountAlpha,
    email: account.email,
    balance: account.balance
  };
}

module.exports = {
  executeTransfer,
  getAccountBalance,
  usersDb,
  transactionsHistory
};
