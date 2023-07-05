const cloudinary = require('./cloudinary')

async function uploadFiles(filePath) {
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: 'fixly-ecommerce',
    })
    return {
      success: true,
      url: cloudinaryResponse.secure_url,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

module.exports = uploadFiles
