const nodemailer = require('nodemailer');

const mailService = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      // secure: "true",
      port: 587,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject,
      text,
      html,
    });
    return 'sent succesfully';
  } catch (err) {
    console.error(err);
    return 'sent unsuccesful';
  }
};

export default mailService;
