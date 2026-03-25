import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

export async function sendContactEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  to: string;
  portfolioSlug?: string;
}) {
  const { name, email, subject, message, to, portfolioSlug } = params;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: to || process.env.EMAIL_TO,
    replyTo: email,
    subject: `Portfolio: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6C63FF">New Contact Form Submission</h2>
        <hr style="border:1px solid #eee">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${portfolioSlug ? `<p><strong>Portfolio:</strong> ${portfolioSlug}</p>` : ""}
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p style="background:#f5f5f5;padding:16px;border-radius:8px">${message}</p>
      </div>
    `,
  });
}
