import nodemailer from 'nodemailer';


class MailSender {
  constructor() {
    this.config = {
      service: 'gmail',
      auth: {
        user: process.env.FRAP_EMAIL,   
        pass: process.env.EMAIL_PASS,  
      },
    };
    this.transporter = nodemailer.createTransport(this.config);
  }

  async sendMail({from,  to, subject, body }) {
          let status = await this.transporter.sendMail({
              from,
              to,
              subject,
              text: body, });
          return status;
  }
}

export { MailSender };