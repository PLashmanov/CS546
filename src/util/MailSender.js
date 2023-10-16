import nodemailer from 'nodemailer';


class MailSender {
  constructor() {
    this.smtpConfig = {
      service: 'gmail',
      auth: {
        user: process.env.FRAP_EMAIL,   
        pass: process.env.EMAIL_PASS,  
      },
    };
    this.transporter = nodemailer.createTransport(this.smtpConfig);
  }

  async sendMail({from,  to, subject, body }) {
          let info = await this.transporter.sendMail({
              from,
              to,
              subject,
              text: body, });
          return info;
  }
}

export { MailSender };