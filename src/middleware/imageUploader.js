// ImageUploader.js
import aws from "aws-sdk";
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.bmp'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({
    storage: multerS3({
        s3: new S3Client({
          region: process.env.AWS_S3_REGION,
          credentials: {
              accessKeyId: process.env.AWS_S3_ACCESS_KEY,
              secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
          }
        }),
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read-write',
        key: function (req, file, cb) {
          // 파일 이름 생성
          const folderPath = 'sentiment/'; // 여기에 원하는 폴더 경로를 추가
          //const fileName = `${folderPath}${Date.now()}_${file.originalname}`;
          const fileName = `${folderPath}${uuid()}_${file.originalname}`;
          cb(null, fileName);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Invalid file type'));
        }
        cb(null, true);
    },
});

const profile_upload = multer({
  storage: multerS3({
      s3: new S3Client({
        region: process.env.AWS_S3_REGION,
        credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
        }
      }),
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read-write',
      key: function (req, file, cb) {
        // 파일 이름 생성
        const folderPath = 'profile/'; // 여기에 원하는 폴더 경로를 추가
        const fileName = `${folderPath}${uuid()}_${file.originalname}`;
        cb(null, fileName);
      },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
  fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      console.log("ext :", ext);
      if (!allowedExtensions.includes(ext)) {
          return cb(new Error('Invalid file type'));
      }
      cb(null, true);
  },
});

/**
 * S3에서 이미지 삭제하는 함수
 * @param {string} key - 삭제할 이미지의 S3 키
 * @returns {Promise<void>} - Promise
 */


const deleteImageFromS3 = async (key) => {
  // AWS S3 서비스 초기화
  const s3 = new S3Client({
    region: process.env.AWS_S3_REGION, // AWS 리전 설정
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    // DeleteObjectCommand를 사용하여 S3 객체 삭제
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`Object deleted successfully: ${key}`);
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};


export { upload, profile_upload, deleteImageFromS3 };