const nodemailer = require("nodemailer");

const sendMail = async ({ message, subject, email }) => {
  /**** create transporter */
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "16bb58f5404864",
      pass: "6ca25b14b168d0",
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
