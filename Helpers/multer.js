const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp');
  },
  filename: function (req, file, cb) {
    cb(null, getFileName(file, req.user.id));
  },
});

function getFileName(file, id) {
  const [fileName, fileExtention] = file.originalname.split('.');
  return fileName + '-' + id + '.' + fileExtention;
}

function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb('Wrong file format', false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
