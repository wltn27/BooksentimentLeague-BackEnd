export const signinResponseDTO = (user) => {
    console.log("signinResponseDTO clear");
    return {"email": user[0].email, "name": user[0].password, "nick": user[0].nickname};
}

export const checkNickResponseDTO = (nicknameData) => {
    console.log("checkNickResponseDTO clear");
    if(nicknameData != -1)
        return {"message" : "사용 가능한 닉네임입니다."};
}