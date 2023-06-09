const cloudinary = require("./cloudinary");

async function uploadFiles(filePath) {
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: "fixly-ecommerce",
    });
    console.log(cloudinaryResponse);
    return {
      success: true,
      response: cloudinaryResponse.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

module.exports = uploadFiles;
