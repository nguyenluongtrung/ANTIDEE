const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Email server connection error:', error);
  } else {
    console.log('Email server is ready to take messages');
  }
});

const sendMail = async ({ email, subject, html }) => {
  const message = {
    from: 'Antidee <no-reply@antidee.com>',
    to: email,
    subject: subject,
    html: html
  };

  try {
    const result = await transporter.sendMail(message);
    console.log(`Email sent to ${email}: ` + result.response);
    return result;
  } catch (error) {
    console.error(`Error sending email to ${email}: `, error);
    throw error;
  }
};

module.exports = sendMail;
