const multer = require("multer");
const path = require("path"); // Add this line to import the 'path' module
const { uploadFile } = require("../config/secret");

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

const upload = multer({ storage: storage });
module.exports = upload;
