const multer = require("multer");
const path = require("path"); // Add this line to import the 'path' module
const { fileSize, maxFileSize, allowedFile } = require("../config/secret");

const FILESIZE = Number(fileSize);
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  if (file.size > maxFileSize) {
    return cb(new Error("File size exceeds the maximum limit"), false);
  }

  if (!allowedFile.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
