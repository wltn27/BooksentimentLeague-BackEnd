export const signinResponseDTO = (user) => {
    console.log(user[0]);
    console.log("signinResponseDTO clear");
    return {"email": user[0].email, "name": user[0].password, "nick": user[0].nickname};
}