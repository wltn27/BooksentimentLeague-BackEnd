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
  };