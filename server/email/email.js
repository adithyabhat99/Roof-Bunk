module.exports= (email, subject, text) => {
  const mailer = require("nodemailer");
  const config = require("./email_config");

  const transporter = mailer.createTransport(config);

  var mailOptions = {
    from: "roofandbunk@gmail.com",
    to: email,
    subject: subject,
    text: text
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error;
    else console.log("Email Sent");
  });
};