
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

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO, checkNickResponseDTO, loginResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser,  existEmail, existNick, confirmPassword, getUserIdFromEmail, updateUserPassword} from "../models/user.dao.js";

export const joinUser = async (body) => {
   
    if(!await existEmail(body.email))
        throw new BaseError(status.EMAIL_ALREADY_EXIST);
    
    if(!await existNick(body.nickname))
        throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    
    
    let joinUserId = await addUser({
        'email' : body.email,
        'password' : body.password,
        'nickname' : body.nickname
     })

    return signinResponseDTO(await getUser(joinUserId));
}

export const checkingEmail = async (email) => {

    if(!await existEmail(email)){
        throw new BaseError(status.EMAIL_ALREADY_EXIST);
    }
    return checkNickResponseDTO(); 
}

export const checkingNick = async (nickname) => {

    if(!await existNick(nickname)){
        throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    }
    return checkNickResponseDTO(); 
}

export const loginUser = async (body) => {

    if(await existEmail(body.email))
        throw new BaseError(status.EMAIL_NOT_EXIST);

    if(!await confirmPassword(body))
        throw new BaseError(status.EMAIL_ALREADY_EXIST);

    const user_id = await getUserIdFromEmail(body.email);

    return loginResponseDTO(await getUser(user_id));
}

 export const findUser = async (email) => {
    const loginUserData = await confirmUser({
        'email': email
    });

    if (loginUserData == -1) {
        return loginUserData;
    } 
    else {
        return loginResponseDTO(await getUser(loginUserData));
    }
 }

