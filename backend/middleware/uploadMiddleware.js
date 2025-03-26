const multer = require("multer");
const {
  cloudinaryStorage,
  CloudinaryStorage,
} = require("multer-storage-cloudinary");
const { cloudinary } = require("../cloudinaryConfig");
const path = require("path");

function uploadMiddleware(folder) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (_req, file) => {
      const folder_path = `${folder.trim()}`;
      const file_ext = path.extname(file.originalname).substring(1);
      const public_id = `${file.fieldname}-${Date.now()}`;
      return {
        folder: folder_path,
        public_id: public_id,
        format: file_ext,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 3 * 1024 * 1024,
    },
  });
}
module.exports = uploadMiddleware;
