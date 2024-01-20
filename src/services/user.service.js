import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO, checkNickResponseDTO, loginResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser, existNick, confirmUser} from "../models/user.dao.js";

export const joinUser = async (body) => {
    let joinUserId = await addUser({
            'email' : body.email,
            'password' : body.password,
            'nickname' : body.nickname
    })

    return signinResponseDTO(await getUser(joinUserId));
}

export const checkingEmail = async (email) => {

    if(!existEmail(email)){
        throw new BaseError(status.EMAIL_ALREADY_EXIST);
    }
    //return checkNickResponseDTO(nicknameData);  수정 필요
}

export const checkingNick = async (nickname) => {

    if(!existNick(nickname)){
        throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    }
    //return checkNickResponseDTO(nicknameData);  수정 필요
}

export const loginUser = async (body) => {
    const loginUserData = await confirmUser({
        'email': body.email,
        'password' : body.password
    });

    if (loginUserData == -1) {
        return loginUserData;
    } else if((loginUserData == -2)){
        return loginUserData;
    } else {
        return loginResponseDTO(await getUser(loginUserData));
    }
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