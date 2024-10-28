import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const url = `http://localhost:3000/api/auth/verify?token=${token}`;
  await transporter.sendMail({
    to,
    subject: 'Verify Your Email',
    text: `Please verify your email by clicking this link: ${url}`,
  });
};
