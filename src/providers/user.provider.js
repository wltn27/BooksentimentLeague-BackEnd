import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { followerListDTO, followingListDTO, sentimentResponseDTO } from "./../dtos/user.response.dto.js"
import { getMyPage, getFollowerList, getFollowingList, getSentimentList, getScrapList} from "../models/user.dao.js";

export const readMyPage = async (user_id, file) => {
    
    const userData = await getMyPage(user_id);
    const img_array = file.location;
    console.log(userData);

    return userData;
}

export const readFollowerList = async(user_id) => {
    const followObject = await getFollowerList(user_id);

    return followerListDTO(followObject);
}

export const readFollowingList = async(user_id) => {
    const followObject = await getFollowingList(user_id);

    return followingListDTO(followObject);
}

export const readSentimentList = async(user_id) => {
    const sentimentObject = await getSentimentList(user_id);

    return sentimentResponseDTO(sentimentObject);
}

export const readScrapList = async(user_id) => {
    const scrapObject = await getScrapList(user_id);

    return sentimentResponseDTO(scrapObject);
}

// for문 바꾸기 1개짜리로

// // 이미지 수정하기
// export const modifyImage = async (sentimentId, body, files) => {
//     try {
//         const conn = await pool.getConnection();
//         console.log('image_paths: ', body.image);

//         const oldImg = await pool.query(getImageSql, [sentimentId]);
//         console.log('oldImg: ', oldImg);

//         const imageArray = oldImg[0].map(imageInfo => imageInfo.image);
//         console.log('imageArray: ', imageArray);

//         // body.image와 db에 삽입된 이미지를 비교하여 삭제할 이미지 추출
//         const imagesToDelete = imageArray.filter(imageValue => !body.image || !body.image.includes(imageValue));
//         console.log('imagesToDelete: ', imagesToDelete);

//         // imagesToDelete 배열에 있는 이미지 삭제
//         for (const deleteImg of imagesToDelete) {
//             console.log('deleteImg: ', deleteImg);
//             const imgUrl = new URL(deleteImg);
//             const key = imgUrl.pathname.substring(1);
//             await deleteImageFromS3(key); // S3에서 삭제
//             await pool.query(deleteImageSql, [sentimentId, deleteImg]); // DB에서 삭제
//         }

//         // body.image에 있는 이미지 삽입
//         if (body.image !== undefined && body.image !== null) {
//             const newImages = Array.isArray(body.image) ? body.image : [body.image]; // body.image가 배열이 아니라면 배열로 변환
//             for (const newImg of newImages) {
//                 if (newImg !== '') { // 빈 문자열 체크
//                     console.log('body.image: ', newImg);
//                     await pool.query(insertImageSql, [sentimentId, newImg]); // DB에 삽입
//                 }
//             }
//         }

//         // 새로운 파일로 업로드된 이미지 삽입
//         if (files && files.length > 0) {
//             for (const file of files) {
//                 const newImage = file.location;
//                 if (newImage !== '') { // 빈 문자열 체크
//                     console.log('files.location: ', newImage);
//                     await pool.query(insertImageSql, [sentimentId, newImage]); // DB에 삽입
//                 }
//             }
//         }

//         // 연결 해제 및 결과 반환
//         conn.release();
//         return { "message": "이미지가 수정되었습니다." };
//     } catch (err) {
//         console.error(err);
//         throw new BaseError(status.PARAMETER_IS_WRONG);
//     }
// }