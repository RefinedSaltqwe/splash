import { env } from "@/env";
import { siteConfig } from "config/site";
import { Resend } from "resend";

export const sendTwoFactorEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await resend.emails.send({
    from: companyEmail,
    to: email,
    subject: `${siteConfig.name}: Confirm your email`,
    html: body,
  });
};
