class NotificationService {
  sendEmail(to, subject, body) {
    console.log(`\n--- [EMAIL OUTBOX] Enviando correo ---`);
    console.log(`Para: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Mensaje: ${body}`);
    console.log(`---------------------------------------\n`);
  }
}

module.exports = NotificationService;
