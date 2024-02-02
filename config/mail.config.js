import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const config = {
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
};

export const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: false, // 추후 보안 설정 필요
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
});