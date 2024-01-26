import { config } from '../../config/db.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO, checkNickResponseDTO, loginResponseDTO, successResponseDTO , errorResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser,  existEmail, existNick, confirmPassword, getUserIdFromEmail, updateUserPassword, getMyPage} from "../models/user.dao.js";

export const readMyPage = async (user_id) => {
    
    const userData = await getMyPage(user_id);
    console.log(userData);
    
    return userData;
}