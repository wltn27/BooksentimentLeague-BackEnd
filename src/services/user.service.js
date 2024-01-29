import { transporter, config } from '../../config/mail.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO, checkNickResponseDTO, loginResponseDTO, successResponseDTO , errorResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser,  existEmail, existNick, confirmPassword, getUserIdFromEmail, updateUserPassword, changeUserInfo} from "../models/user.dao.js";
import Redis from 'redis';

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
    const userData = await getUser(user_id);
    return userData[0];
}

export const findUser = async (email, verificationCode) => {
    if(await existEmail(email))
        throw new BaseError(status.EMAIL_NOT_EXIST);

    const client = Redis.createClient();
    await client.connect();

    if(verificationCode != await client.get(email)){
        throw new BaseError(status.AUTH_NOT_EQUAL);
    }
    
    return // 성공했다는 json 반환
    
}

export const changeUser = async (password, userId) => {
    if(!await updateUserPassword(password, userId)){
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    return // 성공했다는 json 반환
}

export const saveVerificationCode = async (email, verificationCode) => {
    try{
        const client = Redis.createClient();
        console.log(`email: ${email}, verificationCode: ${verificationCode}`);
        await client.connect();
        await client.setEx(`${email}`, 300, `${verificationCode}`, (err, result) => {
            if (err) {
              console.error('Error setting data in Redis:', err);
            } else {
              console.log('Data stored successfully!');
            }
        });
        await client.quit();
    }
    catch (error){
        throw new BaseError(status.EMAIL_NOT_EXIST); // error status 변경 필요
    }    
};

export const sendEmail = async (to, subject, text) => {
    console.log(`to: ${to} subject: ${subject} text: ${text}`);
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

export const updateUserData = async (user_id, userData) => {
    if(! await changeUserInfo(user_id, userData)){
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    return // 성공했다는 json 반환
};