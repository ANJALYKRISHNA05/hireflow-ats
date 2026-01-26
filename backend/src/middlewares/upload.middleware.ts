import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'hireflow-ats/resumes',
      public_id: `${(req as any).user.id}-${Date.now()}`,
      resource_type: 'raw',
      allowed_formats: ['pdf', 'doc', 'docx'],
    };
  },
}) as any;


export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  },
});


export const uploadFields = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]);
