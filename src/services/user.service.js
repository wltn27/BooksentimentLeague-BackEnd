import nodemailer from 'nodemailer';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { config } from '../../config/db.config.js';
import { successResponseDTO , errorResponseDTO } from '../dtos/user.response.dto.js';
import { getUserByEmail } from '../models/user.dao.js';

const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: false, // 추후 보안 설정 필요
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
      from: config.emailUser,
      to,
      subject,
      text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return successResponseDTO('Email sent successfully');
    } catch (error) {
      return errorResponseDTO('Error sending email', error);
    }
  };