import { Resend } from 'resend';

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: 'NextJS Auth <no-reply@resend.dev>',
    to: email,
    subject: 'Confirm your email',
    html: `
      <div style="text-align: center; margin: 20px;">
        <h2 style="text-align: center;">Verify your email address</h2>
        <p style="text-align: center; font-size: 15px;">
          Please confirm that you want to use this as your NextAuth account email. Once it's done you will be able to log in.
          Click <a href="${confirmLink}">here</a> or button below to verify your email address.
        </p>
        <p style="text-align: center; margin-top: 25px;">
          <a href="${confirmLink}" style="background-color: #075985; width: 100%; padding: 14px; color: #fff; text-align: center; display: block; font-size: 18px;">Verify my email</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.log(error);
    throw new Error("failed to send email");
  }

  return data;
};

export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const confirmLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: 'NextJS Auth <no-reply@resend.dev>',
    to: email,
    subject: 'Reset your NextJSAuth password',
    html: `
      <div style="text-align: center;
      margin: 20px auto;
      padding: 0px 15px;
      max-width: 500px;">
        <h2 style="text-align: center;">Reset your password</h2>
        <p style="text-align: center; font-size: 15px;">
          Please confirm that you want to reset your password. Once it's done you will be able to log in with new password.
          Click <a href="${confirmLink}">here</a> or button below to reset your password.
        </p>
        <p style="text-align: center; margin-top: 25px;">
          <a href="${confirmLink}" style="background-color: #075985; padding: 14px 30px; color: #fff; text-align: center; font-size: 18px; text-decoration: none;">Reset your password</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.log(error);
    throw new Error("failed to send email");
  }

  return data;
};