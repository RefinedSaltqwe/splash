import { env } from "@/env";
import { siteConfig } from "config/site";
import { Resend } from "resend";

export const sendTwoFactorEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const companyEmail = env.EMAIL_FROM;

  const body = `<div class="container">
        <p>Dear ${name},</p>

        <p>Thank you for using <b>${siteConfig.name}</b>. As part of our ongoing commitment to keep your account secure, we have sent you this two-factor authentication code to verify your identity. Please enter this code to complete your login process.</p>

        <p>Your Two-Factor Authentication Code: <strong>${token}</strong></p>

        <p>This code will expire in 10 minutes. If you did not attempt to log in, please contact our support team immediately as your account may be at risk.</p>

        <p>If you have any questions or need assistance, please do not hesitate to contact us at <a href="mailto:setheuroaba92@gmail.com">setheuroaba92@gmail.com</a>.</p>

        <p>Thank you for choosing ${siteConfig.name}.</p>

        <p>Warm regards,<br>
        The ${siteConfig.name} Team</p>

        <div class="footer">
            <p>Please do not reply to this email as it is automatically generated.</p>
        </div>
    </div>`;

  await resend.emails.send({
    from: companyEmail,
    to: email,
    subject: `${siteConfig.name}: Two Factor Authentication Code`,
    html: body,
  });
};

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const companyEmail = env.EMAIL_FROM;
  const confirmLink = `${env.NEXTAUTH_URL}/admin/auth/new-verification?token=${token}`;
  const body = `<p>Dear ${name},</p>

        <p>Thank you for signing up for ${siteConfig.name}! We're excited to have you on board. To get started, please verify your email address.</p>

        <p><a href="${confirmLink}" class="button">Verify Your Email</a></p>

        <p>This link will expire in 24 hours. If it expires, you can request a new one from our website.</p>

        <p>If you did not create an account with ${siteConfig.name}, please disregard this email or contact our support team if you believe this is an error.</p>

        <p>For any assistance or further information, feel free to reach out to us at <a href="mailto:${companyEmail}">${companyEmail}</a>.</p>

        <p>Welcome to ${siteConfig.name}, and we look forward to providing you with [type of service provided].</p>

        <p>Best regards,<br>
        The ${siteConfig.name} Team</p>

        <div class="footer">
            <p>Please do not reply to this email as it is automatically generated.</p>
        </div>
    </div>`;

  await resend.emails.send({
    from: companyEmail,
    to: email,
    subject: `${siteConfig.name}: Confirm your email`,
    html: body,
  });
};

export const sendEmailInvitationByResend = async (
  name: string,
  email: string,
) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const companyEmail = env.EMAIL_FROM;

  const content = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Professional Team Invitation</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f2f2f2;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  h1 {
    color: #333;
  }
  p {
    color: #666;
  }
  .team-info {
    margin-bottom: 20px;
  }
  .team-info p {
    margin: 5px 0;
  }
  .btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff !important;
    text-decoration: none;
    border-radius: 5px;
  }
</style>
</head>
<body>
<div class="container">
  <h1>Join Our Professional Team</h1>
  <div class="team-info">
    <p>${name} has invited you to join them on ${siteConfig.name}.</p>
  <a href="${env.NEXT_PUBLIC_URL}/admin" class="btn">Accept Invitation</a>
  <p>Please do not reply to this email as it is automatically generated.</p>\
</div>
</body>
</html>
`;

  await resend.emails.send({
    from: companyEmail,
    to: email,
    subject: `Invitation to join ${siteConfig.name}`,
    html: content,
  });
};
