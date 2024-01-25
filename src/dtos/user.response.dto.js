// 회원가입 DTO 반환 안 시킴
export const signinResponseDTO = () => {
    console.log("signinResponseDTO clear");
    return {"message" : "회원 가입에 성공하였습니다."};
}

export const checkEmailResponseDTO = () => {
    console.log("checkEmailResponseDTO clear");
    return {"message" : "사용 가능한 이메일입니다."};
}

export const checkNickResponseDTO = () => {
    console.log("checkNickResponseDTO clear");
    return {"message" : "사용 가능한 닉네임입니다."};
}

export const loginResponseDTO = (user) => {
    console.log("loginResponseDTO clear");
    return {"email": user[0].email, "nickname": user[0].nickname};
}

export const followResponseDTO = (followingId, userId) => {
    console.log("followResponseDTO clear");
    return {"follow_status" : "follow"};
};

// 성공 응답 DTO 
export const successResponseDTO = (message, data = {}) => {
    return {
      status: 'success',
      message,
      data,
    };
  };
  
  export const errorResponseDTO = (message, error = {}) => {
    return {
      status: 'error',
      message,
      error,
    };
  }