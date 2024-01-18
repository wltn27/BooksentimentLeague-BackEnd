import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO, checkNickResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser, existNick} from "../models/user.dao.js";

export const joinUser = async (body) => {

    const joinUserData = await addUser({
        'email': body.email,
        'password': body.password,
        'nickname': body.nickname,
    });

    if(joinUserData == -1){
        throw new BaseError(status.ID_ALREADY_EXIST);
    }
    return signinResponseDTO(await getUser(joinUserData));
}

export const checkingNick = async (nickname) => {

    const niccknameData = await existNick(nickname);

    if(niccknameData == -1){
        throw new BaseError(status.NICKNAME_ALREADY_EXISTㅊ);
    }
    return checkNickResponseDTO(niccknameData);
}