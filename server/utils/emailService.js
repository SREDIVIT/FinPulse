import nodemailer from 'nodemailer';

/**
 * Sends an authentic password reset OTP email
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.otp - 6-digit verification code
 * @param {string} options.userName - Recipient name
 */
export const sendOtpEmail = async ({ to, otp, userName = 'FinTrack User' }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; color: #f8fafc; }
        .wrapper { max-width: 520px; margin: 30px auto; background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; }
        .logo-title { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
        .logo-sub { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 4px; }
        .content { padding: 32px 28px; }
        .title { font-size: 20px; font-weight: 700; color: #f8fafc; margin-top: 0; margin-bottom: 12px; }
        .desc { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; }
        .otp-container { text-align: center; margin: 28px 0; padding: 20px; background: rgba(99, 102, 241, 0.1); border-radius: 12px; border: 1px dashed rgba(99, 102, 241, 0.35); }
        .otp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #a5b4fc; font-weight: 600; margin-bottom: 8px; }
        .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #818cf8; margin: 0; font-family: monospace; }
        .expiry-note { font-size: 12px; color: #64748b; margin-top: 8px; }
        .footer { padding: 20px 28px; background-color: rgba(15, 23, 42, 0.5); border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1 class="logo-title">FinPulse</h1>
          <div class="logo-sub">Smart Personal Finance Intelligence</div>
        </div>
        <div class="content">
          <h2 class="title">Password Reset Verification</h2>
          <p class="desc">Hello ${userName},<br>We received a request to reset the password for your FinTrack account. Enter the verification code below to complete your password reset.</p>
          
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry-note">⏱️ Code expires in 10 minutes</div>
          </div>

          <p class="desc" style="font-size: 13px; margin-bottom: 0;">
            If you did not request this code, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} FinTrack / FinPulse Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. If real SMTP credentials provided in server/.env, deliver to actual inbox
  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      const info = await transporter.sendMail({
        from: `"FinPulse Security" <${emailUser}>`,
        to,
        subject: `Your FinTrack Verification Code: ${otp}`,
        text: `Your FinTrack verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent
      });

      console.log(`[Email Service] Delivered OTP email to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId, isDelivered: true };
    } catch (smtpErr) {
      console.error(`[Email Service] SMTP error: ${smtpErr.message}`);
    }
  }

  // 2. Dev / Fallback mode: Print to server console so developer always has the OTP
  console.log(`\n=================================================`);
  console.log(`📧 [FinPulse Security] Verification Code Sent to: ${to}`);
  console.log(`🔑 Verification OTP: ${otp}`);
  console.log(`⏱️  Expires in: 10 minutes`);
  console.log(`=================================================\n`);

  return {
    success: true,
    isDelivered: false,
    otp,
    note: 'Delivered to console/dev channel'
  };
};
