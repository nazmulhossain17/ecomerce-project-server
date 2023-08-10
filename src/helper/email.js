const nodemailer = require("nodemailer");
const { smtpuser, smtppassword } = require("../config/secret");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: smtpuser,
      pass: smtppassword
    }
  });
  

const sendEmailWithNodMailer = async(emailData) =>{
    try {
        const mailOptions = {
        
            from: smtpuser, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
     };
     const info = await transporter.sendMail(mailOptions)
     console.log('Message sent:', info.response)
    } catch (error) {
        console.log(error.message);
        throw error;
    }

}

module.exports = sendEmailWithNodMailer;