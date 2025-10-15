import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendForgotPassword(email: string, resetLink: string) {
    await this.transporter.sendMail({
      from: `"POS KYD" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click the link to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });
  }
}
