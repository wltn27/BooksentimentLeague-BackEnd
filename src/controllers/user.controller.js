import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { StatusCodes } from "http-status-codes";
import { sendEmail } from '../services/user.service.js';
import { errorResponse } from '../../config/error.js';

export const sendEmailVerification = async (req, res, next) => {
    console.log("Received request:", req.body);
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증번호 생성

    try {
        await sendEmail(email, 'Your Verification Code', `Your code is: ${verificationCode}`);
        res.status(200).send('Verification email sent');
    } catch (error) {
        res.status(500).send('Error sending verification email');
    }
};