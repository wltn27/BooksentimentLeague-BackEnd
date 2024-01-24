import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser} from "../models/user.dao.js";

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

