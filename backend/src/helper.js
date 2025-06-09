const nodemailer = require("nodemailer")

function sendMail(recieverEmailId, subject, body, html = null) {
    if (!process.env.MAILER_USER || !process.env.MAILER_PASSWORD) {
        console.log("Mailer credentials are not set in environment variables");
        throw "Mailer credentials missing";
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD
        },
      });

    const mailOptions = {
        from: process.env.MAILER_USER,
        to: recieverEmailId, 
        subject: subject,
    };

    if (html) {
        mailOptions.html = html;
    } else {
        mailOptions.text = body;
    }

    return transporter.sendMail(mailOptions)
      .then(sentInfo => {
        console.log("email sent: ", sentInfo)
      })
      .catch(error => {
        console.log("email not sent: ", error)
        throw "otp sent failed, retry after sometime"
      })
}

function getEpochMilliSeconds(dateTimeString) {
  let milliseconds = Date.parse(dateTimeString)

  if(milliseconds == NaN) {
    throw "invalid date time format"
  }

  return milliseconds
}

function checkIsDateTimeFuture(milliseconds) {
  let currentMilliSeconds = Date.now()

  if(milliseconds <= currentMilliSeconds) {
    throw "date time cannot be of past"
  }

  return milliseconds
}


module.exports = {
    sendMail,
    getEpochMilliSeconds,
    checkIsDateTimeFuture
}
