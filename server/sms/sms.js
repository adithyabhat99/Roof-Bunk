module.exports = (number, message) => {
  const config = require("./twilio_config");
  const accountSid = config["accountSid"];
  const authToken = config["authToken"];

  const twilio = require("twilio")(accountSid, authToken);

  twilio.messages
    .create({
      body: message,
      from: "+19073181397",
      to: number
    })
    .then(message => console.log(message.sid));
};