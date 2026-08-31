const cloudinary = require('cloudinary').v2;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadToCloudinary = async (filePath) => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'devtask_uploads',
      });
      return result.secure_url;
    } catch (error) {
      console.warn('Cloudinary upload failed, falling back to local file URL:', error.message);
      return null;
    }
  }
  return null;
};

module.exports = { uploadToCloudinary };
