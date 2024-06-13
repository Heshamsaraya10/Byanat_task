import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async (options: EmailOptions) => {
  // 1) Create transporter
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  // 2) Define email options
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER ?? "",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
