const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: 'metaspacechain.com',
    pass: 'Shas789@#$',
  },
});

exports.sendOnboardingEmail = async ({ to, name, email, password }) => {
  const mailOptions = {
    from: `shashank@metaspacechain.com`,
    to,
    subject: "Welcome to PostPilot AI 🚀",
    html: `
      <h2>Welcome ${name} 👋</h2>
      <p>Your account has been successfully created.</p>
      <p><strong>Login Details:</strong></p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <br/>
      <p>Please login and change your password after first login.</p>
      <a href="https://aipost.bastionex.net/login">Login Now</a>
      <br/><br/>
      <p>Best Regards,<br/>Team LinkAutomate</p>
    `,
  };
  console.log('mail', mailOptions)

  await transporter.sendMail(mailOptions);
};
//postpilot
//return.smtp2go.net