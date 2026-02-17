const nodemailer = require("nodemailer");

/* ==============================
   TRANSPORTER
============================== */

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,   // set in .env
    pass: process.env.SMTP_PASS,   // set in .env
  },
});

/* ==============================
   COMMON TEMPLATE WRAPPER
============================== */

const emailWrapper = (content) => `
  <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:40px;">
    <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
      ${content}
      <hr style="margin-top:40px"/>
      <p style="font-size:12px; color:#888;">
        © ${new Date().getFullYear()} PostPilot AI. All rights reserved.
      </p>
    </div>
  </div>
`;

/* ==============================
   ONBOARDING EMAIL
============================== */

exports.sendOnboardingEmail = async ({ to, name, email, password }) => {
  const html = emailWrapper(`
    <h2>Welcome ${name} 👋</h2>
    <p>Your account has been successfully created.</p>

    <h3>Login Details</h3>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Password:</strong> ${password}</p>

    <p>Please login and change your password after first login.</p>

    <a href="${process.env.FRONTEND_URL}/login"
       style="display:inline-block;padding:12px 20px;background:#2563eb;color:white;border-radius:6px;text-decoration:none;">
       Login Now
    </a>
  `);

  await transporter.sendMail({
    from: `"PostPilot AI" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Welcome to PostPilot AI 🚀",
    html,
  });
};


/* ==============================
   FORGOT PASSWORD EMAIL
============================== */

exports.sendForgotPasswordEmail = async ({ to, name, resetLink }) => {
  const html = emailWrapper(`
    <h2>Password Reset Request 🔐</h2>
    <p>Hello ${name || "User"},</p>

    <p>We received a request to reset your password.</p>

    <p>
      Click the button below to reset your password:
    </p>

    <a href="${resetLink}"
       style="display:inline-block;padding:12px 20px;background:#ef4444;color:white;border-radius:6px;text-decoration:none;">
       Reset Password
    </a>

    <p style="margin-top:20px;font-size:13px;color:#666;">
      If you didn’t request this, please ignore this email.
      This link will expire soon.
    </p>
  `);

  await transporter.sendMail({
    from: `"PostPilot AI" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Reset Your Password",
    html,
  });
};
