import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { StatusCodes } from "http-status-codes";
import { joinUser, checkingNick, loginUser} from './../services/user.service.js';

export const userSignin = async (req, res, next) => {
    const signIn = req.body;
    console.log("회원가입을 요청하였습니다!");
    console.log("body:", signIn); // 값이 잘 들어오는지 테스트

    const signInData = await joinUser(req.body);
    console.log("signIndata: ", signInData);
    
    if(signInData == -1){
        console.log("아이디가 중복 됩니다.");
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "중복된 이메일입니다.",
          }); 
    } else {
        console.log("회원 가입 성공");
        return res.status(StatusCodes.OK).json({
            message: "회원가입 성공",
        });
    }
}

export const checkNick = async (req, res, next) => {
    const nickname = req.body.nickname;

    const nicknameData = await checkingNick(nickname);
    
    if(nicknameData == -1){
        console.log("닉네임이 중복 됩니다.");
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "중복된 닉네임입니다.",
          }); 
    } else {
        console.log("사용 가능한 닉네임입니다.");
        return res.status(StatusCodes.OK).send(nicknameData);
    }
}

export const userLogin = async (req, res, next) => {
    const logIn = req.body;
    console.log("로그인을 요청하였습니다!");
    const loginUserData = await loginUser(logIn);

    if (loginUserData == -1) {
        console.log("존재하지 않는 유저입니다");
        return res.status(StatusCodes.MEMBER_NOT_FOUND).json({ message: "존재하지 않는 유저입니다" });
    } 
    else if((loginUserData == -2)){
        console.log("비밀번호가 틀렸습니다.");
        return res.status(StatusCodes.PARAMETER_IS_WRONG).json({ message: "비밀번호가 틀렸습니다." });
    } 
    else {
        console.log("로그인에 성공하였습니다.");
        return res.status(StatusCodes.OK).send(loginUserData);
    }
}