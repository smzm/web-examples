import nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html: message,
    });
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Could not send email, try again later.');
  }
}
