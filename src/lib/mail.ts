import { env } from "@/env";
import { siteConfig } from "config/site";
import { Resend } from "resend";

export const sendTwoFactorEmail = async (email: string, token: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const resend = new Resend(env.RESEND_API_KEY);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `${siteConfig.name}: Two Factor Authentication Code`,
    html: `<p>Your 2FA Code: ${token}</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const resend = new Resend(env.RESEND_API_KEY);
  const confirmLink = `${env.NEXTAUTH_URL}/admin/auth/new-verification?token=${token}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `${siteConfig.name}: Confirm your email`,
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};
