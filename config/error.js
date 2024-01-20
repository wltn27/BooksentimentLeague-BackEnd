// config/error.js

export class BaseError extends Error {
    constructor(data){
        super(data.message);
        this.data = data;
    }
};

export function errorResponse(res, message, statusCode = 500) {
    res.status(statusCode).json({
        success: false,
        message: message
    });
}