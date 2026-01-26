declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { CloudinaryOptions } from 'cloudinary';

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryOptions);
  }
}