const multer = require("multer");
const createError = require("http-errors");
const path = require("path"); // Add this line to import the 'path' module
const { uploadFile, fileType, fileSize } = require("../config/secret");

const FILESIZE = Number(fileSize);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFile);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!fileType.includes(extname.substring(1))) {
    const err = createError(400, "File type not allowed");
    return cb(err);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, limits: { FILESIZE }, fileFilter });
module.exports = upload;
