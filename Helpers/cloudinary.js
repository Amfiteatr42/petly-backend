const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dsfjoxy00',
  api_key: '946579837451886',
  api_secret: 'R23YUqB2s8e72nIATDkr94TcnrQ',
});

async function uploadCLD(file) {
  const result = await cloudinary.uploader.upload(file);
  return result;
}
async function removeCLD(publicId) {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
}
module.exports = {
  uploadCLD,
  removeCLD,
};
