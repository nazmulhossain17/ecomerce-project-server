require("dotenv").config();

const smtpuser = process.env.SMTP_USERNAME;
const smtppassword = process.env.SMTP_PASSWORD;
const jwtKey = process.env.JWT_AC_KEY;
const dbURL = process.env.DB_URL;
const clientURL = process.env.CLIENT_URL;
const uploadFile = process.env.UPLOAD_PATH;
const fileSize = process.env.MAX_FILE_SIZE;
const fileType = process.env.FILE_TYPES;
const maxFileSize = process.env.FILE_TYPES;
const allowedFile = process.env.FILE_TYPES;
const jwtAccessKey = process.env.JWT_ACCESS_KEY;

module.exports = {
  smtpuser,
  smtppassword,
  jwtKey,
  dbURL,
  clientURL,
  uploadFile,
  fileSize,
  fileType,
  maxFileSize,
  allowedFile,
  jwtAccessKey,
};
