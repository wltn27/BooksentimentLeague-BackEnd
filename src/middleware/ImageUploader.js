// ImageUploader.js
import aws from "aws-sdk";
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

aws.config.loadFromPath(path.join(__dirname, '../../config/s3.json'));

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read-write',
        key: function (req, file, cb) {
          // 파일 이름 생성
          const fileName = `${Date.now()}_${file.originalname}`;
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

/**
 * S3에서 이미지 삭제하는 함수
 * @param {string} key - 삭제할 이미지의 S3 키
 * @returns {Promise<void>} - Promise
 */
const deleteImageFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};

export { upload, deleteImageFromS3 };
