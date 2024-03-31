const nodemailer = require("nodemailer");

const sendMail = async ({ message, subject, email }) => {
  /**** create transporter */
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT * 1,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  /**** define mail options */
  const mailOptions = {
    from: "Kofi Boateng boatengkofiisaac3@gmail.com",
    to: email,
    subject,
    text: message,
    html: message,
  };

  /*** send with nodemailer */
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
