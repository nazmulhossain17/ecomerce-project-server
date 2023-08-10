require('dotenv').config();

const smtpuser = process.env.SMTP_USERNAME;
const smtppassword = process.env.SMTP_PASSWORD;
const jwtKey = process.env.JWT_AC_KEY;
const dbURL = process.env.DB_URL;
const clientURL = process.env.CLIENT_URL;


module.exports = {smtpuser, smtppassword, jwtKey, dbURL, clientURL}