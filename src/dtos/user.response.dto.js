export const signinResponseDTO = (user) => {
    console.log("signinResponseDTO clear");
    return {"email": user[0].email, "password": user[0].password, "nickname": user[0].nickname};
}

export const checkNickResponseDTO = (nicknameData) => {
    console.log("checkNickResponseDTO clear");
    if(nicknameData != -1)
        return {"message" : "사용 가능한 닉네임입니다."};
}

export const loginResponseDTO = (user) => {
    console.log("loginResponseDTO clear");
    return {"email": user[0].email, "nickname": user[0].nickname};
}