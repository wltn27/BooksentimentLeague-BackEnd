import { StatusCodes } from "http-status-codes";
import { sendEmail } from '../services/user.service.js';
import { joinUser, checkingNick, checkingEmail, loginUser, findUser, changeUser, saveVerificationCode} from './../services/user.service.js';

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

export const sendEmailVerification = async (req, res, next) => {
    console.log("Received request:", req.body);
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증번호 생성

    // redis에 인증번호 저장 service 함수
    try {
        await saveVerificationCode(email, verificationCode);      // redis에 코드 저장
        await sendEmail(email, 'Your Verification Code', `Your code is: ${verificationCode}`);
        res.status(200).send('Verification email sent');
    } catch (error) {
        res.status(500).send('Error sending verification email');
    }
};

export const userFindPass = async (req, res, next) => {
    const { email, verificationCode}= req.body;
    console.log("비밀 번호 찾기를 요청하였습니다!");
    const findUserData = await findUser(email, verificationCode);

    console.log("비밀번호 찾기를 성공하였습니다.");
    return res.status(StatusCodes.OK).json(findUserData);
}

export const userChangePass = async (req, res, next) => {
    const password = req.body.password;
    const userId = req.params.userId;
    console.log("비밀 번호 변경을 요청하였습니다!");
    const changeUserData = await changeUser(password, userId);

    console.log("비밀번호 변경을 성공하였습니다.");
    return res.status(StatusCodes.OK).json(changeUserData);
}