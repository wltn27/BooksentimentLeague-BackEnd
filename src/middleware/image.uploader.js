// image.uploader.js
// ./src/middleware/image.uploader.js

/* 이 업로더는 multer와 fs를 이용하여 업로드한 이미지를 루트 디렉토리의 upload 폴더에 저장하고
그 경로를 image 테이블의 image 레코드에 저장함(아마존 s3 X)*/ 
import multer from 'multer';
import fs from 'fs';
import path from 'path'; 

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext)+ ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});


try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

export const deleteImage = (imageName) => {
  const imagePath = path.join('uploads', imageName);

  try {
    fs.unlinkSync(imagePath);
    console.log(`${imageName}를 성공적으로 삭제했습니다.`);
  } catch (error) {
    console.error(`${imageName} 삭제 중 오류 발생:`, error);
  }
};