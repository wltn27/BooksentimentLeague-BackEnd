// alarm.dto.js


// alarm DTO
export const alarmDTO = (data) => {
    return {
        "title": data[0].title,
        "content": data[0].content,
        "read_at" : data[0].read_at,
        "created_at": data[0].created_at,
    };
};