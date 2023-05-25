const nodemailer = require('nodemailer');

const noreplyTransport = nodemailer.createTransport({
    port: process.env.EMAIL_PORT || undefined,
    host: process.env.EMAIL_HOST || undefined,
    service: process.env.EMAIL_SERVICE || undefined,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
})


module.exports = {
    noreplyTransport: noreplyTransport
}