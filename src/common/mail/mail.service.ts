import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"Soporte HIDROCARBUROS" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });
  }
}
