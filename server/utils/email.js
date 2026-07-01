import { Resend } from "resend";

console.log("API:", process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, firstName, token) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verificationUrl = `${process.env.SERVER_URL}/auth/verify/${token}`;

  await resend.emails.send({
    from: "Mentify <onboarding@resend.dev>",
    to: email,
    subject: "Bienvenido a Mentify 🎉",
    html: `
      <h2>Hola ${firstName}</h2>

      <p>Gracias por registrarte en Mentify.</p>

      <a href="${verificationUrl}">
        Verificar cuenta
      </a>
    `,
  });
};
