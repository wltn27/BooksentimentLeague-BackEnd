import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// AWS S3 업로드 설정
const storage = multerS3({
  s3,
  acl: 'public-read',
  bucket: 'booksentimentleague-s3',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    // 파일 이름 생성 및 반환
    cb(null, `${Date.now().toString()}_${uuid()}_${file.originalname}`);
  },
});

// 파일 업로드 객체 생성
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB 파일 업로드 허용
}).array('images'); // 여러 파일 업로드를 지원하는 `multer.array()` 사용

// S3에서 이미지 삭제
export const deleteImage = (fileKey) => {
  s3.deleteObject(
    {
      Bucket: 'booksentimentleague-s3',
      Key: fileKey,
    },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.log('Image Deleted');
      }
    }
  );
};