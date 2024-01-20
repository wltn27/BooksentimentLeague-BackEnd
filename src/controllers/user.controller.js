import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { StatusCodes } from "http-status-codes";
import { joinUser, checkingNick, checkingEmail, loginUser, findUser} from './../services/user.service.js';

export const userSignin = async (req, res, next) => {
    const signIn = req.body;
    console.log("회원 가입을 요청하였습니다.");
    const signInMessage = await joinUser(signIn);
    
    console.log("회원 가입 성공");
    return res.status(StatusCodes.OK).json(signInMessage)
}

export const checkEmail = async (req, res, next) => {
    const email = req.body.email;
    console.log("이메일 중복 확인을 요청하였습니다.");
    const checkingEmailMessage = await checkingEmail(email);
    
    console.log("사용 가능한 이메일입니다.");
    return res.status(StatusCodes.OK).json(checkingEmailMessage);
}

export const checkNick = async (req, res, next) => {
    const nickname = req.body.nickname;
    console.log("닉네임 중복 확인을 요청하였습니다.");
    const checkingNickMessage = await checkingNick(nickname);
    
    console.log("사용 가능한 닉네임입니다.");
    return res.status(StatusCodes.OK).json(checkingNickMessage);
}

export const userLogin = async (req, res, next) => {
    const logIn = req.body;
    console.log("로그인을 요청하였습니다!");
    const loginUserData = await loginUser(logIn);

    console.log("로그인에 성공하였습니다.");
    return res.status(StatusCodes.OK).json(loginUserData);
    
}

export const userFindPass = async (req, res, next) => {
    const email = req.body.email;
    console.log("비밀 번호 찾기를 요청하였습니다!");
    const findUserData = await findUser(email);

    if (findUserData == -1) {
        console.log("존재하지 않는 유저입니다");
        return res.status(StatusCodes.MEMBER_NOT_FOUND).json({ message: "존재하지 않는 유저입니다" });
    }
    else {
        console.log("비밀번호 찾기를 성공하였습니다.");
        return res.status(StatusCodes.OK).send(findUserData);
    }
}