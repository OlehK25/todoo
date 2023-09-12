import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { htmlToText } from "html-to-text";
import pug from "pug";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Transport = require("nodemailer-brevo-transport");

dotenv.config({ path: "/../../.env" });
console.log(`${__dirname}/../views/images/Welcome_Email.png`);

interface User {
  email: string;
  name: string;
}

export class Email {
  private readonly to: string;
  private readonly firstName: string;
  private readonly url: string;
  private readonly from: string;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Kozak's Products <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport(
        new Transport({
          apiKey: process.env.BREVO_API_KEY,
        }),
      );
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the TodosFamily!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset code (valid for only 5 minutes)",
    );
  }
}
